using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TicketReferenceNumberService : ITicketReferenceNumberService
{
    private readonly AppDbContext _context;

    public TicketReferenceNumberService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateAsync(Project project)
    {
        var initials = string.Concat(
            project.project_name
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Select(word => char.ToUpper(word[0]))
        );

        var now = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(
            DateTime.UtcNow,
            "Singapore Standard Time"
        );

        var prefix = $"{initials}{now.Year}{now.Month:D2}";

        var lastTicket = await _context.Tickets
            .AsNoTracking()
            .Where(t => t.project_id == project.id && t.reference_no.StartsWith(prefix))
            .OrderByDescending(t => t.reference_no)
            .FirstOrDefaultAsync();

        var nextNumber = 1;

        if (lastTicket is not null)
        {
            var sequencePart = lastTicket.reference_no[prefix.Length..];
            if (int.TryParse(sequencePart, out var lastNumber))
            {
                nextNumber = lastNumber + 1;
            }
        }

        return $"{prefix}{nextNumber:D3}";
    }
}
