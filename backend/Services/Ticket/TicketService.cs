using backend.Data;
using backend.DTOs.Tickets;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Models.Enumerations;

namespace backend.Services;

public class TicketService
{
    private readonly AppDbContext _context;
    private readonly TicketReferenceNumberService _referenceNumberService;

    public TicketService(
        AppDbContext context,
        TicketReferenceNumberService referenceNumberService)
    {
        _context = context;
        _referenceNumberService = referenceNumberService;
    }

    public async Task<TicketResponse> CreateTicket(
    CreateTicketRequest request)
    {
        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            // 1. Find Project
            var project = await _context.Projects
                .FirstOrDefaultAsync(
                    p => p.id == request.project_id
                );

            if (project == null)
            {
                throw new KeyNotFoundException(
                    "Project not founds."
                );
            }

            // 2. Generate reference number
            var referenceNo =
                await _referenceNumberService
                    .GenerateTicketReferenceNumber(project);

            // 3. Create Ticket
            var ticket = new Ticket
            {
                project_id = project.id,
                reference_no = referenceNo,
                contact_person = request.contact_person,
                contact_email = request.contact_email,
                description = request.description
            };

            // 4. Add Ticket
            _context.Tickets.Add(ticket);

            // 5. Save Ticket first
            await _context.SaveChangesAsync();

            // 6. Add Attachments
          if (request.Attachments != null &&
                request.Attachments.Count > 0)
            {
                foreach (var file in request.Attachments)
                {
                    await using var stream = new MemoryStream();

                    await file.CopyToAsync(stream);

                    var attachment = new TicketAttachment
                    {
                        ticket_id = ticket.id,
                        file_name = file.FileName,
                        content_type = file.ContentType,
                        file_size = file.Length,
                        file_data = stream.ToArray()
                    };

                    _context.TicketAttachments.Add(attachment);
                }

                await _context.SaveChangesAsync();
            }

            // 8. Commit
            await transaction.CommitAsync();

            // 9. Return DTO
            return new TicketResponse
            {
                id = ticket.id,
                project_id = ticket.project_id,
                reference_no = ticket.reference_no,
                contact_person = ticket.contact_person,
                contact_email = ticket.contact_email,
                description = ticket.description,
                status = ticket.status,
                isDeleted = ticket.isDeleted
            };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }


    public async Task<List<TicketResponse>> GetTicketsData(Guid projectId)
    {
        var tickets = await _context.Tickets
            .Where(t => t.project_id == projectId && !t.isDeleted && t.status != TicketStatus.Cancelled)
            .Select(t => new TicketResponse
            {
                id = t.id,
                project_id = t.project_id,
                reference_no = t.reference_no,
                contact_person = t.contact_person,
                contact_email = t.contact_email,
                description = t.description,
                status = t.status,
                isDeleted = t.isDeleted
            })
            .ToListAsync();

        return tickets;
    }

    public async Task cancelTicketService(Guid ticket_id)
    {
        await using var transaction =  await _context.Database.BeginTransactionAsync();

            try {
                var ticket = await _context.Tickets.FindAsync(ticket_id);

                if (ticket == null)
                {
                    throw new KeyNotFoundException("Ticket not found.");
                }

                ticket.status = TicketStatus.Cancelled;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch {
                await transaction.RollbackAsync();
                throw;   
            }
    }


    public async Task<TicketResponse?> GetTicketsDataById(Guid ticketId)
    {
        var ticket = await (
            from t in _context.Tickets
            join p in _context.Projects
                on t.project_id equals p.id
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
                updatedAt = t.updatedAt
            }
        ).FirstOrDefaultAsync();

        return ticket;
    }
}