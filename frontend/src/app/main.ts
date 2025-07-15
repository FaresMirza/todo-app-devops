import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { TodoComponent } from './todo.component';
import { FormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [...appConfig.providers!, importProvidersFrom(FormsModule)],
}).catch((err) => console.error(err));
