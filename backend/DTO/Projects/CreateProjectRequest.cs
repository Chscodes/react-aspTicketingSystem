using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Projects;

public class CreateProjectRequest
{
    [Required]
    [MaxLength(200)]
    public string project_name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? remarks { get; set; }
}
