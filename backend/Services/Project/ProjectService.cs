using backend.Data;
using backend.DTOs.Projects;
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

    public async Task<Project> CreateAsync(CreateProjectRequest request)
    {
        var name = request.project_name?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Project name is required.");

        var exists = await _context.Projects.AnyAsync(p =>
            !p.isDeleted &&
            p.project_name.ToLower() == name.ToLower());

        if (exists)
            throw new InvalidOperationException("A project with this name already exists.");

        var project = new Project
        {
            project_name = name,
            remarks = request.remarks?.Trim() ?? string.Empty
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return project;
    }
}
