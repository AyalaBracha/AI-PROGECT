import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuicklyRecipeComponent } from './components/quickly-recipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QuicklyRecipeComponent,FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('client');
}
