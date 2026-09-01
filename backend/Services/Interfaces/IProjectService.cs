using backend.Models;

namespace backend.Services.Interfaces;

public interface IProjectService
{
    Task<IReadOnlyList<Project>> GetAllAsync();
    Task<string> GetNameAsync(Guid projectId);
}
