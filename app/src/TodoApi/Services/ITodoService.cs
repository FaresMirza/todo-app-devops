using TodoApi.Models;

namespace TodoApi.Services;

public interface ITodoService
{
    Task<IEnumerable<TodoItem>> GetAllAsync();
    Task<TodoItem?> GetByIdAsync(int id);
    Task<TodoItem> CreateAsync(TodoItem todoItem);
    Task<TodoItem?> UpdateAsync(int id, TodoItem todoItem);
    Task<bool> DeleteAsync(int id);
    Task<bool> ToggleCompleteAsync(int id);
    Task<IEnumerable<TodoItem>> GetByStatusAsync(bool isCompleted);
    Task<IEnumerable<TodoItem>> GetByPriorityAsync(int priority);
}
