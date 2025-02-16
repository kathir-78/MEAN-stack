import { Component } from '@angular/core';
import { HeaderPostComponentComponent } from './header/header-post-component/header-post-component.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderPostComponentComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
}
