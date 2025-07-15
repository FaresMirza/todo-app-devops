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
      <input [(ngModel)]="newDescription" name="description" placeholder="Description" />
      <input [(ngModel)]="newPriority" name="priority" type="number" min="1" placeholder="Priority" />
      <button type="submit">Add</button>
    </form>
    <ul>
      <li *ngFor="let todo of todos">
        <input type="checkbox" [(ngModel)]="todo.isComplete" (change)="toggleComplete(todo)" />
        <span [class.completed]="todo.isComplete">{{todo.title}}</span>
        <button (click)="deleteTodo(todo.id)">Delete</button>
      </li>
    </ul>
  `,
  styles: [`.completed { text-decoration: line-through; }`]
})
export class TodoListComponent implements OnInit {
  todos: TodoItem[] = [];
  newTitle = '';
  newDescription = '';
  newPriority: number | null = null;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(todos => this.todos = todos);
  }

  addTodo() {
    if (!this.newTitle.trim()) return;
    const todo = {
      title: this.newTitle,
      description: this.newDescription,
      priority: this.newPriority !== null ? this.newPriority : undefined
    };
    this.todoService.addTodo(todo).subscribe(newTodo => {
      this.todos.push(newTodo);
      this.newTitle = '';
      this.newDescription = '';
      this.newPriority = null;
    });
  }

  toggleComplete(todo: TodoItem) {
    this.todoService.updateTodo(todo).subscribe();
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter(t => t.id !== id);
    });
  }
}
