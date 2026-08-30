// TicketStatus.cs
namespace backend.Models.Enumerations;

using System.ComponentModel;

public enum TicketStatus
{
    [Description("New")]
    New = 0,

    [Description("On Review")]
    OnReview = 1,

    [Description("Support Will Contact You")]
    SupportWillContactYou = 2,

    [Description("In Progress")]
    InProgress = 3,

    [Description("Closed")]
    Closed = 4,

    [Description("Cancelled")]
    Cancelled = 5
}