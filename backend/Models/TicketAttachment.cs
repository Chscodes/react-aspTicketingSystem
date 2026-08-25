using backend.Models.Base;

namespace backend.Models;

public class TicketAttachment : BaseEntity
{
    public Guid ticket_id { get; set; }

    public string file_name { get; set; } = string.Empty;

    public string content_type { get; set; } = string.Empty;

    public long file_size { get; set; }

    public byte[] file_data { get; set; } = Array.Empty<byte>();

    // Navigation Property
    public Ticket? Ticket { get; set; }
}