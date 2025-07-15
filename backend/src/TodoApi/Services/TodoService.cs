using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

namespace TodoApi.Services;

public class TodoService : ITodoService
{
    private readonly TodoContext _context;
    private readonly ILogger<TodoService> _logger;

    public TodoService(TodoContext context, ILogger<TodoService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<TodoItem>> GetAllAsync()
    {
        _logger.LogInformation("Getting all todo items");
        return await _context.TodoItems.OrderBy(t => t.CreatedAt).ToListAsync();
    }

    public async Task<TodoItem?> GetByIdAsync(int id)
    {
        _logger.LogInformation("Getting todo item with id: {Id}", id);
        return await _context.TodoItems.FindAsync(id);
    }

    public async Task<TodoItem> CreateAsync(TodoItem todoItem)
    {
        _logger.LogInformation("Creating new todo item: {Title}", todoItem.Title);
        
        todoItem.CreatedAt = DateTime.UtcNow;
        todoItem.UpdatedAt = null;
        todoItem.CompletedAt = null;
        
        _context.TodoItems.Add(todoItem);
        await _context.SaveChangesAsync();
        
        return todoItem;
    }

    public async Task<TodoItem?> UpdateAsync(int id, TodoItem todoItem)
    {
        _logger.LogInformation("Updating todo item with id: {Id}", id);
        
        var existingItem = await _context.TodoItems.FindAsync(id);
        if (existingItem == null)
        {
            return null;
        }

        existingItem.Title = todoItem.Title;
        existingItem.Description = todoItem.Description;
        existingItem.Priority = todoItem.Priority;
        existingItem.UpdatedAt = DateTime.UtcNow;
        
        // Handle completion status
        if (todoItem.IsCompleted != existingItem.IsCompleted)
        {
            existingItem.IsCompleted = todoItem.IsCompleted;
            existingItem.CompletedAt = todoItem.IsCompleted ? DateTime.UtcNow : null;
        }

        await _context.SaveChangesAsync();
        return existingItem;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        _logger.LogInformation("Deleting todo item with id: {Id}", id);
        
        var todoItem = await _context.TodoItems.FindAsync(id);
        if (todoItem == null)
        {
            return false;
        }

        _context.TodoItems.Remove(todoItem);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleCompleteAsync(int id)
    {
        _logger.LogInformation("Toggling completion status for todo item with id: {Id}", id);
        
        var todoItem = await _context.TodoItems.FindAsync(id);
        if (todoItem == null)
        {
            return false;
        }

        todoItem.IsCompleted = !todoItem.IsCompleted;
        todoItem.CompletedAt = todoItem.IsCompleted ? DateTime.UtcNow : null;
        todoItem.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<TodoItem>> GetByStatusAsync(bool isCompleted)
    {
        _logger.LogInformation("Getting todo items by status: {IsCompleted}", isCompleted);
        return await _context.TodoItems
            .Where(t => t.IsCompleted == isCompleted)
            .OrderBy(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<TodoItem>> GetByPriorityAsync(int priority)
    {
        _logger.LogInformation("Getting todo items by priority: {Priority}", priority);
        return await _context.TodoItems
            .Where(t => t.Priority == priority)
            .OrderBy(t => t.CreatedAt)
            .ToListAsync();
    }
}
