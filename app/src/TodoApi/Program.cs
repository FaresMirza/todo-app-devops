using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;
using TodoApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "TodoApi", Version = "v1" });
    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, "TodoApi.xml"), true);
});

// Configure Entity Framework with PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
    $"Host={Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost"};" +
    $"Port={Environment.GetEnvironmentVariable("DB_PORT") ?? "5432"};" +
    $"Database={Environment.GetEnvironmentVariable("DB_NAME") ?? "todoapi"};" +
    $"Username={Environment.GetEnvironmentVariable("DB_USER") ?? "postgres"};" +
    $"Password={Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "password"}";

builder.Services.AddDbContext<TodoContext>(options =>
    options.UseNpgsql(connectionString));

// Register services
builder.Services.AddScoped<ITodoService, TodoService>();

// Add health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<TodoContext>();

// Configure CORS for development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TodoApi v1");
        c.RoutePrefix = string.Empty; // Makes Swagger UI available at root
    });
    app.UseDeveloperExceptionPage();
}

app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthorization();

// Health check endpoint
app.MapHealthChecks("/health");

// API routes
app.MapControllers();

// Root endpoint
app.MapGet("/", () => new { Message = "Todo API is running!", Version = "v1.0.0", Timestamp = DateTime.UtcNow });

// Ensure database is created and migrated
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TodoContext>();
    try
    {
        context.Database.Migrate();
        app.Logger.LogInformation("Database migrated successfully");
        
        // Add sample data if no todos exist
        if (!context.TodoItems.Any())
        {
            context.TodoItems.Add(new TodoItem
            {
                Title = "Sample Todo Item",
                Description = "This is a sample todo item",
                Priority = 2,
                CreatedAt = DateTime.UtcNow
            });
            context.SaveChanges();
            app.Logger.LogInformation("Sample data added successfully");
        }
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "An error occurred while migrating the database");
    }
}

app.Run();
