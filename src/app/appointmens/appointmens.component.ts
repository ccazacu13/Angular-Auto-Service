import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsService, greaterEqualThanCurrentDate } from '../appointments.service';
import { Appointment } from '../appointment';
import { AppointmentCardComponent } from '../appointment-card/appointment-card.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isMedium } from '../appointment';
import { mediumTypes } from '../appointment';

@Component({
  selector: 'app-appointmens',
  standalone: true,
  imports: [CommonModule, AppointmentCardComponent, ReactiveFormsModule],
  template: `
    <div>
    <div *ngIf="appointments!.length === 0" class="info-box">
      <strong>Info:</strong> Currently there are no open appointments. Go to a client and choose a vehicle to make an appointment.
    </div>
      <form class="appointment-form" [hidden]="hideEditForm" [formGroup]="applyForm" (submit)="editAppointment()">
        <div class="form-group">
          <label for="medium-app-edit">Medium: </label>
          <select id="medium-app-edit" formControlName="medium" class="custom-select">
            <option *ngFor="let medium of mediumTypes" value={{medium}}>{{medium}}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="description-app-edit">Description: </label>
          <input id="description-app-edit" type="text" formControlName="description">
        </div>
        <div *ngIf="f.description.invalid && (f.description.dirty || f.description.touched)" class="alert alert-danger">
          <div *ngIf="f.description.errors?.['required']">Appointment description is required.</div>
          <div *ngIf="f.description.errors?.['minlength']">Appointment description should have at least 5 characters.</div>
        </div>
        <div class="form-group">
          <label for="dateTime">Date of appointment:</label>
          <input id="dateTime" type="text" formControlName="dateTime"/>
        </div>
        <div *ngIf="f.dateTime.invalid && (f.dateTime.dirty || f.dateTime.touched)" class="alert alert-danger">
          <div *ngIf="f.dateTime.errors?.['required']">Appointment date is required.</div>
          <div *ngIf="f.dateTime.errors?.['pattern']">Appointment date should have format: dd.mm.yyyy</div>
          <div *ngIf="f.dateTime.errors?.['greaterEqualThanCurrentDate']">Appointment date cannot be in the past.</div>
        </div>
        <div *ngIf="f.dateTime.valid">
          <div class="form-group">
            <label for="hourTime">Time of appointment:</label>
            <button (click)="checkIntervals()" type="button" class="time-picker">Check intervals</button>
            <select formControlName="hourTime" class="custom-select">
              <option *ngFor="let interval of generatedAppointmentIntervals" value={{interval}}>{{interval}}</option>
            </select>
          </div>
        </div>
        <div class="appointment-options">
        <button class="submit-btn">Submit</button>
        <button (click)="hideEditForm=!hideEditForm" class="cancel-btn" type="button">Cancel</button>
        </div>
      </form>
      <section id="appointments" *ngFor="let appointment of appointments">
        <app-appointment-card [appointment]="appointment"></app-appointment-card>
        <div class="appointment-operations">
          <button class="action-btn edit" (click)="toggleEditForm(appointment.id)">Edit</button>
          <button class="action-btn delete" (click)="deleteAppointment(appointment.id)">Delete</button>
        </div>
      </section>
    </div>
  `,
  styleUrl: './appointmens.component.css'
})
export class AppointmensComponent {
  appointmentService : AppointmentsService = inject(AppointmentsService);
  appointments : Appointment[] | undefined;
  generatedAppointmentIntervals : string[] | null = null;

  mediumTypes = mediumTypes;

  applyForm = new FormGroup({
    medium : new FormControl('in person'),
    description : new FormControl('' ,[
      Validators.required,
      Validators.minLength(5)
    ]),
    dateTime : new FormControl('', [
      Validators.required,
      Validators.pattern('(([1-3][0-9])|(0[1-9]))\\.((0[1-9])|(1[0-2]))\\.((202[5-9])|(20[3-9][0-9]))'),
      greaterEqualThanCurrentDate()
    ]),
    hourTime : new FormControl('')
  });

  constructor(){
    this.appointments = this.appointmentService.getAllAppointments();
  }

  hideEditForm : boolean = true;
  currentEditedAppointmentId : number = -1;
  toggleEditForm(appointmentId : number) : void {
    this.hideEditForm = !this.hideEditForm;

    const appointmentToEdit = this.appointmentService.getAppointmentById(appointmentId);
    const [appointmentDate, appointmentTime] = this.appointmentService.returnAppointmentDateTime(appointmentToEdit); 
    this.applyForm = new FormGroup({
      medium : new FormControl(appointmentToEdit.medium),
      description : new FormControl(appointmentToEdit.description ,[
        Validators.required,
        Validators.minLength(5)
      ]),
      dateTime : new FormControl(appointmentDate, [
        Validators.required,
        Validators.pattern('(([1-3][0-9])|(0[1-9]))\\.((0[1-9])|(1[0-2]))\.((202[5-9])|(20[3-9][0-9]))'),
        greaterEqualThanCurrentDate()
      ]),
      hourTime : new FormControl('')
    })

    this.currentEditedAppointmentId = appointmentId;
  }

  editAppointment() : void {
    const appointmentToEdit : Appointment = this.appointmentService.getAppointmentById(this.currentEditedAppointmentId);
    const time = (this.applyForm.value.dateTime!).trim() + ' ' + this.applyForm.value.hourTime!;
    const editedAppointment : Appointment = {
      id : this.currentEditedAppointmentId,
      clientId : appointmentToEdit.clientId,
      carId : appointmentToEdit.carId,
      medium : isMedium(this.applyForm.value.medium)? this.applyForm.value.medium : 'in person',
      description : this.applyForm.value.description ?? '',
      time : time,
      client : appointmentToEdit.client,
      car : appointmentToEdit.car,
      history : appointmentToEdit.history
    }

    this.appointmentService.editAppointment(this.currentEditedAppointmentId, editedAppointment);
  }

  deleteAppointment(appointmentId : number) : void{
    this.appointmentService.deleteAppointment(appointmentId);
  }

  checkIntervals(){
    const day : string = this.applyForm.value.dateTime!;
    this.generatedAppointmentIntervals = this.appointmentService.generateAppointmentIntervals(8,17,day);
  }

  get f(){
    return this.applyForm.controls;
  }
}
