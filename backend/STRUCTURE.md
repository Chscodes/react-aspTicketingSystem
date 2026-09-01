# Backend architecture

```
backend/
├── Controllers/              # Thin HTTP layer (RESTful)
├── Services/
│   ├── Interfaces/           # Contracts (ITicketService, …)
│   ├── Ticket/
│   └── Project/
├── Middleware/
│   └── ExceptionHandlingMiddleware.cs
├── Extensions/
│   └── ServiceCollectionExtensions.cs
├── DTOs/
├── Models/
├── Data/
└── Program.cs                # Composition root only
```

## REST routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List projects |
| GET | `/api/projects/{id}/name` | Project name |
| GET | `/api/tickets?projectId=` | Tickets by project |
| POST | `/api/tickets` | Create ticket (multipart) |
| GET | `/api/tickets/{id}` | Ticket detail |
| POST | `/api/tickets/{id}/cancel` | Cancel |
| PATCH | `/api/tickets/{id}/status` | Update status |
| GET | `/api/tickets/statuses` | Status enum list |
| GET | `/api/tickets/attachments/{id}` | Attachment file |

## Patterns

- Controllers depend on **interfaces**, not concrete services.
- Exceptions bubble to **ExceptionHandlingMiddleware** (no try/catch noise in controllers).
- DI registered via `AddApplicationServices()` / `AddApplicationDbContext()`.
