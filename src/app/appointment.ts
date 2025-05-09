import { AppointmentHistory } from "./appointment-history";
import { Car } from "./car";
import { Client } from "./client";

export const mediumTypes = ["email" , "phone" ,"in person"];
type Medium = (typeof mediumTypes)[number]

function isMedium(medium : any) : medium is Medium{
    return mediumTypes.includes(medium);
}

interface Appointment {
    id : number,
    clientId : number,
    carId : number,
    medium : Medium,
    description : string,
    time : string,
    car : Car | null,
    client : Client | null,
    history : AppointmentHistory
}

export {Medium, isMedium, Appointment}
