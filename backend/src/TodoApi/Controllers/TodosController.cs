using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;
    private readonly ILogger<TodosController> _logger;

    public TodosController(ITodoService todoService, ILogger<TodosController> logger)
    {
        _todoService = todoService;
        _logger = logger;
    }

    /// <summary>
    /// Get all todo items
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos()
    {
        try
        {
            var todos = await _todoService.GetAllAsync();
            return Ok(todos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all todos");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a specific todo item by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> GetTodo(int id)
    {
        try
        {
            var todo = await _todoService.GetByIdAsync(id);
            if (todo == null)
            {
                return NotFound($"Todo with ID {id} not found");
            }
            return Ok(todo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting todo with id: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new todo item
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TodoItem>> CreateTodo(TodoItem todoItem)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdTodo = await _todoService.CreateAsync(todoItem);
            return CreatedAtAction(nameof(GetTodo), new { id = createdTodo.Id }, createdTodo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating todo");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing todo item
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<TodoItem>> UpdateTodo(int id, TodoItem todoItem)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedTodo = await _todoService.UpdateAsync(id, todoItem);
            if (updatedTodo == null)
            {
                return NotFound($"Todo with ID {id} not found");
            }

            return Ok(updatedTodo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating todo with id: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a todo item
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        try
        {
            var deleted = await _todoService.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound($"Todo with ID {id} not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting todo with id: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Toggle completion status of a todo item
    /// </summary>
    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> ToggleComplete(int id)
    {
        try
        {
            var toggled = await _todoService.ToggleCompleteAsync(id);
            if (!toggled)
            {
                return NotFound($"Todo with ID {id} not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling todo completion with id: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get todos by completion status
    /// </summary>
    [HttpGet("status/{isCompleted}")]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodosByStatus(bool isCompleted)
    {
        try
        {
            var todos = await _todoService.GetByStatusAsync(isCompleted);
            return Ok(todos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting todos by status: {IsCompleted}", isCompleted);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get todos by priority level
    /// </summary>
    [HttpGet("priority/{priority}")]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodosByPriority(int priority)
    {
        try
        {
            if (priority < 1 || priority > 5)
            {
                return BadRequest("Priority must be between 1 and 5");
            }

            var todos = await _todoService.GetByPriorityAsync(priority);
            return Ok(todos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting todos by priority: {Priority}", priority);
            return StatusCode(500, "Internal server error");
        }
    }
}
