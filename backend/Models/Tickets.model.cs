// Ticket.model.cs
using backend.Models.Enumerations;
namespace backend.Models;
public class Ticket
{
    // public int id { get; set; }
     public Guid id { get; set; } = Guid.NewGuid();// GUID is for UUID primary Key

    public Guid? project_id { get; set; }

    public string reference_no { get; set; } = string.Empty;

    public string contact_person { get; set; } = string.Empty;
    
    public string contact_email { get; set; } = string.Empty;

    public string description { get; set; } = string.Empty;

    public TicketStatus status { get; set; } = TicketStatus.New;

    public bool isDeleted { get; set; } = false;

    // para sa relationship sa Project na malaman siya e collect or CHILD
    // Navigation Property
    public Project? Project { get; set; } = null!;
}