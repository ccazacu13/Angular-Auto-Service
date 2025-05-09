import { Component, inject} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClientService } from './client.service';
import { CarsService } from './cars.service';
import { AppointmentsService } from './appointments.service';
import { HistoryService } from './history.service';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [ClientService, CarsService, AppointmentsService, HistoryService],
  imports: [RouterModule],
  template: `
  <main>
    
      <header class="brand-name">
        <nav class="navbar">
          <a [routerLink]="['/']">
            <img class="brand-logo" src="/assets/cog.svg" alt="logo" aria-hidden="true">
          </a>
          <ul class="navbar__menu">
            <li><a [routerLink]="['']">Home</a></li>
            <li><a [routerLink]="['/clients']">Clients</a></li>
            <li><a [routerLink]="['/appointments']">Appointments</a></li>
            <li><a [routerLink]="['/history']">History</a></li>
          </ul>
        </nav>
      </header>
    
    <section class="content">
      <router-outlet></router-outlet>
    </section>
  </main>
`,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'default';
  clientService : ClientService = inject(ClientService)
  constructor(private _router : Router){
  }
}
