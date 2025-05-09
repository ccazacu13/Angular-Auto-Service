import { Component, Input, OnInit, inject } from '@angular/core';
import { Appointment } from '../appointment';
import { HistoryService } from '../history.service';
import { AppointmentHistory, Arrival, isService, Processing } from '../appointment-history';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidatorFn } from '@angular/forms';
import { servicesOptions } from '../appointment-history';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="appointments">
      <div class="processing-btn-container">
        <button [class]="decideProcessingButtonClass('process-btn')" (click)="decideAction()">{{buttonDisplayByStage()}}</button>
      <div class="appointment-card">
        <div class="card-details">
          <h2>{{appointment.client?.firstName}} {{appointment.client?.lastName}}</h2>
          <h3>{{appointment.car?.plateNumber}}</h3>
          <p><strong>Contacted with:</strong> {{appointment.medium}}</p>
          <p><strong>Description:</strong> {{appointment.description}}</p>
          <p><strong>Appointment time:</strong> {{appointment.time}}</p>
        </div>
        <div class="appointment-processing">
          <form class="form" [hidden]="hideArriveForm" [formGroup]="arriveForm" (submit)="submitArriveForm()">
            <div class="form-group"> 
              <label for="visual">[*]Visual observasions:</label>
              <input id="visual" type="text" formControlName="visual">
            </div>  
            <div *ngIf="arrivef.visual.invalid && (arrivef.visual.dirty || arrivef.visual.touched)" class="alert alert-danger">
              <div *ngIf="arrivef.visual.errors?.['required']">Visual observations are required.</div>
              <div *ngIf="arrivef.visual.errors?.['minlength']">Appointment description should have at least 5 characters.</div>
            </div>
            <div class="form-group">
              <label for="problems">[*]Car problems:</label>
              <input id="problems" type="text" formControlName="problems">
            </div>
            <div *ngIf="arrivef.problems.invalid && (arrivef.problems.dirty || arrivef.problems.touched)" class="alert alert-danger">
              <div *ngIf="arrivef.problems.errors?.['required']">Mentioned problems are required.</div>
              <div *ngIf="arrivef.problems.errors?.['minlength']">Mentioned problems should have at least 5 characters.</div>
            </div>
            <div class="form-group">
              <label for="services">[*]Services: </label>
              <select id="services" formControlName="services">
                <option *ngFor="let service of servicesOptions" value={{service}}>{{service}}</option>
              </select>
            </div>
            <div class="form-controls">
              <button class="submit-btn" [disabled]="this.arriveForm.invalid">Submit</button>
              <button class="cancel-btn" (click)="hideArriveForm = !hideArriveForm" type="button">Cancel</button>
            </div>
            <p class="alert-danger">[*]Fields are required.</p>
          </form>
          <form class="form" [hidden]="hideProcessForm" [formGroup]="processingForm" (submit)="submitProcessForm()">
            <div class="form-group">
              <label for="operations">[*]Operations made: </label>
              <input id="operations" type="text" formControlName="operations">
            </div>
            <div *ngIf="processf.operations.invalid && (processf.operations.dirty || processf.operations.touched)" class="alert alert-danger">
              <div *ngIf="processf.operations.errors?.['required']">Operations made are required.</div>
              <div *ngIf="processf.operations.errors?.['minlength']">Operations made should have at least 5 characters.</div>
            </div>
            <div class="form-group">
              <label for="parts">[*]Changed parts: </label>
              <input id="parts" type="text" formControlName="parts">
            </div>
            <div *ngIf="processf.parts.invalid && (processf.parts.dirty || processf.parts.touched)" class="alert alert-danger">
              <div *ngIf="processf.parts.errors?.['required']">Parts used are required.</div>
              <div *ngIf="processf.parts.errors?.['minlength']">Parts used should have at least 3 characters.</div>
            </div>
            <div class="form-group">
              <label for="problems">[*]Problems found:</label>
              <input id="problems" type="text" formControlName="problems">
            </div>
            <div *ngIf="processf.problems.invalid && (processf.problems.dirty || processf.problems.touched)" class="alert alert-danger">
              <div *ngIf="processf.problems.errors?.['required']">Problems investigated are required.</div>
              <div *ngIf="processf.problems.errors?.['minlength']">Problems investigated should have at least 5 characters.</div>
            </div>
            <div class="form-group">
              <label for="solved-problems">[*]Solved problems:</label>
              <input id="solved-problems" type="text" formControlName="solvedProblems">
            </div>
            <div *ngIf="processf.solvedProblems.invalid && (processf.solvedProblems.dirty || processf.solvedProblems.touched)" class="alert alert-danger">
              <div *ngIf="processf.solvedProblems.errors?.['required']">Solved problems are required.</div>
              <div *ngIf="processf.solvedProblems.errors?.['minlength']">Solved problems should have at least 3 characters.</div>
            </div>
            <div class="form-group">
              <label for="time-minutes">[*]Time needed in minutes: </label>
              <input id="time-minutes" type="number" formControlName="timeMinutes">
            </div>
            <div *ngIf="processf.timeMinutes.invalid && (processf.timeMinutes.dirty || processf.timeMinutes.touched)" class="alert alert-danger">
              <div *ngIf="processf.timeMinutes.errors?.['required']">Operations time is required.</div>
              <div *ngIf="processf.timeMinutes.errors?.['tenMultiply']">Operations time is multiple of 10.</div>
            </div>
            <div class="form-controls">
              <button class="submit-btn" [disabled]="this.processingForm.invalid">Submit</button>
              <button class="cancel-btn" type="button" (click)="hideProcessForm=!hideProcessForm">Cancel</button>
            </div>
            <p class="alert-danger">[*] Fields are required.</p>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrl: './appointment-card.component.css'
})
export class AppointmentCardComponent implements OnInit{
  @Input() appointment! : Appointment;
  
