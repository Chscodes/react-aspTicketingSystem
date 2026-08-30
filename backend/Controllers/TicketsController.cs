// ticketContoller.cs
using backend.DTOs.Tickets;
using backend.Services;
using backend.Models.Enumerations; 
using backend.helper.Ticket; 
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
// [Route("api/[controller]")]
[Route("[controller]")]
public class TicketsController : ControllerBase
{
    private readonly TicketService _ticketService;

    public TicketsController(TicketService ticketService)
    {
        _ticketService = ticketService;
    }

    [HttpPost("addNewTicket")]
    public async Task<IActionResult> AddNewTicket( // pangalan ng controller
      [FromForm] CreateTicketRequest request)
    {
        try
        {
            var ticket = await _ticketService.CreateTicket(request); // tawag sa service naho sa backend

            return Ok(new
            {
                message = "Ticket created successfully",
                data = ticket
            });
        
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
    //  --------------------fetching Tickets Data
    [HttpGet("getTicketsData/{projectId}")]
    public async Task<ActionResult<IEnumerable<TicketResponse>>> FetchTicketData(
        Guid projectId)
    {
       
        try
            {
                var ticketData = await _ticketService.GetTicketsData(projectId);

                return Ok(ticketData);
            
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

    //  -------------------- Update to Cancel the Ticket 

    [HttpPut("cancelTicket/{ticket_id}")]
    public async Task<IActionResult> CancelTicketController(Guid ticket_id)
    {
       
        try
            {
                await _ticketService.cancelTicketService(ticket_id);

                return Ok(new
                {
                    message = "Ticket cancelled successfully."
                });
            
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


      //  --------------------fetching Tickets Data BY ID
    [HttpGet("getTicketDataById/{ticketId}")]
    public async Task<ActionResult<IEnumerable<TicketResponse>>> FetchTicketDataById(
        Guid ticketId)
    {
       
        try
            {
                var ticketData = await _ticketService.GetTicketsDataById(ticketId);

                return Ok(ticketData);
            
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

    [HttpGet("attachments/{attachmentId}")]
    public async Task<IActionResult> GetAttachmentFile(Guid attachmentId)
    {
        var attachment = await _ticketService.GetAttachmentById(attachmentId);

        if (attachment == null)
            return NotFound();

        // returning without "Content-Disposition: attachment" lets images/video render inline
        return File(attachment.file_data, attachment.content_type);
    }

    [HttpGet("ticket_statuses")]
    public ActionResult<IEnumerable<object>> GetTicketStatuses()
    {
        var statuses = Enum.GetValues<TicketStatus>()
            .Select(s => new
            {
                value = s.ToString(),     
                label = s.GetDescription()
            });

        return Ok(statuses);
    }

    [HttpPut("updateTicketStatus/{ticketId}")]
    public async Task<IActionResult> UpdateTicketStatus(
        Guid ticketId,
        [FromBody] UpdateTicketStatusRequest request)
    {
        try
        {
            await _ticketService.updateTicketStatus(ticketId, request.status);
          
            return Ok(new
            {
                message = "Ticket status updated successfully."
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

}