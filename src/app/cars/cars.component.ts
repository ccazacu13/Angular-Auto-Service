import { Component, inject, Injector} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CarsService } from '../cars.service';
import {isEngine} from '../car';
import { AppointmentsService, greaterEqualThanCurrentDate } from '../appointments.service';
import { ActivatedRoute } from '@angular/router';
import { CarCardComponent } from '../car-card/car-card.component';
import { Appointment } from '../appointment';
import { Car } from '../car';
import { Router } from '@angular/router';
import { engineTypes } from '../car';
import { mediumTypes } from '../appointment';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, CarCardComponent, ReactiveFormsModule],
  template: `
    <div *ngIf="cars.length === 1" class="warning-box">
      <strong>Warning:</strong> Client has one car left. If removed the client will be deleted.
    </div>
    <div *ngIf="cars.length === 0" class="warning-box">
      <strong>Warning:</strong> Client has no car registered. Please register at least one car.
    </div>
    <div class="add-car-container">
      <button (click)='toggleAddCar()'class="add-car-btn">+ Add Car</button>
    </div>
    <div *ngIf="!hiddenForm" class="modal-overlay">
      <div class="modal">
      <form [formGroup]="applyForm" (submit)="this.formMode === 'ADD' ? submitAddCar() : submitEditCar()">
        <div class="form-group">
          <label for="plate-number">[*]Plate number</label>
          <input id="plate-number" type="text" formControlName="plateNumber">
        </div>
        <div *ngIf="f.plateNumber.invalid && (f.plateNumber.dirty || f.plateNumber.touched)" class="alert alert-danger">
          <div *ngIf="f.plateNumber.errors?.['required']">Plate number is required.</div>
          <div *ngIf="f.plateNumber.errors?.['pattern']">Invalid plate number. Valid exemple: "TL03AZN"</div>
        </div>
        <div class="form-group">
          <label for="series">[*]VIM Series</label>
          <input id="series" type="text" formControlName="series">
        </div>
        <div *ngIf="f.series.invalid && (f.series.dirty || f.series.touched)" class="alert alert-danger">
          <div *ngIf="f.series.errors?.['required']">VIM is required.</div>
          <div *ngIf="f.series.errors?.['pattern']">Invalid VIM number. 17 characters, I,O,Q excepted.</div>
        </div>
        <div class="form-group">
          <label for="brand">[*]Brand (producer):</label>    
          <input id="brand" type="text" formControlName="brand">
        </div>
        <div *ngIf="f.brand.invalid && (f.brand.dirty || f.brand.touched)" class="alert alert-danger">
          <div *ngIf="f.brand.errors?.['required']">Brand is required.</div>
          <div *ngIf="f.brand.errors?.['minlength']">Brand should have at least 3 letters.</div>
          <div *ngIf="f.brand.errors?.['pattern']">Brand should contain only letters.</div> 
        </div>
        <div class="form-group">
          <label for="model">[*]Model (name):</label>
          <input id="model" type="text" formControlName="model">
        </div>
        <div *ngIf="f.model.invalid && (f.model.dirty || f.model.touched)" class="alert alert-danger">
          <div *ngIf="f.model.errors?.['required']">Model is required.</div>
          <div *ngIf="f.model.errors?.['minlength']">Model should have at least 2 characters.</div>
        </div>
        <div class="form-group">
          <label for="year">[*]Year of production:</label>
          <input id="year" type="number" formControlName="year" [defaultValue]="2025">
        </div>
        <div *ngIf="f.year.invalid && (f.year.dirty || f.year.touched)" class="alert alert-danger">
          <div *ngIf="f.year.errors?.['required']">Year of production is required.</div>
          <div *ngIf="f.year.errors?.['min']">Year of production should be past 1990.</div>
          <div *ngIf="f.year.errors?.['max']">Year of production should be before 2026.</div>
        </div>
        <div class="form-group">
          <label for="engine">[*]Engine type:</label>
          <select class="custom-select" id="engine" formControlName="engine">
            <option *ngFor="let engine of engineTypes" value={{engine}}>{{engine}}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="capacity">[*]Motor capacity (in litres):</label>
          <input id="capacity" type="number" formControlName="capacity">
        </div>
        <div *ngIf="f.capacity.invalid && (f.capacity.dirty || f.capacity.touched)" class="alert alert-danger">
          <div *ngIf="f.capacity.errors?.['required']">Motor capacity is required.</div>
          <div *ngIf="f.capacity.errors?.['min']">Motor capacitiy should be past 1 liter.</div>
          <div *ngIf="f.capacity.errors?.['max']">Motor capacity should be below 7 liters.</div>
        </div>
        <div class="form-group">
          <label for="horse-power">[/*]Horse power</label>
          <input id="horse-power" type="number" formControlName="horsePower" min="0">
        </div>
        <div class="form-group">
          <label for="kW">[/*]kW</label>
          <input id="kW" type="number" formControlName="kW" min="0">
        </div>
        <div *ngIf="applyForm.invalid" class="alert alert-danger">
          <div *ngIf="applyForm.errors?.['atLeastOneRequired']">Fill horse power or kW power fields.</div>
        </div>
        <div class="form-actions">
          <button class="submit-btn" [disabled]="applyForm.invalid" type="submit">Submit</button>
          <button (click)="hiddenForm=!hiddenForm" class="cancel-btn" type="button">Cancel</button>
        </div>
        <p class="alert alert-danger">[*] Fields are required.</p>
      </form>
      </div>
    </div>
    <section *ngFor="let car of cars; let i=index">
      <app-car-card [car]="car"></app-car-card>
      <div [ngClass]="car.active ? 'car-actions active' : 'car-actions inactive'">
        <button class="action-btn edit" [disabled]="car.active===false" (click)="this.toggleEditCar(car.id)"> Edit </button>
        <button class="action-btn delete" [disabled]="car.active===false" (click)="removeCar(car.id)"> Remove </button>
        <button class="action-btn status" (click)="changeCarStatus(clientId, car.id)">Change status</button>
        <button class="action-btn appointment" [disabled]="car.active===false" (click)="toggleAppoitmentForm(car.id, i)">Appoitment</button>
      </div>
      <form class="appointment-form" [hidden]="hiddenAppointmentForm || currentAppointmentFormIndex != i" [formGroup]="appointmentForm" (submit)="addAppointment()">
        <div class="form-group">
          <label for="contact-medium">Contact medium:</label>
          <select id="contact-medium" formControlName="medium" class="custom-select"> 
            <option *ngFor="let medium of mediumTypes" value={{medium}}>{{medium}}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="description">Procedure details:</label>
          <input id="description" type="text" formControlName="description"/>
          <div *ngIf="appointmentf.description.invalid && (appointmentf.description.dirty || appointmentf.description.touched)" class="alert alert-danger">
            <div *ngIf="appointmentf.description.errors?.['required']">Appointment description is required.</div>
            <div *ngIf="appointmentf.description.errors?.['minlength']">Appointment description should have at least 5 characters.</div>
          </div>
        </div>
        <div class="form-group">
          <label for="dateTime">Date of appointment:</label>
          <input id="dateTime" type="text" formControlName="dateTime"/>
        </div>
        <div *ngIf="appointmentf.dateTime.invalid && (appointmentf.dateTime.dirty || appointmentf.dateTime.touched)" class="alert alert-danger">
          <div *ngIf="appointmentf.dateTime.errors?.['required']">Appointment date is required.</div>
          <div *ngIf="appointmentf.dateTime.errors?.['pattern']">Appointment date should have format: dd.mm.yyyy</div>
          <div *ngIf="appointmentf.dateTime.errors?.['greaterEqualThanCurrentDate']">Appointment date cannot be in the past.</div>
        </div>
        <div *ngIf="appointmentf.dateTime.valid">
          <div class="form-group">
            <label for="hourTime">Time of appointment:</label>
            <button (click)="checkIntervals()" type="button" class="time-picker">Check intervals</button>
            <select formControlName="hourTime" class="custom-select">
              <option *ngFor="let interval of generatedAppointmentIntervals" value={{interval}}>{{interval}}</option>
            </select>
          </div>
        </div>
      <div class="appointment-options">
        <button class="submit-btn" [disabled]="appointmentForm.invalid">Submit</button>
        <button class="cancel-btn" (click)="hiddenAppointmentForm=!hiddenAppointmentForm"type="button">Cancel</button>
      </div>
    </form> 
  </section>
  `,
  styleUrl: './cars.component.css'
})
export class CarsComponent {
  appointmentsSerice : AppointmentsService = inject(AppointmentsService);
  carsService : CarsService = inject(CarsService);
  route : ActivatedRoute = inject(ActivatedRoute);

