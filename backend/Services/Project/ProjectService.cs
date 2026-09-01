using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _context;

    public ProjectService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Project>> GetAllAsync()
    {
        return await _context.Projects
            .AsNoTracking()
            .Where(p => !p.isDeleted)
            .OrderBy(p => p.project_name)
            .ToListAsync();
    }

    public async Task<string> GetNameAsync(Guid projectId)
    {
        var projectName = await _context.Projects
            .AsNoTracking()
            .Where(p => p.id == projectId && !p.isDeleted)
            .Select(p => p.project_name)
            .FirstOrDefaultAsync();

        return projectName
            ?? throw new KeyNotFoundException("Project not found.");
    }
}
