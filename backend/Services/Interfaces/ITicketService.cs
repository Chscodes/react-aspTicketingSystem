using backend.DTOs.Tickets;
using backend.Models;
using backend.Models.Enumerations;

namespace backend.Services.Interfaces;

public interface ITicketService
{
    Task<TicketResponse> CreateAsync(CreateTicketRequest request);
    Task<IReadOnlyList<TicketResponse>> GetByProjectAsync(Guid projectId);
    Task<TicketResponse?> GetByIdAsync(Guid ticketId);
    Task CancelAsync(Guid ticketId);
    Task UpdateStatusAsync(Guid ticketId, TicketStatus status);
    Task<TicketAttachment?> GetAttachmentAsync(Guid attachmentId);
}
