namespace backend.DTOs.Tickets;

public class TicketAttachmentResponse
{
    public Guid id { get; set; }
    public string file_name { get; set; } = string.Empty;
    public string content_type { get; set; } = string.Empty;
    public long file_size { get; set; }
    public bool isDeleted { get; set; }
}