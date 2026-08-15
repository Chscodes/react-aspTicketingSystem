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

            return Ok(ticket); // dito ako nahinto paano ko mabalik to sa frontend
        
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