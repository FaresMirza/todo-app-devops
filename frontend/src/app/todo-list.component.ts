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
      :host {
    font-family: 'Segoe UI', Roboto, sans-serif;
    color: #333;
  }

  .todo-bg {
    min-height: 100vh;
    background: radial-gradient(circle at 60% 40%, #43cea2 0%, #2193b0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .todo-container {
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 8px 40px #2193b044;
    padding: 32px;
    width: 100%;
    max-width: 720px;
  }

  .todo-title-main {
    text-align: center;
    font-size: 2rem;
    font-weight: 800;
    color: #2193b0;
    margin-bottom: 24px;
  }

  .todo-form {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 32px;
  }

  .input-title,
  .input-desc,
  .input-priority {
    flex: 1 1 150px;
    padding: 12px;
    border-radius: 10px;
    border: 1.8px solid #43cea2;
    font-size: 1rem;
    background: #f7fafd;
  }

  .add-btn {
    background: linear-gradient(90deg, #43cea2, #2193b0);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.3s ease;
  }

  .add-btn:hover {
    opacity: 0.9;
    box-shadow: 0 4px 16px #2193b066;
  }

  .chart-section {
    margin: 24px 0;
    display: flex;
    justify-content: center;
  }

  .chart-card {
    width: 100%;
    max-width: 480px;
    background: linear-gradient(90deg, #2193b0, #43cea2);
    border-radius: 20px;
    padding: 24px;
    color: white;
    box-shadow: 0 4px 24px #2193b044;
  }

  .chart-title {
    font-size: 1.25rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 16px;
  }

  .todo-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .todo-item {
    background: linear-gradient(90deg, #43cea2, #2193b0);
    margin-bottom: 20px;
    border-radius: 14px;
    padding: 20px;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .item-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }

  .item-title {
    font-weight: bold;
    font-size: 1.1rem;
  }

  .item-desc {
    font-size: 0.95rem;
    opacity: 0.9;
  }

  .item-meta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .priority-chip {
    background: #ffd200;
    color: #185a9d;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .edit-btn,
  .delete-btn,
  .save-btn,
  .cancel-btn {
    background: #ffffff22;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: 0.2s;
  }

  .edit-btn:hover,
  .delete-btn:hover,
  .save-btn:hover,
  .cancel-btn:hover {
    background: #ffffff33;
  }

  .edit-block {
    background: #ffffff;
    color: #333;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px #00000022;
  }

  .edit-form {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .edit-form input {
    flex: 1 1 140px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }

  @media (max-width: 600px) {
    .todo-form,
    .edit-form {
      flex-direction: column;
    }

    .input-title,
    .input-desc,
    .input-priority,
    .add-btn {
      width: 100%;
    }

    .item-content {
      flex-direction: column;
      align-items: flex-start;
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
