using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Configure PostgreSQL connection
var connectionString = $"Host={Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost"};" +
                      $"Port={Environment.GetEnvironmentVariable("DB_PORT") ?? "5432"};" +
                      $"Database={Environment.GetEnvironmentVariable("DB_NAME") ?? "todoapp"};" +
                      $"Username={Environment.GetEnvironmentVariable("DB_USER") ?? "postgres"};" +
                      $"Password={Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "postgres"}";

builder.Services.AddDbContext<TodoContext>(options =>
    options.UseNpgsql(connectionString));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.UseHttpsRedirection();
app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => new { 
    status = "Healthy", 
    timestamp = DateTime.UtcNow,
    version = "1.0.0"
});

app.Run();
