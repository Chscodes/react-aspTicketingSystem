# Docker Setup

This project can be run fully containerized with **Docker Compose** (frontend + backend + MySQL).

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2+

## Quick Start

```bash
# Optional: copy and customize environment variables
cp .env.example .env

# Build and start all services
docker compose up --build -d

# View logs
docker compose logs -f
```

### Access the app

| Service   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost           |
| Backend   | http://localhost:5153      |
| MySQL     | localhost:3306             |

The frontend (nginx) reverse-proxies API routes (`/Tickets`, `/Projects`, etc.) to the backend, so the browser only needs to talk to **http://localhost**.

## Services

| Service    | Image / Build              | Port (host) |
|------------|----------------------------|-------------|
| `frontend` | Vite build → nginx         | `80`        |
| `backend`  | ASP.NET Core (.NET 10)     | `5153`      |
| `mysql`    | MySQL 8.4                  | `3306`      |

## Environment Variables

See `.env.example`. Defaults:

```env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=aspnet_react_mvc
MYSQL_USER=ticketing
MYSQL_PASSWORD=ticketingpass
```

The backend connection string is injected automatically via `ConnectionStrings__DefaultConnection`.

## Useful Commands

```bash
# Stop everything
docker compose down

# Stop and remove database volume (fresh DB)
docker compose down -v

# Rebuild a single service
docker compose up --build -d backend

# Open a shell in the backend container
docker compose exec backend sh

# MySQL CLI
docker compose exec mysql mysql -u ticketing -pticketingpass aspnet_react_mvc
```

## How it works

1. **MySQL** starts and becomes healthy.
2. **Backend** waits for MySQL, runs EF Core migrations + seed data, then listens on port 8080 (mapped to host 5153).
3. **Frontend** is built with Vite (empty `VITE_API_URL` = same-origin), served by nginx on port 80. nginx proxies API paths to `backend:8080`.

## Local development (without Docker)

You can still run frontend/backend locally against the MySQL container:

```bash
# Start only the database
docker compose up -d mysql

# Backend (from ./backend)
# Update appsettings or use:
# ConnectionStrings__DefaultConnection="server=localhost;port=3306;database=aspnet_react_mvc;user=ticketing;password=ticketingpass"
dotnet run

# Frontend (from ./frontend)
# Create .env with:
# VITE_API_URL=http://localhost:5153
npm run dev
```

## Notes

- Ticket attachments are still stored in the database as `byte[]`. For production, prefer object storage (S3, MinIO, etc.).
- Change default MySQL passwords before deploying anywhere public.
- Migrations run automatically on backend startup (`Database.MigrateAsync()`).
