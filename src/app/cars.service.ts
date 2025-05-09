import { Injectable , Injector, inject} from '@angular/core';
import { ClientService } from './client.service';
import { Client } from './client';
import { Car } from './car';
import { AppointmentsService } from './appointments.service';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private clientService : ClientService = inject(ClientService);

  constructor(private injector : Injector) { }

  getClientCars(id : number) : Car[]{
    const clients = this.clientService.getAllClients();
    const client = this.clientService.getClientById(id);
    if(client === undefined)
      throw new Error(`Client with id:${id} not found.`);

    const cars : Car[] = client.cars;
    return cars;
  }

  getClientCarById(clientId : number, carId : number) : Car | undefined {
    const cars = this.getClientCars(clientId);
    for(let car of cars){
      if(car.id === carId)
        return car
    }
    return undefined;
  }

  addClientCar(id : number, car : Car) : void{
    let clients = this.clientService.getAllClients();
    let found = false;
    for(let i=0; i<clients.length; ++i){
      if(clients[i].id === id){
        clients[i].cars.push(car);
        found = true;
        break;
      }
    }

    if(found === false)
      throw new Error(`Client with ${id} not found`);

    this.clientService.updateStorage(clients);
    location.reload();
  }
  
  updateClientCar(clientId : number, modifiedCar : Car) : void{
    let clients : Client[] = this.clientService.getAllClients();

    let foundClient = false;
    let clientIndex = -1;
    for(let i=0; i<clients.length; ++i){
      if(clients[i].id === clientId){
        clientIndex = i;
        foundClient = true;
        break;
      }
    }

    if(foundClient === false)
      throw new Error(`Client with id:${clientId} not found.`);

    let carFound = false;
    let carIndex = -1;
    for(let i=0; i<clients[clientIndex].cars.length; ++i){
      if(clients[clientIndex].cars[i].id === modifiedCar.id){
        carIndex = i;
        carFound = true;
        break;
      }
    }

    if(carFound === false)
      throw new Error(`Card with id:${modifiedCar.id} belonging to clientId:${clientId} not found.`)

    clients[clientIndex].cars[carIndex] = modifiedCar;
    this.clientService.updateStorage(clients);
    location.reload();
  }

  changeCarStatus(clientId : number, carId : number) : void{
    const clients : Client[] = this.clientService.getAllClients();

    let activeState : boolean = true
    for(let i=0; i<clients.length; ++i){
      if(clients[i].id === clientId){
        activeState =  !clients[i].cars[carId].active;
        clients[i].cars[carId].active = activeState;
      }
    }

    if(activeState === false){
      const appointmentsService = this.injector.get(AppointmentsService);
      appointmentsService.deleteAppointmentsForCarByIds(clientId, carId);
    }

    this.clientService.updateStorage(clients);
    location.reload();
  }

 removeClientCar(clientId: number, carId : number) : void{
    let clients = this.clientService.getAllClients();
    let found = false;
    let clientIndex = -1;

    for(let i=0; i< clients.length; ++i){
      if(clients[i].id === clientId){
        clients[i].cars = clients[i].cars.filter(car => car.id !== carId);
        clientIndex = i;
        found=true;
        break;
      }
    }

    if(found === false){
      throw new Error(`Client with the id:${clientId} not found.`);
    }
    
    // If client has no more cars he is deleted.
    if(clients[clientIndex].cars.length === 0){
      this.clientService.deleteClient(clientId);
      return;
    }

    const appointmentsService = this.injector.get(AppointmentsService);
    appointmentsService.deleteAppointmentsForCarByIds(clientId, carId);

    this.clientService.updateStorage(clients);
    location.reload();
 }

 horsePowerkWConverstion(horsePower : number, kW:number): number[] {
  const conversionConstant = 0.7457;

  if(horsePower > 0){
    kW = horsePower * conversionConstant;
    const trimmedKW= kW.toFixed(2);
    return [horsePower, Number(trimmedKW)];
  }
  if(horsePower === 0 && kW > 0){
    horsePower = kW / conversionConstant;
    const trimmedHorsePower = horsePower.toFixed(2);
    return [Number(trimmedHorsePower), kW]
  }
  throw new Error("HorsePower and kW are not valid inputs.");

 }

}