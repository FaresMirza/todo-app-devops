import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Todo, TodoService } from './todo.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: Todo = { title: '', description: '', priority: 1 };
  editingTodo: Todo | null = null;
  chart: any;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
      this.renderChart();
    });
  }

  addTodo() {
    this.todoService.createTodo(this.newTodo).subscribe(() => {
      this.newTodo = { title: '', description: '', priority: 1 };
      this.loadTodos();
    });
  }

  editTodo(todo: Todo) {
    this.editingTodo = { ...todo };
  }

  updateTodo() {
    if (this.editingTodo && this.editingTodo.id) {
      this.todoService
        .updateTodo(this.editingTodo.id, this.editingTodo)
        .subscribe(() => {
          this.editingTodo = null;
          this.loadTodos();
        });
    }
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.loadTodos();
    });
  }

  cancelEdit() {
    this.editingTodo = null;
  }

  renderChart() {
    const priorities = this.todos.map((t) => t.priority);
    const counts: { [key: number]: number } = {};
    priorities.forEach((p) => (counts[p] = (counts[p] || 0) + 1));
    const labels = Object.keys(counts);
    const data = Object.values(counts);

    if (this.chart) {
      this.chart.destroy();
    }
    const ctx = document.getElementById('priorityChart') as HTMLCanvasElement;
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Todos by Priority',
              data,
              backgroundColor: '#42a5f5',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Todos by Priority' },
          },
        },
      });
    }
  }
}
