import { Component, OnInit } from '@angular/core';
import { TodoService, TodoItem } from './todo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>ToDo List</h2>
    <form (submit)="addTodo()">
      <input [(ngModel)]="newTitle" name="title" placeholder="Title" required />
      <input
        [(ngModel)]="newDescription"
        name="description"
        placeholder="Description"
      />
      <input
        [(ngModel)]="newPriority"
        name="priority"
        type="number"
        min="1"
        placeholder="Priority"
      />
      <button type="submit">Add</button>
    </form>
    <ul>
      <li *ngFor="let todo of todos">
        <ng-container *ngIf="editId === todo.id; else viewMode">
          <form (submit)="updateTodo(todo)">
            <input type="text" [(ngModel)]="todo.title" name="editTitle{{todo.id}}" required />
            <input type="text" [(ngModel)]="todo.description" name="editDesc{{todo.id}}" />
            <input type="number" [(ngModel)]="todo.priority" name="editPriority{{todo.id}}" min="1" />
            <input type="checkbox" [(ngModel)]="todo.isComplete" name="editComplete{{todo.id}}" (change)="toggleComplete(todo)" />
            <button type="submit">Update</button>
            <button type="button" (click)="cancelEdit()">Cancel</button>
          </form>
        </ng-container>
        <ng-template #viewMode>
          <input
            type="checkbox"
            [(ngModel)]="todo.isComplete"
            name="complete{{todo.id}}"
            (change)="toggleComplete(todo)"
          />
          <span [class.completed]="todo.isComplete">
            {{ todo.title }}
            <small *ngIf="todo.completedAt">
              (تم الإنجاز: {{ todo.completedAt | date : 'short' }})
            </small>
          </span>
          <button (click)="editTodo(todo.id)">Edit</button>
          <button (click)="deleteTodo(todo.id)">Delete</button>
        </ng-template>
      </li>
    </ul>
  `,
  styles: [
    `
      .completed {
        text-decoration: line-through;
      }
    `,
  ],
})
export class TodoListComponent implements OnInit {
  todos: TodoItem[] = [];
  newTitle = '';
  newDescription = '';
  newPriority: number | null = null;
  editId: number | null = null;

  constructor(private todoService: TodoService) {}

  editTodo(id: number) {
    this.editId = id;
  }

  cancelEdit() {
    this.editId = null;
  }

  updateTodo(todo: TodoItem) {
    this.todoService.updateTodo(todo).subscribe(() => {
      this.editId = null;
    });
  }

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe((todos) => (this.todos = todos));
  }

  addTodo() {
    if (!this.newTitle.trim()) return;
    const todo = {
      title: this.newTitle,
      description: this.newDescription,
      priority: this.newPriority !== null ? this.newPriority : undefined,
    };
    this.todoService.addTodo(todo).subscribe((newTodo) => {
      this.todos.push(newTodo);
      this.newTitle = '';
      this.newDescription = '';
      this.newPriority = null;
    });
  }

  toggleComplete(todo: TodoItem) {
    if (todo.isComplete) {
      todo.completedAt = new Date().toISOString();
    } else {
      todo.completedAt = null;
    }
    this.todoService.updateTodo(todo).subscribe();
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== id);
    });
  }
}
