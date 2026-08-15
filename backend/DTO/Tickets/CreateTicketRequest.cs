using backend.Models.Enumerations;

namespace backend.DTOs.Tickets;

public class CreateTicketRequest
{
    public Guid project_id { get; set; }

    public string contact_person { get; set; } = string.Empty;

    public string contact_email { get; set; } = string.Empty;

    public string description { get; set; } = string.Empty;

}