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


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    
    // Fallback to environment variable for containerized deployments
    connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
}
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("❌ Missing connection string: DefaultConnection (appsettings or env)");
}

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

        // Add multiple sample todos if none exist
        if (!context.TodoItems.Any())
        {
            var todos = new List<TodoItem>
            {
                new TodoItem
                {
                    Title = "Buy groceries",
                    Description = "Milk, Bread, Eggs, Cheese",
                    Priority = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new TodoItem
                {
                    Title = "Finish project report",
                    Description = "Complete the final draft and send to manager",
                    Priority = 3,
                    CreatedAt = DateTime.UtcNow
                },
                new TodoItem
                {
                    Title = "Book flight tickets",
                    Description = "Book tickets for vacation",
                    Priority = 2,
                    CreatedAt = DateTime.UtcNow
                }
            };
            context.TodoItems.AddRange(todos);
            context.SaveChanges();
            app.Logger.LogInformation("Sample todo items added successfully");
        }
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "An error occurred while migrating the database");
    }
}

app.Run();
// Force workflow trigger//