  clientId : number = -1;
  currentCarId : number = -1;
  currentCarIdAppointment : number = -1;
  cars : Car[] = [];
  generatedAppointmentIntervals : string[] | null = null;

  engineTypes = engineTypes;
  mediumTypes = mediumTypes;

  hiddenForm : boolean = true;
  formMode = 'ADD'

  hiddenAppointmentForm : boolean = true;
  currentAppointmentFormIndex = -1

  applyForm = new FormGroup({
    plateNumber : new FormControl(''),
    series : new FormControl(''),
    brand : new FormControl(''),
    model : new FormControl(''),
    year : new FormControl(0),
    engine : new FormControl('diesel'),
    capacity : new FormControl(0),
    horsePower : new FormControl(0),
    kW : new FormControl(0),
  })

  appointmentForm = new FormGroup({
    medium : new FormControl('in person'),
    description : new FormControl('' ,[
      Validators.required,
      Validators.minLength(5)
    ]),
    dateTime : new FormControl('', [
      Validators.required,
      Validators.pattern('(([1-3][0-9])|(0[1-9]))\\.((0[1-9])|(1[0-2]))\.((202[5-9])|(20[3-9][0-9]))'),
      greaterEqualThanCurrentDate()
    ]),
    hourTime : new FormControl('')
  })

