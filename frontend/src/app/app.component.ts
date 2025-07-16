import { Component } from '@angular/core';
import { TodoListComponent } from './todo-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoListComponent, CommonModule, FormsModule],
  template: ` <app-todo-list></app-todo-list> `,
  styles: [],
})
export class AppComponent {
  title = 'frontend';
}
