using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Controllers;

public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public string Priority { get; set; } = "Medium";
}

public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options) : base(options) { }
    public DbSet<TodoItem> TodoItems { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly TodoContext _context;
    private readonly ILogger<TodosController> _logger;

    public TodosController(TodoContext context, ILogger<TodosController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos()
    {
        try
        {
            var todos = await _context.TodoItems
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
            return Ok(todos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving todo items");
            return StatusCode(500, "An error occurred while retrieving todo items");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> GetTodo(int id)
    {
        try
        {
            var todo = await _context.TodoItems.FindAsync(id);
            if (todo == null)
                return NotFound();

            return Ok(todo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving todo item {Id}", id);
            return StatusCode(500, "An error occurred");
        }
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> CreateTodo(TodoItem todo)
    {
        try
        {
            todo.CreatedAt = DateTime.UtcNow;
            _context.TodoItems.Add(todo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, todo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating todo item");
            return StatusCode(500, "An error occurred");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodo(int id, TodoItem todo)
    {
        if (id != todo.Id)
            return BadRequest();

        try
        {
            var existingTodo = await _context.TodoItems.FindAsync(id);
            if (existingTodo == null)
                return NotFound();

            existingTodo.Title = todo.Title;
            existingTodo.Description = todo.Description;
            existingTodo.Priority = todo.Priority;
            existingTodo.IsCompleted = todo.IsCompleted;

            if (todo.IsCompleted && existingTodo.CompletedAt == null)
                existingTodo.CompletedAt = DateTime.UtcNow;
            else if (!todo.IsCompleted)
                existingTodo.CompletedAt = null;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating todo item {Id}", id);
            return StatusCode(500, "An error occurred");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        try
        {
            var todo = await _context.TodoItems.FindAsync(id);
            if (todo == null)
                return NotFound();

            _context.TodoItems.Remove(todo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting todo item {Id}", id);
            return StatusCode(500, "An error occurred");
        }
    }

    // GET: api/todos/stats
    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetStats()
    {
        try
        {
            var totalCount = await _context.TodoItems.CountAsync();
            var completedCount = await _context.TodoItems.CountAsync(t => t.IsCompleted);
            var pendingCount = totalCount - completedCount;

            var stats = new
            {
                Total = totalCount,
                Completed = completedCount,
                Pending = pendingCount,
                CompletionRate = totalCount > 0 ? Math.Round((double)completedCount / totalCount * 100, 2) : 0
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving todo statistics");
            return StatusCode(500, "An error occurred while retrieving statistics");
        }
    }
}
