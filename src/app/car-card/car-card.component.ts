import { Component, Input} from '@angular/core';
import { Car } from '../car';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div [ngClass]="car.active ? 'car-card active' : 'car-card inactive'">
        <div class="card-status">
          <span *ngIf="car.active" class="status active">Active</span>
          <span *ngIf="!car.active" class="status inactive">Inactive</span>
        </div>
        <div class="card-details">
          <div class="card-info">
          <h2>{{ car.plateNumber }}</h2>
          <p><strong>Series:</strong>{{ car.series }}</p>
          <p><strong>Brand:</strong>{{ car.brand }}</p>
          <p><strong>Model:</strong>{{ car.model }}</p>
          <p><strong>Year of fabrication:</strong>{{ car.year }}</p>
          <p><strong>Engine type:</strong>{{ car.engine }}</p>
          <p><strong>Motor capacity:</strong>{{ car.capacity }}</p>
          <p><strong>Power</strong> (horse power): {{ car.horsePower }}, (kW): {{car.kW}}</p>
          </div>
      </div>
  </div>

  `,
  styleUrl: './car-card.component.css'
})
export class CarCardComponent {
  @Input() car! : Car;
}
