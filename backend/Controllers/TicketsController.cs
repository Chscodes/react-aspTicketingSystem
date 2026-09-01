using backend.DTOs.Tickets;
using backend.helper.Ticket;
using backend.Models.Enumerations;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/tickets")]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketsController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    /// <summary>Create a ticket (multipart form for attachments).</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateTicketRequest request)
    {
        var ticket = await _ticketService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = ticket.id }, new
        {
            message = "Ticket created successfully",
            data = ticket
        });
    }

    /// <summary>List tickets for a project.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TicketResponse>>> GetByProject(
        [FromQuery] Guid projectId)
    {
        var tickets = await _ticketService.GetByProjectAsync(projectId);
        return Ok(tickets);
    }

    /// <summary>Get a single ticket by id.</summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TicketResponse>> GetById(Guid id)
    {
        var ticket = await _ticketService.GetByIdAsync(id);
        return ticket is null ? NotFound(new { message = "Ticket not found." }) : Ok(ticket);
    }

    /// <summary>Cancel a ticket.</summary>
    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        await _ticketService.CancelAsync(id);
        return Ok(new { message = "Ticket cancelled successfully." });
    }

    /// <summary>Update ticket status.</summary>
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        [FromBody] UpdateTicketStatusRequest request)
    {
        await _ticketService.UpdateStatusAsync(id, request.status);
        return Ok(new { message = "Ticket status updated successfully." });
    }

    /// <summary>Download / inline attachment content.</summary>
    [HttpGet("attachments/{attachmentId:guid}")]
    public async Task<IActionResult> GetAttachment(Guid attachmentId)
    {
        var attachment = await _ticketService.GetAttachmentAsync(attachmentId);
        if (attachment is null)
            return NotFound();

        return File(attachment.file_data, attachment.content_type);
    }

    /// <summary>Available ticket statuses.</summary>
    [HttpGet("statuses")]
    public ActionResult<IEnumerable<object>> GetStatuses()
    {
        var statuses = Enum.GetValues<TicketStatus>()
            .Select(s => new
            {
                value = s.ToString(),
                label = s.GetDescription()
            });

        return Ok(statuses);
    }
}
