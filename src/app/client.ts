import { Car } from "./car";

// Requirements: 
// A client can have 1 or more phone numbers.
// A client must have at least 1 car.

export interface Client {
    active : boolean,
    id : number,
    firstName : string,
    lastName : string,
    phoneNumbers : string[],
    email : string,
    cars : Car[]
}
