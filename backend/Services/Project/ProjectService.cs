using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ProjectService
{
    private readonly AppDbContext _context;
    public ProjectService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> getProjectNameAsync(Guid projectID)
    {
        try {
          var projectName = await _context.Projects
            .Where(p => p.id == projectID)
            .Select(p => p.project_name)
            .FirstOrDefaultAsync();

            if (projectName == null)
            {
                throw new KeyNotFoundException(
                    "Project not found."
                );
            }

            return projectName;
        }
        catch {
            throw;   
        }
    }
}