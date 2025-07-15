
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoListComponent } from './todo-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  template: `
    <h1>Welcome to {{title}}!</h1>
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'frontend';
}