  constructor(private _router : Router, private injector : Injector){
    this.clientId = Number(this.route.snapshot.params['id']);

    const clientsService = this.injector.get(ClientService);
    if(clientsService.getClientById(this.clientId)?.active === false)
      this._router.navigate(['']);

    try{
      this.cars = this.carsService.getClientCars(this.clientId);
    }catch(Error){
      this._router.navigate(['']);
    }
  }

  toggleAddCar() : void{
    this.applyForm = new FormGroup({
      plateNumber : new FormControl('' ,[
        Validators.required,
        //TODO: Better validation (([A-Z]|[A-Z]{2})(0[1-9]|[1-9][0-9])[A-Z]{3})|([A-Z]((00[1-9])|([0-9]{2}[1-9]))([A-Z]{3}))
        Validators.pattern('(([A-Z]|[A-Z]{2})(0[1-9]|[1-9][0-9])[A-Z]{3})')
      ]),
      series : new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-HJ-NPR-Z0-9]{17}$')
      ]),
      brand : new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('[a-zA-z]+')
      ]),
      model : new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      year : new FormControl(2025, [
        Validators.required,
        Validators.min(1990),
        Validators.max(2025),
      ]),
      engine : new FormControl('diesel'),
      capacity : new FormControl(2, [
        Validators.required,
        Validators.min(1),
        Validators.max(7)
      ]),
      horsePower : new FormControl(0, [
      ]),
      kW : new FormControl(0, [

      ]),
    }, { validators: [this.atLeastOneValidator()]})

    this.formMode = 'ADD';
    this.hiddenForm = !this.hiddenForm;
  }

  toggleEditCar(carId: number) : void{ 
    const car : Car | undefined = this.carsService.getClientCarById(this.clientId, carId);

    if(car === undefined)
      throw new Error(`Car with id: ${carId} not found.`);

    this.applyForm = new FormGroup({
      plateNumber : new FormControl(car.plateNumber ,[
        Validators.required,
        //TODO: Better validation (([A-Z]|[A-Z]{2})(0[1-9]|[1-9][0-9])[A-Z]{3})|([A-Z]((00[1-9])|([0-9]{2}[1-9]))([A-Z]{3}))
        Validators.pattern('(([A-Z]|[A-Z]{2})(0[1-9]|[1-9][0-9])[A-Z]{3})')
      ]),
      series : new FormControl(car.series, [
        Validators.required,
        Validators.pattern('^[A-HJ-NPR-Z0-9]{17}$')
      ]),
      brand : new FormControl(car.brand, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('[a-zA-z]+')
      ]),
      model : new FormControl(car.model, [
        Validators.required,
        Validators.minLength(2)
      ]),
      year : new FormControl(car.year, [
        Validators.required,
        Validators.min(1990),
        Validators.max(2025),
      ]),
      engine : isEngine(car.engine) ? new FormControl(car.engine) : new FormControl('diesel'),
      capacity : new FormControl(car.capacity, [
        Validators.required,
        Validators.min(1),
        Validators.max(7)
      ]),
      horsePower : new FormControl(car.horsePower, [
      ]),
      kW : new FormControl(car.kW, [
      ]),
    }, { validators: [this.atLeastOneValidator()]})

    this.currentCarId = carId;
    this.formMode = 'EDIT';
    this.hiddenForm = !this.hiddenForm;
  }

  toggleAppoitmentForm(carId : number, appointmentFormIndex : number) : void{
    this.currentAppointmentFormIndex = appointmentFormIndex;
      this.currentCarIdAppointment = carId;
      this.hiddenAppointmentForm = !this.hiddenAppointmentForm;
  }

  formToCar(carId : number) : Car {
    const engine = this.applyForm.value.engine ?? 'diesel'

    let horsePowerValue = this.applyForm.value.horsePower ?? 0;
    let kWPowerValue = this.applyForm.value.kW ?? 0;
    [horsePowerValue, kWPowerValue] = this.carsService.horsePowerkWConverstion(horsePowerValue, kWPowerValue);    

    const carFromForm : Car = {
      active : true,
      id : carId,
      plateNumber : (this.applyForm.value.plateNumber)!.trim() ?? '',
      series : (this.applyForm.value.series)!.trim() ?? '',
      brand : (this.applyForm.value.brand)!.trim().toLowerCase() ?? '',
      model : (this.applyForm.value.model)!.trim() ?? '',
      year : Number(this.applyForm.value.year) ?? 2025,
      engine : isEngine(engine) ? engine : 'diesel',
      capacity : this.applyForm.value.capacity ?? 2,
      horsePower : horsePowerValue,
      kW : kWPowerValue ?? 0
    }

    return carFromForm;
  }

  submitAddCar() : void{
    let lastCarIndex = -1;

    if(this.cars.length === 0)
      lastCarIndex = -1;
    else{
      const lastCar = this.cars[this.cars.length-1];
      lastCarIndex = lastCar.id;
    }
  
    const currentIndex = lastCarIndex + 1;

    const carToAdd = this.formToCar(currentIndex);

    this.carsService.addClientCar(this.clientId, carToAdd);
  }

  submitEditCar() : void{
    const modifiedCar : Car = this.formToCar(this.currentCarId);
    this.carsService.updateClientCar(this.clientId, modifiedCar);
  }

  changeCarStatus(clientId : number, carId : number) : void{
    this.carsService.changeCarStatus(clientId, carId);
  }

  removeCar(id : number) : void{
    this.carsService.removeClientCar(this.clientId, id);
  }

  addAppointment(){
    const appointmentId : number = this.appointmentsSerice.getLastAppointmentIndex() + 1;
    const time = (this.appointmentForm.value.dateTime!).trim() + ' ' + this.appointmentForm.value.hourTime!;
    const appointment : Appointment = {
      id : appointmentId,
      clientId : this.clientId,
      carId : this.currentCarIdAppointment,
      medium : this.appointmentForm.value.medium ?? 'in person',
      description : this.appointmentForm.value.description ?? '',
      time : time ?? '',
      car : null,
      client: null,
      history : {
        stage : 'arrival',
        arrival : undefined,
        processing : undefined
      }
    }
    this.appointmentsSerice.addAppointment(appointment);
  }

  get f(){
    return this.applyForm.controls;
  }

  get appointmentf(){
    return this.appointmentForm.controls;
  }

  checkIntervals(){
    const day : string = this.appointmentForm.value.dateTime!;
    this.generatedAppointmentIntervals = this.appointmentsSerice.generateAppointmentIntervals(8,17,day);
  }

  atLeastOneValidator() : ValidatorFn{
    return (group : AbstractControl) : ValidationErrors | null => {
      const car = group.value;

      const horsePower = car['horsePower'];
      const kW = car['kW'];
  
      if(horsePower === 0 && kW === 0){
        return {atLeastOneRequired : true};
      }
  
      return null;
    }
  }

}

