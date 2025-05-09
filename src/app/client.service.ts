import { inject, Injectable, Injector } from '@angular/core';
import { Client } from './client';
import {clients} from './data';
import { AppointmentsService } from './appointments.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private injector : Injector) {    
    const saved = localStorage.getItem('clients')
    if(saved)
      return;

    localStorage.setItem('clients', JSON.stringify(clients)) 
  }

  updateStorage(clients : Client[]) : void{
    localStorage.setItem('clients', JSON.stringify(clients))
  }

  getAllClients() : Client[]{
    const clients = localStorage.getItem('clients');
    if(clients)
      return JSON.parse(clients);
    throw new Error('This is not possible.');
  }

  getClientById(id : number) : Client | undefined {

    const clients : Client[] = this.getAllClients();

    for(const client of clients){
      if(client.id === id)
        return client
    }
    return undefined;
  }

  addClient(firstName: string, lastName: string, phoneNumbers : string, email: string) {
    
    let data : Client[] = this.getAllClients();
    const lastClient : Client | undefined = data.at(-1);


    let newClientId : number = 0;
    if (lastClient)
        newClientId = lastClient.id + 1;

    const phoneNumbersArr : string[] = phoneNumbers.split('-');
    const client : Client = {
      active : true,
      id : newClientId,
      firstName : firstName.trim(),
      lastName: lastName.trim(),
      phoneNumbers : phoneNumbersArr,
      email : email.trim(),
      cars : []
    }

    data.push(client);
    this.updateStorage(data);
    location.reload();

  }

  editClient(client : Client, id : number) : void{
    const clients  = this.getAllClients();
    let found = false;

    for(let i=0; i<clients.length; ++i){
      if(clients[i].id === id)
      {
        clients[i] = client;
        found = true;
        break;
      }
    }

    if(found === false)
      throw new Error("User not found!");

    this.updateStorage(clients);
    location.reload();

  }

  deleteClient(id : number) : void {
    let data : Client[]= this.getAllClients();
    const filteredData = data.filter(client => client.id !== id);

    const appointmentsService = this.injector.get(AppointmentsService);
    appointmentsService.deleteAppointmentsForClientById(id);

    this.updateStorage(filteredData);
    location.reload();
  }

  changeClientStatus(clientId : number) : void{
    const clients : Client[] = this.getAllClients();
    let client : Client | null = null;

    for(let i=0; i<clients.length; ++i){
      if(clients[i].id === clientId){
        clients[i].active = !clients[i].active;
        client = clients[i];
      }
    }
    if(client === null)
      throw new Error(`Client with id:${clientId} not found.`);

    if(client.active === false){
    const appointmentsService = this.injector.get(AppointmentsService);
    appointmentsService.deleteAppointmentsForClientById(clientId);
    }

    this.updateStorage(clients);
    location.reload();
  }
}
