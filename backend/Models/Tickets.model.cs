// Ticket.model.cs
using backend.Models.Enumerations;
using backend.Models.Base;
namespace backend.Models;
public class Ticket : BaseEntity
{
    // public int id { get; set; }
    //  public Guid id { get; set; } = Guid.NewGuid();// GUID is for UUID primary Key (nilagay ko sa baseEntity)

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

     public ICollection<TicketAttachment> attachments { get; set; }
        = new List<TicketAttachment>();
}