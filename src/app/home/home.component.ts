import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="button-row">
      <a [routerLink]="['/clients']"><button class="section-button dark-gray">Clients</button></a>
      <a [routerLink]="['/appointments']"><button class="section-button red">Appointments</button></a>
      <a [routerLink]="['/history']"><button class="section-button steel">History</button></a>
    </div>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
