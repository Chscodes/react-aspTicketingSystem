using backend.DTOs.Projects;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Project>>> GetAll()
    {
        var projects = await _projectService.GetAllAsync();
        return Ok(projects);
    }

    [HttpGet("{id:guid}/name")]
    public async Task<ActionResult<string>> GetName(Guid id)
    {
        var name = await _projectService.GetNameAsync(id);
        return Ok(name);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProjectRequest request)
    {
        var project = await _projectService.CreateAsync(request);

        return CreatedAtAction(
            nameof(GetName),
            new { id = project.id },
            new
            {
                message = "Project created successfully",
                data = project
            });
    }
}
