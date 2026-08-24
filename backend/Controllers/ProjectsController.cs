using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ProjectService _projectService;

    public ProjectsController(
        AppDbContext context,
        ProjectService projectService)
    {
        _context = context;
        _projectService = projectService;
    }

    // --------------- gang dito ang default para ma connect sa service ang controller

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
    {
        var projects = await _context.Projects
            .Where(p => !p.isDeleted)
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("getProjectName/{projectID}")]
    public async Task<ActionResult> GetProjectName(Guid projectID)
    {
        try
        {
            var projectName = await _projectService.getProjectNameAsync(projectID);

            return Ok(projectName);
        
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
}