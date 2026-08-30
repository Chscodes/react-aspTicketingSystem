namespace backend.Models.Base;

public abstract class BaseEntity
{
    public Guid id { get; set; } = Guid.NewGuid();

    public bool isDeleted { get; set; } = false;

    public DateTime createdAt { get; set; }

    public DateTime updatedAt { get; set; }
}