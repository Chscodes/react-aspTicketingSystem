using backend.Models.Enumerations;

namespace backend.DTOs.Tickets;

public class UpdateTicketStatusRequest
{
    public TicketStatus status { get; set; }
}