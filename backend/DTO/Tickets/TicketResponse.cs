using backend.Models.Enumerations;

namespace backend.DTOs.Tickets;

public class TicketResponse
{
    public Guid id { get; set; }

    public Guid? project_id { get; set; }

    public string? project_name { get; set; }

    public string reference_no { get; set; } = string.Empty;

    public string contact_person { get; set; } = string.Empty;

    public string? contact_email { get; set; } = string.Empty;

    public string description { get; set; } = string.Empty;

    public TicketStatus status { get; set; }

    public bool isDeleted { get; set; }

    public DateTime createdAt { get; set; }

    public DateTime updatedAt { get; set; }

     public List<TicketAttachmentResponse> attachments { get; set; } = new();
}