using backend.Data;
using backend.DTOs.Tickets;
using backend.Models;
using backend.Models.Enumerations;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TicketService : ITicketService
{
    private readonly AppDbContext _context;
    private readonly ITicketReferenceNumberService _referenceNumberService;

    public TicketService(
        AppDbContext context,
        ITicketReferenceNumberService referenceNumberService)
    {
        _context = context;
        _referenceNumberService = referenceNumberService;
    }

    public async Task<TicketResponse> CreateAsync(CreateTicketRequest request)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.id == request.project_id && !p.isDeleted)
                ?? throw new KeyNotFoundException("Project not found.");

            var referenceNo = await _referenceNumberService.GenerateAsync(project);

            var ticket = new Ticket
            {
                project_id = project.id,
                reference_no = referenceNo,
                contact_person = request.contact_person,
                contact_email = request.contact_email,
                description = request.description
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            if (request.Attachments is { Count: > 0 })
            {
                foreach (var file in request.Attachments)
                {
                    await using var stream = new MemoryStream();
                    await file.CopyToAsync(stream);

                    _context.TicketAttachments.Add(new TicketAttachment
                    {
                        ticket_id = ticket.id,
                        file_name = file.FileName,
                        content_type = file.ContentType,
                        file_size = file.Length,
                        file_data = stream.ToArray()
                    });
                }

                await _context.SaveChangesAsync();
            }

            await transaction.CommitAsync();

            return MapToResponse(ticket);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<IReadOnlyList<TicketResponse>> GetByProjectAsync(Guid projectId)
    {
        return await _context.Tickets
            .AsNoTracking()
            .Where(t =>
                t.project_id == projectId &&
                !t.isDeleted &&
                t.status != TicketStatus.Cancelled)
            .OrderByDescending(t => t.createdAt)
            .Select(t => new TicketResponse
            {
                id = t.id,
                project_id = t.project_id,
                reference_no = t.reference_no,
                contact_person = t.contact_person,
                contact_email = t.contact_email,
                description = t.description,
                status = t.status,
                isDeleted = t.isDeleted,
                createdAt = t.createdAt,
                updatedAt = t.updatedAt
            })
            .ToListAsync();
    }

    public async Task<TicketResponse?> GetByIdAsync(Guid ticketId)
    {
        return await (
            from t in _context.Tickets.AsNoTracking()
            join p in _context.Projects.AsNoTracking() on t.project_id equals p.id
            where t.id == ticketId
            select new TicketResponse
            {
                id = t.id,
                project_id = t.project_id,
                project_name = p.project_name,
                reference_no = t.reference_no,
                contact_person = t.contact_person,
                contact_email = t.contact_email,
                description = t.description,
                status = t.status,
                isDeleted = t.isDeleted,
                createdAt = t.createdAt,
                updatedAt = t.updatedAt,
                attachments = t.attachments
                    .Select(a => new TicketAttachmentResponse
                    {
                        id = a.id,
                        file_name = a.file_name,
                        content_type = a.content_type,
                        file_size = a.file_size
                    })
                    .ToList()
            }
        ).FirstOrDefaultAsync();
    }

    public async Task CancelAsync(Guid ticketId)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId)
            ?? throw new KeyNotFoundException("Ticket not found.");

        ticket.status = TicketStatus.Cancelled;
        await _context.SaveChangesAsync();
    }

    public async Task UpdateStatusAsync(Guid ticketId, TicketStatus status)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId)
            ?? throw new KeyNotFoundException("Ticket not found.");

        ticket.status = status;
        await _context.SaveChangesAsync();
    }

    public async Task<TicketAttachment?> GetAttachmentAsync(Guid attachmentId)
    {
        return await _context.TicketAttachments
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.id == attachmentId);
    }

    private static TicketResponse MapToResponse(Ticket t) => new()
    {
        id = t.id,
        project_id = t.project_id,
        reference_no = t.reference_no,
        contact_person = t.contact_person,
        contact_email = t.contact_email,
        description = t.description,
        status = t.status,
        isDeleted = t.isDeleted,
        createdAt = t.createdAt,
        updatedAt = t.updatedAt
    };
}
