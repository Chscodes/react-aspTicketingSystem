using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Data.Seeds;
using backend.Services;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(
            builder.Configuration.GetConnectionString("DefaultConnection")
        )
    );
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactClient", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// TICKETS SERVICES
builder.Services.AddScoped<TicketService>();
builder.Services.AddScoped<ProjectService>();
builder.Services.AddScoped<TicketReferenceNumberService>();

var app = builder.Build();


//for seeds 
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<AppDbContext>();

    await DatabaseSeeder.SeedAsync(context);
}

app.UseCors("ReactClient");

// app.UseHttpsRedirection();

app.MapControllers();

app.Run();