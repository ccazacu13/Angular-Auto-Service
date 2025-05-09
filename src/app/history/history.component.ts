import { Component, inject } from '@angular/core';
import { HistoryService } from '../history.service';
import { AppointmentHistory, Services } from '../appointment-history';
import { CommonModule } from '@angular/common';
import { HistoryCardComponent } from '../history-card/history-card.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isService } from '../appointment-history';
import { tenMultiply } from '../appointment-card/appointment-card.component';
import { servicesOptions } from '../appointment-history';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, HistoryCardComponent, ReactiveFormsModule],
  template: `
    <div *ngIf="historyData!.length === 0" class="info-box">
      <strong>Info:</strong> Currently there is no registered appointment history. Finish an appoinment to add to the registry.
    </div>
    <section id="history-edit-form">
      <div *ngIf="!hiddenEditForm" class="modal-overlay">
        <form class="modal" [formGroup]="applyForm" (submit)="editHistoryEntry()">
          <h3 class="titles">Arrival</h3>
          <div class="form-group">
            <label for="visual">Visual problems: </label>
            <input id="visual" type="text" formControlName="visual">
          </div>
          <div *ngIf="f.visual.invalid && (f.visual.dirty || f.visual.touched)" class="alert alert-danger">
            <div *ngIf="f.visual.errors?.['required']">Visual observations are required.</div>
            <div *ngIf="f.visual.errors?.['minlength']">Visual observations should have at least 3 characters.</div>
          </div>
          <div class="form-group">
            <label for="arrivalProblems">Mentioned problems:</label>
            <input id="arrivalProblems" type="text" formControlName="arrivalProblems">
          </div>
          <div *ngIf="f.arrivalProblems.invalid && (f.arrivalProblems.dirty || f.arrivalProblems.touched)" class="alert alert-danger">
            <div *ngIf="f.arrivalProblems.errors?.['required']">Mentioned problems are required.</div>
            <div *ngIf="f.arrivalProblems.errors?.['minlength']">Mentioned problems should have at least 5 characters.</div>
          </div>
          <div class="form-group">
            <label for="service">Chosen service:</label>
            <select id="service" formControlName="service" class="custom-select">
              <option *ngFor="let option of servicesOptions" value={{option}}>{{option}}</option>
            </select>
          </div>
          <h3 class="titles">Processing</h3>
          <div class="form-group">
            <label for="operations">Operations made:</label>
            <input id="operations" type="text" formControlName="operations">
          </div>
          <div *ngIf="f.operations.invalid && (f.operations.dirty || f.operations.touched)" class="alert alert-danger">
            <div *ngIf="f.operations.errors?.['required']">Operations made are required.</div>
            <div *ngIf="f.operations.errors?.['minlength']">Operations made should have at least 5 characters.</div>
          </div>
          <div class="form-group">
            <label for="parts">Parts changed: </label>
            <input id="parts" type="text" formControlName="parts">
          </div>
          <div *ngIf="f.parts.invalid && (f.parts.dirty || f.parts.touched)" class="alert alert-danger">
            <div *ngIf="f.parts.errors?.['required']">Parts changed are required.</div>
            <div *ngIf="f.parts.errors?.['minlength']">Part changed should have at least 3 characters.</div>
          </div>
          <div class="form-group">
            <label for="processingProblems">Problems found:</label>
            <input id="processingProblems" type="text" formControlName="processingProblems">
          </div>
          <div *ngIf="f.processingProblems.invalid && (f.processingProblems.dirty || f.processingProblems.touched)" class="alert alert-danger">
            <div *ngIf="f.processingProblems.errors?.['required']">Problems found are required.</div>
            <div *ngIf="f.processingProblems.errors?.['minlength']">Problems found should have at least 5 characters.</div>
          </div>
          <div class="form-group">
            <label for="solvedProblems">Problems solved:</label>
            <input id="solvedProblems" type="text" formControlName="solvedProblems">
          </div>
          <div *ngIf="f.solvedProblems.invalid && (f.solvedProblems.dirty || f.solvedProblems.touched)" class="alert alert-danger">
            <div *ngIf="f.solvedProblems.errors?.['required']">Solved problems are required.</div>
            <div *ngIf="f.solvedProblems.errors?.['minlength']">Solved problems should have at least 3 characters.</div>
          </div>
          <div class="form-group">
            <label for="timeMinutes">Time needed(in minutes):</label>
            <input id="timeMinutes" type="number" formControlName="timeMinutes">
          </div>
          <div *ngIf="f.timeMinutes.invalid && (f.timeMinutes.dirty || f.timeMinutes.touched)" class="alert alert-danger">
            <div *ngIf="f.timeMinutes.errors?.['required']">Time needed is required.</div>
            <div *ngIf="f.timeMinutes.errors?.['tenMultiply']">Time needed should be a multiple of 10.</div>
          </div>
          <div class="form-actions">
            <button class="submit-btn" [disabled]="applyForm.invalid">Submit</button>
            <button (click)="hiddenEditForm = !hiddenEditForm"class="cancel-btn" type="button">Cancel</button>
          </div>
        </form>
      </div>
    </section>
    <section id="history-data" *ngFor="let historyEntry of historyData">
      <app-history-card [appointmentHistory]="historyEntry"></app-history-card>
      <div class="history-options">
        <button class="action-btn edit" (click)="toggleHistoryEntryEdit(historyEntry.identifiers!)">Edit</button>
        <button class="action-btn delete" (click)="deleteHistoryEntry(historyEntry.identifiers!)">Delete</button>
      </div>
    </section>
  `,
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  historyService : HistoryService = inject(HistoryService);
  historyData : AppointmentHistory[] | undefined = undefined;

  currentHistoryEntryIdentifier : string | null = null; 
  servicesOptions = servicesOptions;

  constructor(){
    this.historyData = this.historyService.getAllHistoryData();
  }

  applyForm = new FormGroup({
    visual : new FormControl(''),
    arrivalProblems : new FormControl(''),
    service : new FormControl('check'),
    operations : new FormControl(''),
    parts : new FormControl(''),
    processingProblems : new FormControl(''),
    solvedProblems: new FormControl(''),
    timeMinutes : new FormControl(10, [
      Validators.required,
      tenMultiply()
    ])
  })

  hiddenEditForm : boolean = true;
  toggleHistoryEntryEdit(historyIdenfier : string) : void{
    this.hiddenEditForm = !this.hiddenEditForm;
    this.currentHistoryEntryIdentifier = historyIdenfier;
    const currentHistoryEntry = this.historyService.getHistoryByIdentifierDB(this.currentHistoryEntryIdentifier!);

    this.applyForm = new FormGroup({
      visual : new FormControl(currentHistoryEntry.arrival!.visual ,[
        Validators.required,
        Validators.minLength(3),
      ]),
      arrivalProblems : new FormControl(currentHistoryEntry.arrival!.problems, [ 
        Validators.required,
        Validators.minLength(5),
      ]),
      service : isService(currentHistoryEntry.arrival!.service) ? new FormControl(currentHistoryEntry.arrival!.service) : new FormControl('check'),
      operations : new FormControl(currentHistoryEntry.processing!.operations, [
        Validators.required,
        Validators.minLength(5)
      ]),
      parts : new FormControl(currentHistoryEntry.processing!.parts, [
        Validators.required,
        Validators.minLength(3)
      ]),
      processingProblems : new FormControl(currentHistoryEntry.processing!.problems, [
        Validators.required,
        Validators.min(5)
      ]),
      solvedProblems: new FormControl(currentHistoryEntry.processing!.solvedProblems,[
      Validators.required,
      Validators.minLength(3)
    ]),
      timeMinutes : new FormControl(currentHistoryEntry.processing!.timeMinutes,[
        Validators.required,
        tenMultiply()
      ])
    })
  }

  editHistoryEntry() : void{
    const currentHistoryEntry = this.historyService.getHistoryByIdentifierDB(this.currentHistoryEntryIdentifier!);
    const editedHistoryEntry : AppointmentHistory = {
      stage : 'done',
      identifiers : currentHistoryEntry.identifiers,
      arrival : {
        visual : this.applyForm.value.visual!,
        problems : this.applyForm.value.arrivalProblems!,
        service : isService(this.applyForm.value.service!) ? this.applyForm.value.service! : 'check' 
      },
      processing : {
        operations : this.applyForm.value.operations!,
        parts : this.applyForm.value.parts!,
        problems : this.applyForm.value.processingProblems!,
        solvedProblems : this.applyForm.value.solvedProblems!,
        timeMinutes : this.applyForm.value.timeMinutes!
      }
    } 
    this.historyService.editHistoryEntry(this.currentHistoryEntryIdentifier!, editedHistoryEntry);

  }

  deleteHistoryEntry(historyIdentifier : string) : void{
    this.historyService.deteleHistoryEntry(historyIdentifier);
  }

  get f(){
    return this.applyForm.controls;
  }

}

