// TicketStatus.cs
namespace backend.Models.Enumerations;

public enum TicketStatus
{
    New = 0,
    OnReview = 1,
    SupportWillContactYou = 2,
    InProgress = 3,
    Closed = 4
}