import { Component, inject } from '@angular/core';
import { ClientService } from '../client.service';
import { Client } from '../client';
import { ClientCardComponent } from '../client-card/client-card.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ClientCardComponent, CommonModule, ReactiveFormsModule],
  template: `
    <div class="client-page-content">
      <div *ngIf="clients!.length === 0" class="info-box">
        <strong>Info:</strong> Currently there are registered clients. Use the button "Add Client" for registration.
      </div>
      <div class="add-client-container">
        <button  (click)="addClientToggle()"class="add-client-btn">+ Add Client</button>
      </div>
      <div *ngIf="!hideClientAddForm" class='modal-overlay'>
        <div class="modal">
          <form [formGroup]="applyForm"
              (submit)="mode == 'ADD' ? submitClientApplication() : editClientApplication()">
              <span>Add new client</span>
              <div class="form-group">
                <label for="first-name">[*]First Name</label>
                <input id="first-name" type="text" formControlName="firstName">
              </div>
              <div *ngIf="f.firstName.invalid && (f.firstName.dirty || f.firstName.touched)" class="alert alert-danger">
                <div *ngIf="f.firstName.errors?.['required']">First name is required.</div>
                <div *ngIf="f.firstName.errors?.['minlength']">First name should have at least 3 characters.</div>
                <div *ngIf="f.firstName.errors?.['pattern']">First name should contain only letters.</div>
              </div>
              <div class="form-group">
                <label for="last-name">[*]Last Name</label>
                <input id="last-name" type="text" formControlName="lastName">
              </div>  
              <div *ngIf="f.lastName.invalid && (f.lastName.dirty || f.lastName.touched)" class="alert alert-danger">
                <div *ngIf="f.lastName.errors?.['required']" class="alert alert-danger">Last name is required.</div>
                <div *ngIf="f.lastName.errors?.['minlength']" class="alert alert-danger">Last name should have at least 3 letters.</div>
                <div *ngIf="f.lastName.errors?.['pattern']">Last name should contain only letters.</div>
              </div>  
              <div class="form-group">
                <label for="phoneNumbers">[*]Phone numbers</label>
                <input id="phoneNumbers" type="text" formControlName="phoneNumbers">
              </div>
              <div *ngIf="f.phoneNumbers.invalid && (f.phoneNumbers.dirty || f.phoneNumbers.touched)" class="alert alert-danger">
                <div *ngIf="f.phoneNumbers.errors?.['pattern']">Input one phone number or add more using "-". ex: "07xxxxxxxx-07yyyyyyyy-07zzzzzzzz" </div>
                <div *ngIf="f.phoneNumbers.errors?.['required']">Phone numbers are required.</div>
              </div>

              <div class='form-group'>
                <label for="email">[*]Email</label>
                <input id="email" type="email" formControlName="email">
              </div>
              <div *ngIf="f.email.invalid && (f.email.dirty || f.email.touched)" class="alert alert-danger">
                <div *ngIf="f.email.errors?.['pattern']">Introduce a valid email adress: john.doe&#64;email.com</div>
                <div *ngIf="f.email.errors?.['required']">Email adress is required.</div>
              </div>
              <div class='form-actions'>
                <button [disabled]="applyForm.invalid" type="submit" class="submit-btn">Submit</button>
                <button class="cancel-btn" (click)="hideClientAddForm = !hideClientAddForm">Cancel</button>
              </div>
              <div class="alert alert-danger">>[*] = required field</div>
          </form>
        </div>
      </div>
      <section class="client-wrapper">
        <div *ngFor="let client of clients">
          <app-client-card [client]="client"></app-client-card>
          <div [ngClass]="client.active ? 'client-actions active' : 'client-actions inactive'">
          <button class="action-btn edit"  [disabled]="!client.active" (click)="editClientToggle(client.id)">Edit</button>
          <button class="action-btn delete" [disabled]="!client.active" (click)="clientService.deleteClient(client.id)">Delete</button>
          <button class="action-btn status" (click)="changeClientStatus(client.id)">Change status</button>
          </div>
        </div>
      </section>
    </div>  
  `,
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  // Variables
  clientService : ClientService = inject(ClientService);
  clients : Client[] = []
  hideClientAddForm : boolean = true;
  /*
    We use the same form with addition and editing clients.
    Changing the function called based on the mode variable.
    modes = ['ADD', 'EDIT']
  */
  mode : string = ''
  currentUserId : number = -1

  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phoneNumbers: new FormControl(''),
    email: new FormControl('')
  });

  //Constructor
  constructor(){
    this.clients = this.clientService.getAllClients(); 
  }

  addFormSetup() : void{
    this.applyForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z ]*$')
      ]),
      lastName: new FormControl('',[
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z ]*$')
      ]),
      phoneNumbers: new FormControl('',[
        Validators.required,
        Validators.pattern("(((07)[0-9]{8}-)|((07)[0-9]{8}))+")
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")
      ]),
    });
  }

  addClientToggle() : void{
    this.mode = 'ADD'
    this.addFormSetup()
    this.hideClientAddForm = !this.hideClientAddForm;
  }
  
  editFormSetup(id : number) : void{
    const client : Client | undefined = this.clientService.getClientById(id);
    if(client === undefined)
      throw new Error(`Client with id:${id} was not found`);

    const joinedPhoneNumbers : string= client.phoneNumbers.join("-");
    this.applyForm = new FormGroup({
      firstName: new FormControl(client.firstName, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z ]*$')
      ]),
      lastName: new FormControl(client.lastName, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z ]*$')
      ]),
      phoneNumbers: new FormControl(joinedPhoneNumbers, [
        Validators.required,
        Validators.pattern("(((07)[0-9]{8}-)|((07)[0-9]{8}))+")
      ]),
      email: new FormControl(client.email, [
        Validators.required,
        Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")
      ])
    });
  }

  editClientToggle(id : number) : void{
    this.mode = 'EDIT';
    this.currentUserId = id
    this.editFormSetup(this.currentUserId);
    this.hideClientAddForm = !this.hideClientAddForm;
  }

  changeClientStatus(clientId : number) : void{
    this.clientService.changeClientStatus(clientId);
  }

  submitClientApplication() : void {
    
    if(this.clientService)
    {
      this.clientService.addClient(
        this.applyForm.value.firstName ?? '',
        this.applyForm.value.lastName ?? '',
        this.applyForm.value.phoneNumbers ?? '',
        this.applyForm.value.email ?? ''
      );
    }
  }

  editClientApplication() : void{
    const oldClient : Client | undefined = this.clientService.getClientById(this.currentUserId);
    if(oldClient === undefined)
      throw new Error(`Client with id:${this.currentUserId} not found.`);

    const client : Client = {
      active : oldClient.active,
      id : this.currentUserId,
      firstName : this.applyForm.value.firstName ?? '',
      lastName : this.applyForm.value.lastName ?? '',
      phoneNumbers : this.applyForm.value.phoneNumbers?.split(" ") ?? [],
      email : this.applyForm.value.email ?? '',
      cars : oldClient.cars
    }

    this.clientService.editClient(client, this.currentUserId);
  }

  get f(){
    return this.applyForm.controls;
  }
}

