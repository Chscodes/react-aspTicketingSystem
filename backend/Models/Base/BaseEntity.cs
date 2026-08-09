namespace backend.Models.Base;

public abstract class BaseEntity
{
    public Guid id { get; set; } = Guid.NewGuid();

    public DateTime createdAt { get; set; }

    public DateTime updatedAt { get; set; }
}