  historyService : HistoryService = inject(HistoryService);
  history : AppointmentHistory | null = null
  appointmentId : number | null = null;

  servicesOptions = servicesOptions;

  ngOnInit(): void {
    this.history = this.historyService.getHistoryByAppointmentId(this.appointment.id);
    this.appointmentId = this.appointment.id;
  }

  arriveForm = new FormGroup({
    visual : new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    problems: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    services: new FormControl('check')
  })
  processingForm = new FormGroup({
    operations : new FormControl('' ,[
      Validators.required,
      Validators.minLength(5)
    ]),
    parts : new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    problems : new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    solvedProblems : new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    timeMinutes : new FormControl(10, [
      Validators.required,
      tenMultiply()
    ]),
  })

  submitArriveForm() : void{
    const arrivalData : Arrival = {
      visual : (this.arriveForm.value.visual)?.trim() ?? '',
      problems : (this.arriveForm.value.problems)?.trim() ?? '',
      service : isService(this.arriveForm.value.services) ? this.arriveForm.value.services : 'check' 
    }
    this.historyService.addArrivalDataToHistory(this.appointmentId!, arrivalData);
  }

  submitProcessForm() : void{
    const processingData : Processing = {
      operations : this.processingForm.value.operations ?? '',
      parts : this.processingForm.value.parts ?? '',
      problems : this.processingForm.value.problems ?? '',
      solvedProblems : this.processingForm.value.solvedProblems ?? '',
      timeMinutes : this.processingForm.value.timeMinutes ?? 0
    }

    this.historyService.addProcessingDataToHistory(this.appointment.id!, processingData);
  }

  sendHistory() : void{
    this.historyService.addNewHistory(this.appointmentId!);
  }

  hideArriveForm : boolean = true;
  toggleArriveForm() : void{
    this.hideArriveForm = !this.hideArriveForm;
  }

  hideProcessForm : boolean = true;
  toggleProcessingForm() : void{
    this.hideProcessForm = !this.hideProcessForm
  }

  buttonDisplayByStage() : string {
    if(this.history?.stage === 'arrival')
      return 'Arrival';

    if(this.history?.stage === 'processing')
      return 'Processing';

    return 'Done';
  }
  
  decideAction() : void{
    const stage = this.history?.stage;
    if(stage === 'arrival'){
      this.toggleArriveForm();
      return;
    }
    if(stage === 'processing'){
      this.toggleProcessingForm();
      return;
    }
    this.sendHistory();
  }

  decideProcessingButtonClass(tag : string) : string{
    return tag + ' ' + this.history?.stage;
  }


  debugObjectToString(object : any): string{
    return JSON.stringify(object);
  }

  get arrivef(){
    return this.arriveForm.controls;
  }

  get processf(){
    return this.processingForm.controls;
  }
}

export function tenMultiply() : ValidatorFn{
  return (controls : AbstractControl) : ValidationErrors | null => {
    const timeMinutes : number = controls.value;
    if(timeMinutes % 10 === 0)
      return null;

    return {tenMultiply : true};
  }
}
