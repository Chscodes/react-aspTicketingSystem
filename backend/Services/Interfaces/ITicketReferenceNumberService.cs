using backend.Models;

namespace backend.Services.Interfaces;

public interface ITicketReferenceNumberService
{
    Task<string> GenerateAsync(Project project);
}
