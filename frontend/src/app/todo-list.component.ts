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
    <div class="todo-bg">
      <div class="todo-container">
        <h1 class="todo-title-main">🚀 My Next-Level ToDo</h1>
        <form (submit)="addTodo()" class="todo-form">
          <input
            [(ngModel)]="newTitle"
            name="title"
            placeholder="Task Title"
            required
            class="input-title"
          />
          <input
            [(ngModel)]="newDescription"
            name="description"
            placeholder="Description"
            class="input-desc"
          />
          <input
            [(ngModel)]="newPriority"
            name="priority"
            type="number"
            min="1"
            placeholder="Priority"
            class="input-priority"
          />
          <button type="submit" class="add-btn">Add Task</button>
        </form>
        <div class="chart-section">
          <div class="chart-card">
            <h3 class="chart-title">🔥 Priority Chart</h3>
            <canvas id="priorityChart" width="400" height="220"></canvas>
          </div>
        </div>
        <ul class="todo-list">
          <ng-container *ngFor="let todo of todos">
            <li class="todo-item">
              <div *ngIf="editId === todo.id; else viewMode" class="edit-block">
                <form (submit)="updateTodo(todo)" class="edit-form">
                  <input
                    type="text"
                    [(ngModel)]="todo.title"
                    name="editTitle{{ todo.id }}"
                    required
                    class="input-title"
                  />
                  <input
                    type="text"
                    [(ngModel)]="todo.description"
                    name="editDesc{{ todo.id }}"
                    class="input-desc"
                  />
                  <input
                    type="number"
                    [(ngModel)]="todo.priority"
                    name="editPriority{{ todo.id }}"
                    min="1"
                    class="input-priority"
                  />
                  <button type="submit" class="save-btn">Save</button>
                  <button
                    type="button"
                    (click)="cancelEdit()"
                    class="cancel-btn"
                  >
                    Cancel
                  </button>
                </form>
              </div>
              <ng-template #viewMode>
                <div class="item-content">
                  <div class="item-main">
                    <span class="item-title">{{ todo.title }}</span>
                    <span class="item-desc" *ngIf="todo.description">{{
                      todo.description
                    }}</span>
                  </div>
                  <div class="item-meta">
                    <span class="priority-chip" *ngIf="todo.priority"
                      >Priority: {{ todo.priority }}</span
                    >
                    <button class="edit-btn" (click)="editTodo(todo.id)">
                      <span>✏️</span>
                    </button>
                    <button class="delete-btn" (click)="deleteTodo(todo.id)">
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
              </ng-template>
            </li>
          </ng-container>
        </ul>
      </div>
    </div>
  `,
  styles: [
    `
      .todo-bg {
        min-height: 100vh;
        background: radial-gradient(
          circle at 60% 40%,
          #43cea2 0%,
          #2193b0 100%
        );
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .todo-container {
        background: #fff;
        border-radius: 32px;
        box-shadow: 0 8px 48px #2193b044;
        padding: 48px 40px 32px 40px;
        max-width: 700px;
        width: 100%;
      }
      .todo-title-main {
        text-align: center;
        font-size: 2.2rem;
        font-weight: 900;
        color: #2193b0;
        margin-bottom: 32px;
        letter-spacing: 2px;
      }
      .todo-form {
        display: flex;
        gap: 18px;
        margin-bottom: 36px;
      }
      .input-title,
      .input-desc,
      .input-priority {
        flex: 1 1 120px;
        padding: 14px;
        border-radius: 12px;
        border: 2px solid #43cea2;
        font-size: 1.1rem;
        background: #f7fafd;
        transition: border 0.2s;
      }
      .input-title:focus,
      .input-desc:focus,
      .input-priority:focus {
        border-color: #2193b0;
        outline: none;
      }
      .add-btn {
        background: linear-gradient(90deg, #43cea2 0%, #2193b0 100%);
        color: #fff;
        border: none;
        border-radius: 12px;
        padding: 14px 32px;
        font-size: 1.1rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 2px 12px #2193b026;
        transition: background 0.2s, box-shadow 0.2s;
      }
      .add-btn:hover {
        background: linear-gradient(90deg, #2193b0 0%, #43cea2 100%);
        box-shadow: 0 4px 24px #2193b044;
      }
      .chart-section {
        display: flex;
        justify-content: center;
        margin-bottom: 40px;
      }
      .chart-card {
        background: linear-gradient(90deg, #2193b0 0%, #43cea2 100%);
        border-radius: 24px;
        box-shadow: 0 4px 24px #2193b044;
        padding: 32px 32px 24px 32px;
        width: 480px;
      }
      .chart-title {
        text-align: center;
        color: #fff;
        margin-bottom: 24px;
        font-weight: 900;
        letter-spacing: 1px;
        font-size: 1.3rem;
      }
      .todo-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .todo-item {
        background: linear-gradient(90deg, #43cea2 0%, #2193b0 100%);
        margin-bottom: 24px;
        border-radius: 18px;
        box-shadow: 0 4px 24px #2193b044;
        padding: 28px 32px;
        display: flex;
        flex-direction: column;
        transition: box-shadow 0.2s;
        border: 2px solid #fff2;
      }
      .todo-item:hover {
        box-shadow: 0 8px 32px #2193b066;
        border-color: #43cea2;
      }
      .item-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }
      .item-main {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .item-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #fff;
        letter-spacing: 1px;
      }
      .item-desc {
        font-size: 1.05rem;
        color: #e0f7fa;
        font-weight: 500;
        margin-top: 2px;
        letter-spacing: 0.5px;
      }
      .item-meta {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .priority-chip {
        background: #ffd200;
        color: #185a9d;
        font-weight: 700;
        border-radius: 8px;
        padding: 6px 16px;
        font-size: 1.05rem;
        box-shadow: 0 2px 8px #ffd20044;
      }
      .edit-btn,
      .delete-btn,
      .save-btn,
      .cancel-btn {
        background: linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%);
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 8px 18px;
        font-size: 1rem;
        cursor: pointer;
        box-shadow: 0 2px 8px #2193b026;
        transition: background 0.2s, box-shadow 0.2s;
        font-weight: 700;
      }
      .edit-btn:hover,
      .delete-btn:hover,
      .save-btn:hover,
      .cancel-btn:hover {
        background: linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%);
        box-shadow: 0 4px 16px #2193b044;
      }
      .edit-block {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 12px #2193b026;
        padding: 18px 16px;
        margin-bottom: 8px;
      }
      .edit-form {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
      }
      .edit-form input[type='text'],
      .edit-form input[type='number'] {
        flex: 1 1 120px;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #43cea2;
        font-size: 1.05rem;
        margin-right: 8px;
        background: #f7fafd;
      }
      .edit-form button {
        margin-left: 8px;
      }
      @media (max-width: 600px) {
        .todo-container {
          padding: 16px 4px;
        }
        .chart-card {
          width: 100%;
          padding: 16px;
        }
        .todo-item {
          padding: 12px 8px;
        }
      }
    `,
  ],
})
export class TodoListComponent implements OnInit, AfterViewInit {
  todos: TodoItem[] = [];
  newTitle: string = '';
  newDescription: string = '';
  newPriority: number | null = null;
  editId: number | null = null;
  lastTodosJson: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  ngAfterViewInit(): void {
    this.loadChartJs().then(() => {
      this.renderChart();
    });
  }

  ngDoCheck(): void {
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

  renderChart(): void {
    const priorities = this.todos.map((t) => t.priority ?? 0);
    const labels = this.todos.map((t, i) => t.title || 'Todo ' + (i + 1));
    const ChartRef = (window as any).Chart || Chart;
    if (!ChartRef) return;
    const ctx = (
      document.getElementById('priorityChart') as HTMLCanvasElement
    )?.getContext('2d');
    if (!ctx) return;
    if ((window as any).priorityChartInstance) {
      (window as any).priorityChartInstance.destroy();
    }
    (window as any).priorityChartInstance = new ChartRef(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '',
            data: priorities,
            backgroundColor: [
              '#43cea2',
              '#2193b0',
              '#b0c4de',
              '#6dd5ed',
              '#185a9d',
              '#f7971e',
              '#ffd200',
              '#53302dff',
              '#e96443',
              '#904e95',
            ].slice(0, labels.length),
            borderRadius: 10,
            borderSkipped: false,
            hoverBackgroundColor: '#2193b0',
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
                const idx = context.dataIndex;
                return labels[idx] + ': Priority ' + priorities[idx];
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
                return labels[index];
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#fff2', borderColor: '#fff' },
            ticks: {
              color: '#fff',
              font: { weight: 'bold' },
              stepSize: 1,
              callback: function (value: any) {
                return Number.isInteger(value) ? value : '';
              },
            },
            title: { display: false },
          },
        },
      },
      plugins: [
        {
          afterDraw: (chart: any) => {
            const ctx = chart.ctx;
            chart.data.datasets[0].data.forEach((value: any, i: number) => {
              const meta = chart.getDatasetMeta(0).data[i];
              if (meta) {
                ctx.save();
                ctx.font = 'bold 15px sans-serif';
                ctx.fillStyle = '#2193b0';
                ctx.textAlign = 'center';
                ctx.fillText(
                  'P: ' + priorities[i],
                  meta.x,
                  chart.chartArea.bottom + 22
                );
                ctx.restore();
              }
            });
          },
        },
      ],
    });
  }

  editTodo(id: number): void {
    this.editId = id;
  }

  cancelEdit(): void {
    this.editId = null;
  }

  updateTodo(todo: TodoItem): void {
    this.todoService.updateTodo(todo).subscribe(() => {
      this.editId = null;
      this.loadTodos();
    });
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== id);
      this.renderChart();
    });
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
      this.renderChart();
    });
  }

  addTodo(): void {
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
}
