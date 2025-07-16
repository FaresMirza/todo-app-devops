import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TodoService, TodoItem } from './todo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
declare var Chart: any;

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
    <canvas id="priorityChart" width="400" height="200"></canvas>
    <ul>
      <li *ngFor="let todo of todos">
        <ng-container *ngIf="editId === todo.id; else viewMode">
          <form (submit)="updateTodo(todo)">
            <input
              type="text"
              [(ngModel)]="todo.title"
              name="editTitle{{ todo.id }}"
              required
            />
            <input
              type="text"
              [(ngModel)]="todo.description"
              name="editDesc{{ todo.id }}"
            />
            <input
              type="number"
              [(ngModel)]="todo.priority"
              name="editPriority{{ todo.id }}"
              min="1"
            />
            <button type="submit">Update</button>
            <button type="button" (click)="cancelEdit()">Cancel</button>
          </form>
        </ng-container>
        <ng-template #viewMode>
          <span>
            {{ todo.title }}
            <small *ngIf="todo.priority">(Priority: {{ todo.priority }})</small>
          </span>
          <button (click)="editTodo(todo.id)">Edit</button>
          <button (click)="deleteTodo(todo.id)">Delete</button>
        </ng-template>
      </li>
    </ul>
  `,
  styles: [
    `
      ul {
        list-style: none;
        padding: 0;
        margin: 32px 0 0 0;
      }
      li {
        background: #fff;
        margin-bottom: 18px;
        border-radius: 12px;
        box-shadow: 0 2px 12px #2193b026;
        padding: 18px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: box-shadow 0.2s;
      }
      li:hover {
        box-shadow: 0 4px 24px #2193b044;
      }
      form {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
      }
      input[type='text'],
      input[type='number'] {
        flex: 1 1 120px;
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #b0c4de;
        font-size: 1rem;
      }
      input[type='checkbox'] {
        accent-color: #2193b0;
        width: 18px;
        height: 18px;
      }
      button {
        background: linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%);
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 8px 18px;
        font-size: 1rem;
        cursor: pointer;
        box-shadow: 0 2px 8px #2193b026;
        transition: background 0.2s, box-shadow 0.2s;
      }
      button:hover {
        background: linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%);
        box-shadow: 0 4px 16px #2193b044;
      }
      .completed {
        text-decoration: line-through;
        color: #888;
      }
      h2 {
        color: #2193b0;
        font-weight: 700;
        margin-top: 0;
        margin-bottom: 24px;
        letter-spacing: 1px;
      }
      label {
        font-size: 1rem;
        color: #2193b0;
        margin-right: 8px;
      }
      small {
        color: #888;
        margin-left: 8px;
      }
    `,
  ],
})
export class TodoListComponent implements OnInit, AfterViewInit {
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
    if (todo.isComplete && !todo.completedAt) {
      todo.completedAt = new Date().toISOString();
    } else if (!todo.isComplete) {
      todo.completedAt = null;
    }
    this.todoService.updateTodo(todo).subscribe(() => {
      this.editId = null;
    });
  }

  ngOnInit() {
    this.loadTodos();
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  ngDoCheck() {
    this.renderChart();
  }

  renderChart() {
    if (typeof Chart === 'undefined') return;
    const ctx = (
      document.getElementById('priorityChart') as HTMLCanvasElement
    )?.getContext('2d');
    if (!ctx) return;
    if ((window as any).priorityChartInstance) {
      (window as any).priorityChartInstance.destroy();
    }
    const priorities = this.todos.map((t) => t.priority || 0);
    const labels = this.todos.map((t, i) => t.title || `Todo ${i + 1}`);
    (window as any).priorityChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Priority',
            data: priorities,
            backgroundColor: '#2193b0',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  loadTodos() {
    this.todoService.getTodos().subscribe((todos) => (this.todos = todos));
  }

  addTodo() {
    if (!this.newTitle.trim()) return;
    const todo: Partial<TodoItem> = {
      title: this.newTitle,
      description: this.newDescription,
      priority: this.newPriority !== null ? this.newPriority : undefined,
      // removed completed logic
    };
    this.todoService.addTodo(todo).subscribe((newTodo) => {
      this.todos.push(newTodo);
      this.newTitle = '';
      this.newDescription = '';
      this.newPriority = null;
      // removed completed logic
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
