import { Injectable, inject } from '@angular/core';
import { AppointmentHistory, Arrival, Processing } from './appointment-history';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointment';
import { history } from './data';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  appointmentService : AppointmentsService = inject(AppointmentsService)
  constructor(private _router : Router) {
    const historyFromStorage = localStorage.getItem("history");
    if(!historyFromStorage){
      localStorage.setItem("history", JSON.stringify(history));
    }
  }

  updateHistoryStorage(historyData : AppointmentHistory[]) : void{
    localStorage.setItem("history", JSON.stringify(historyData));
    location.reload();
  }

  updateHistoryStorageWithoutReload(historyData: AppointmentHistory[]) : void{
    localStorage.setItem("history", JSON.stringify(historyData));
  }

  getAllHistoryData() : AppointmentHistory[]{
    const historyDataJSON = localStorage.getItem("history");
    return JSON.parse(historyDataJSON!);
  }

  getHistoryByIdentifierDB(historyIdentifier : string) : AppointmentHistory{
    const historyData = this.getAllHistoryData();
    for(let i=0; i<historyData.length; ++i){
      if(historyData[i].identifiers === historyIdentifier)
        return historyData[i];
    }
    throw new Error(`Appointment History with identifier:{historyIdentifier} not found`);
  }

  getIndexForAppointmentHistory(historyIdentifier : string) : number{
    const historyData = this.getAllHistoryData();
    for(let i=0; i<historyData.length; ++i){
      if(historyData[i].identifiers === historyIdentifier)
        return i;
    }
    throw new Error(`Index for history identifier:${historyIdentifier} not found`);
  }

  getHistoryByAppointmentId(appointmentId : number) : AppointmentHistory{  
    const appointment : Appointment = this.appointmentService.getAppointmentById(appointmentId);
    return appointment.history!;
  }

  addArrivalDataToHistory(appointmentId : number, arrivalData : Arrival) : void{
    const appointmentIndex = this.appointmentService.getAppointmentIndexDBbyId(appointmentId);
    let appointments = this.appointmentService.getAllAppointments();

    appointments[appointmentIndex].history.arrival = arrivalData;
    appointments[appointmentIndex].history.stage = 'processing';
    
    this.appointmentService.updateAppointmentStorage(appointments);
  }

  addProcessingDataToHistory(appointmentId : number, processingData: Processing) : void{
    const appointmentIndex = this.appointmentService.getAppointmentIndexDBbyId(appointmentId);
    let appointments = this.appointmentService.getAllAppointments();

    appointments[appointmentIndex].history.processing = processingData;
    appointments[appointmentIndex].history.stage = 'done';

    this.appointmentService.updateAppointmentStorage(appointments);
  }

  // TODO: make navigation to history page work
  addNewHistory(appointmentId : number) : void{
    const appointment = this.appointmentService.getAppointmentById(appointmentId);
    let historyData = this.getAllHistoryData();
    const newHistory = appointment.history;

    historyData.push(newHistory);

    this.appointmentService.deleteAppointment(appointmentId);

    this.updateHistoryStorageWithoutReload(historyData);
    this._router.navigate(['/history']);
  }

  editHistoryEntry(historyIdentifier : string, editedHistoryEntry : AppointmentHistory) : void{
    let historyData = this.getAllHistoryData();
    const dbIndex = this.getIndexForAppointmentHistory(historyIdentifier);
    historyData[dbIndex] = editedHistoryEntry;

    this.updateHistoryStorage(historyData);
  }

  deteleHistoryEntry(historyIdentifier : string) : void{
    const historyData = this.getAllHistoryData();
    const removedEntryData = historyData.filter(entry => entry.identifiers !== historyIdentifier);

    this.updateHistoryStorage(removedEntryData);
  }
}
