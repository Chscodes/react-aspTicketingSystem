// ticketContoller.cs
using backend.DTOs.Tickets;
using backend.Services;
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
        CreateTicketRequest request)
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
}