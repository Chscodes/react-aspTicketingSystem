using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TicketReferenceNumberService
{
    private readonly AppDbContext _context;

    public TicketReferenceNumberService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateTicketReferenceNumber(
        Project project)
    {
        // Generate initials
        var initials = string.Concat(
            project.project_name
                .Split(
                    ' ',
                    StringSplitOptions.RemoveEmptyEntries
                )
                .Select(word =>
                    char.ToUpper(word[0])
                )
        );

        // Philippine/Singapore timezone
        var now = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(
            DateTime.UtcNow,
            "Singapore Standard Time"
        );

        var year = now.Year;
        var month = now.Month.ToString("D2");

        // Example:
        // SAP202608
        var prefix =
            $"{initials}{year}{month}";

        // Find latest ticket for this project/month
        var lastTicket = await _context.Tickets
            .Where(t =>
                t.project_id == project.id &&
                t.reference_no.StartsWith(prefix)
            )
            .OrderByDescending(t => t.reference_no)
            .FirstOrDefaultAsync();

        var nextNumber = 1;

        if (lastTicket != null)
        {
            var sequencePart =
                lastTicket.reference_no
                    .Substring(prefix.Length);

            if (int.TryParse(
                sequencePart,
                out var lastNumber))
            {
                nextNumber = lastNumber + 1;
            }
        }

        return $"{prefix}{nextNumber:D3}";
    }
}