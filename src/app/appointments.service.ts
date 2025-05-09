import { inject, Injectable } from '@angular/core';
import { appointments } from './data';
import { Appointment } from './appointment';
import { ClientService } from './client.service';
import { CarsService } from './cars.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  clientService : ClientService = inject(ClientService);
  carsService : CarsService = inject(CarsService);

  constructor(private _router : Router) {
    const localAppointments : string | null = localStorage.getItem("appointments");
    if(!localAppointments)
        localStorage.setItem("appointments", JSON.stringify(appointments));
   }

   updateAppointmentStorage(appointments : Appointment[]) : void{
    const data: string = JSON.stringify(appointments);
    localStorage.setItem("appointments", data);
    location.reload();
   }

   updateAppointmentStorageWithoutReload(appointments : Appointment[]) : void{
    const data: string = JSON.stringify(appointments);
    localStorage.setItem("appointments", data);
   }

   getAppointmentIndexDBbyId(appointmentId : number) : number{
    const appointments = this.getAllAppointments();
    for(let i=0; i<appointments.length; ++i){
      if(appointments[i].id === appointmentId)
        return i;
    }
    throw new Error(`Appointment with id:${appointmentId} not found`);
   }

   getLastAppointmentIndex() : number{
    const appointments : Appointment[] = this.getAllAppointments();

    if(appointments.length === 0)
      return 0;

    const lastAppointment = appointments.at(-1);
    return lastAppointment!.id;
    }

   getAllAppointments() : Appointment[] {
    const appointments : string | null = localStorage.getItem("appointments");
    if(appointments === null)
      throw new Error("Appointments not found.");
    return JSON.parse(appointments);

   }

   getAppointmentById(appointmentId : number) : Appointment {
    const appointments = this.getAllAppointments();
    for(let appointment of appointments){
      if(appointment.id === appointmentId)
        return appointment
    }
    throw new Error(`Appointment with id:${appointmentId} not found`);
   }

   addAppointment(appointment : Appointment) : void{
      let appointments : Appointment[] = this.getAllAppointments();

      const client = this.clientService.getClientById(appointment.clientId);
      if(client === undefined)
        throw new Error(`Client with id:${appointment.clientId} not found`);
      appointment.client = client;

      const car = this.carsService.getClientCarById(appointment.clientId, appointment.carId);
      if(car === undefined)
        throw new Error(`Car with id:${appointment.carId} not found`);
      appointment.car = car;

      appointment.history.identifiers = `${client.firstName + client.lastName},${car?.plateNumber},${appointment.time} `

      appointments.push(appointment);
      this.updateAppointmentStorageWithoutReload(appointments);
      this._router.navigate(['/appointments'])
   }

   editAppointment(appointmentId : number, editedAppointment : Appointment) : void {

      let appointments = this.getAllAppointments();
      let found : boolean = false;
      for(let i=0; i<appointments.length; ++i){
        if(appointments[i].id === appointmentId){
          appointments[i] = editedAppointment;
          found = true;
        }
      }
      if(found === false)
        throw new Error(`Appointment to be edited with id:${appointmentId} not found`);

      this.updateAppointmentStorage(appointments);
   }

   deleteAppointment(appointmentId : number) : void{
      const appointments : Appointment[] = this.getAllAppointments();
      const processedAppointments =  appointments.filter(appointment => appointment.id !== appointmentId);

      this.updateAppointmentStorage(processedAppointments);
   }

   deleteAppointmentsForCarByIds(clientId : number, carId : number) : void{
    const appointments = this.getAllAppointments();
    const appointmentsWithoutCar = appointments.filter(appointment => appointment.clientId !== clientId && appointment.carId !== carId);

    this.updateAppointmentStorage(appointmentsWithoutCar);
   }

   deleteAppointmentsForClientById(clientId : number) : void{
    const appointments = this.getAllAppointments();
    const appointmentWithoutClient = appointments.filter(appointment => appointment.clientId !== clientId);

    this.updateAppointmentStorage(appointmentWithoutClient);
   }

   generateAppointmentIntervals(begin : number, end : number, day : string) : string[] {
    const appointments : Appointment[] = this.getAllAppointments();
    const dayAppointments : Appointment[] = appointments.filter(appointment => {
      const dayOfAppointment : string = appointment.time.split(' ')[0];
      return day === dayOfAppointment;
    })

    const bookedIntervals : string[] = [];
    for(let appointment of dayAppointments){
      const appointmentHour = appointment.time.split(' ')[1];
      bookedIntervals.push(appointmentHour);
    } 

    let intervalsList : string[] = [];

    for(let nr=begin; nr<end; ++nr){
      const fixedInterval = `${nr}:00`;
      const halfInterval = `${nr}:30`;

      if(!bookedIntervals.includes(fixedInterval))
        intervalsList.push(fixedInterval);  

      if(!bookedIntervals.includes(halfInterval))
        intervalsList.push(halfInterval);
    }

    return intervalsList;
   }

   returnAppointmentDateTime(appointment : Appointment) : string[]{
    const [date, time] = appointment.time.split(' ');
    return [date, time];
   }
   
}

export function greaterEqualThanCurrentDate() : ValidatorFn{
  return (group : AbstractControl) : ValidationErrors | null => {
    const errorObject = {greaterEqualThanCurrentDate : true};

    const date : string = group.value;
    let today : Date = new Date();
    const dd : number = today.getDate();
    // January is 0.
    const mm : number = today.getMonth() + 1
    const yyyy : number = today.getFullYear();

    const [inputDD, inputMM, inputYYYY] : string[] = date.split('.');

    if(inputDD === undefined || inputMM === undefined)
      return errorObject

    const convertableInputDD : string | undefined = inputDD[0] === '0' ? inputDD[1] : inputDD;
    const convertableInputMM : string | undefined = inputMM[0] === '0' ? inputMM[1] : inputMM; 

    if(Number(inputYYYY) > yyyy)
      return null;
    
    if(Number(inputYYYY) < yyyy)
      return errorObject

    if(Number(convertableInputMM) > mm)
      return null;
    
    if(Number(convertableInputMM) < mm)
      return errorObject;

    if(Number(convertableInputDD) > dd)
      return null;

    if(Number(convertableInputDD) < dd)
      return errorObject;
    
    return null;
  }
}