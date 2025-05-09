import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [],
  template: `
  
    <div class="not-found-container">
      <div class="error-code">404</div>
      <div class="message">Oops! The page you're looking for doesn't exist.</div>
      <a href="/" class="home-link">Go Back Home</a>
    </div>
    
  `,
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {

}
