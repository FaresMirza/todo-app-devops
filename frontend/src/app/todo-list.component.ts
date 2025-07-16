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
    <form (submit)="addTodo()" style="margin-bottom: 32px;">
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
    <div
      style="display: flex; justify-content: center; align-items: center; margin-bottom: 32px;"
    >
      <div
        style="background: linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%); border-radius: 18px; box-shadow: 0 4px 24px #2193b044; padding: 24px; width: 440px;"
      >
        <h3
          style="text-align:center; color:#fff; margin-bottom:16px; font-weight:600; letter-spacing:1px;"
        >
          Priority Chart
        </h3>
        <canvas id="priorityChart" width="400" height="220"></canvas>
      </div>
    </div>
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

  lastTodosJson = '';

  ngAfterViewInit() {
    this.loadChartJs().then(() => {
      this.renderChart();
    });
  }

  ngDoCheck() {
    // Only re-render chart if todos actually changed
    const currentJson = JSON.stringify(
      this.todos.map((t) => ({
        id: t.id,
        priority: t.priority,
        title: t.title,
      }))
    );
    if (currentJson !== this.lastTodosJson) {
      this.lastTodosJson = currentJson;
      this.renderChart();
    }
  }

  loadChartJs(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof Chart !== 'undefined') return resolve();
      const existing = document.querySelector('script[src*="chart.js"]');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
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
    // Invert priorities: lower number = higher bar
    const priorities = this.todos.map((t) => t.priority ?? 10);
    const maxPriority = priorities.length ? Math.max(...priorities) : 10;
    const inverted = priorities.map((p) => maxPriority + 1 - p);
    const labels = this.todos.map((t, i) => t.title || `Todo ${i + 1}`);
    (window as any).priorityChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '',
            data: inverted,
            backgroundColor: [
              '#2193b0',
              '#6dd5ed',
              '#b0c4de',
              '#43cea2',
              '#185a9d',
              '#f7971e',
              '#ffd200',
              '#f44336',
              '#e96443',
              '#904e95',
            ].slice(0, labels.length),
            borderRadius: 8,
            borderSkipped: false,
            hoverBackgroundColor: '#43cea2',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                // Show original priority value
                const idx = context.dataIndex;
                return `${labels[idx]}: Priority ${priorities[idx]}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#fff',
              font: { weight: 'bold' },
              callback: function (value: any, index: number) {
                // Show task name below each bar
                return labels[index];
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#fff2', borderColor: '#fff' },
            ticks: { color: '#fff', font: { weight: 'bold' } },
            title: {
              display: false,
            },
            // Remove max limit, let bars scale naturally
          },
        },
      },
      plugins: [
        {
          afterDraw: (chart: any) => {
            // Draw priority value below each bar
            const ctx = chart.ctx;
            chart.data.datasets[0].data.forEach((value: any, i: number) => {
              const meta = chart.getDatasetMeta(0).data[i];
              if (meta) {
                ctx.save();
                ctx.font = 'bold 14px sans-serif';
                ctx.fillStyle = '#2193b0';
                ctx.textAlign = 'center';
                ctx.fillText(
                  `P: ${priorities[i]}`,
                  meta.x,
                  chart.chartArea.bottom + 18
                );
                ctx.restore();
              }
            });
          },
        },
      ],
    });
  }

  loadTodos() {
    this.todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
      this.renderChart();
    });
  }

  addTodo() {
    if (!this.newTitle.trim()) return;
    const todo: Partial<TodoItem> = {
      title: this.newTitle,
      description: this.newDescription,
      priority: this.newPriority !== null ? this.newPriority : undefined,
    };
    this.todoService.addTodo(todo).subscribe((newTodo) => {
      this.todos.push(newTodo);
      this.newTitle = '';
      this.newDescription = '';
      this.newPriority = null;
      this.renderChart();
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
      this.renderChart();
    });
  }
}
