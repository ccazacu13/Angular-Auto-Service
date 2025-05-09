import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Client } from '../client';
import {RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div [ngClass]="client.active ? 'client-card active' : 'client-card inactive'">
      <div class="card-status">
        <span *ngIf="client.active" class="status active">Active</span>
        <span *ngIf="!client.active" class="status inactive">Inactive</span>
      </div>
      <div class='card-details'>
        <div [ngClass]="(client.active) ? 'client-info active' : 'client-info inactive'">
        <h2>{{ client.firstName}} {{ client.lastName}}</h2>
        <p><strong>Phone:</strong> {{ client.phoneNumbers }}</p>
        <p><strong>Email:</strong> {{ client.email }}</p>
        </div>  
        <div class="card-actions">
          <a [routerLink]="['/cars', client.id]"><button [disabled]="!client.active" [ngClass]="client.active ? 'view-cars-btn active' : 'view-cars-btn inactive'">About cars</button></a>
        </div>
     </div>
  </div>

  `,
  styleUrl: './client-card.component.css'
})
export class ClientCardComponent {
  @Input() client!: Client;

}
