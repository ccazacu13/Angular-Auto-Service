import { Component, Input, inject} from '@angular/core';
import { AppointmentHistory } from '../appointment-history';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-history-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="history-info">
      <h3>{{appointmentHistory.identifiers}}</h3>
        <h4 class="titles">Arrival:</h4>
        <p><strong>Visual problems:</strong> {{appointmentHistory.arrival!.visual}}</p>
        <p><strong>Mentioned problems:</strong> {{appointmentHistory.arrival!.problems}}</p>
        <p><strong>Service chosen:</strong> {{appointmentHistory.arrival!.service}}</p>
        <h4 class="titles">Processing: </h4>
        <p><strong>Operations made:</strong> {{appointmentHistory.processing!.operations}}</p>
        <p><strong>Parts used:</strong> {{appointmentHistory.processing!.parts}}</p>
        <p><strong>Identified problems:</strong> {{appointmentHistory.processing!.problems}}</p>
        <p><strong>Solved problems:</strong> {{appointmentHistory.processing!.solvedProblems}}</p>
        <p><strong>Time necessary (in minutes):</strong> {{appointmentHistory.processing!.timeMinutes}} min</p>

    </div>
  `,
  styleUrl: './history-card.component.css'
})
export class HistoryCardComponent {
  @Input() appointmentHistory! : AppointmentHistory;

  constructor(){

  }
}
