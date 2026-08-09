// Project.model.cs
namespace backend.Models;

public class Project
{
    public Guid id { get; set; } = Guid.NewGuid(); // GUID is for UUID primary Key

    public string project_name { get; set; } = string.Empty;

    public string remarks { get; set; } = string.Empty;

    public bool isDeleted { get; set; } = false;

    // para sa relationship sa Ticket na malaman siya ang mag collect or MOTHER
    // Navigation Property
    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}