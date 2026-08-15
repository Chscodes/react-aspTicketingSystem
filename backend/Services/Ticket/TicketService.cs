using backend.Data;
using backend.DTOs.Tickets;
using backend.Models;
using Microsoft.EntityFrameworkCore;

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
                    "Project not found."
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

            // 4. Add
            _context.Tickets.Add(ticket);

            // 5. Save
            await _context.SaveChangesAsync();

            // 6. Commit
            await transaction.CommitAsync();

            // 7. Return DTO
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
}