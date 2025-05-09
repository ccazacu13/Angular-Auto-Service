import { Appointment } from "./appointment";
import { AppointmentHistory } from "./appointment-history";
import { Client } from "./client";

const clients : Client[] = [
    {   
        active : true,
        id : 0,
        firstName : 'George',
        lastName : 'Dumitru',
        phoneNumbers : ['0745335912', '0743980462'],
        email : 'george.dumitru@gmail.com',
        cars : [
        { 
            active : true,
            id : 0,
            plateNumber : 'TL03AZN',
            series : 'VNMSXRT84931NWLAB',
            brand : 'bmw',
            model : 'x3',
            year : 2025,
            engine : 'petrol',
            capacity : 3,
            horsePower : 190,
            kW : 140.6
        },
        { 
            active : true,
            id : 1,
            plateNumber : 'B03ANV',
            series : 'VNMSMNZ10458DFGAB',
            brand : 'bmw',
            model : 'i5',
            year : 2024,
            engine : 'electric',
            capacity : 3,
            horsePower : 261,
            kW : 193.14
        },
        { 
            active : true,
            id : 2,
            plateNumber : 'B10CAN',
            series : 'VNMSBAC67290LUEAB',
            brand : 'audi',
            model : 'a8',
            year : 2024,
            engine : 'hybrid',
            capacity : 2,
            horsePower : 460,
            kW : 340.4
        }
      ]
    },
    {
        active : true,
        id : 1,
        firstName : 'Cristian',
        lastName : 'Cazacu',
        phoneNumbers : ['0741235987'],
        email : 'cristian.cazacu@gmail.com',
        cars : [{ 
            active : true,
            id : 0,
            plateNumber : 'CT74RAM',
            series : 'VNMSNWE78541ZNTAB',
            brand : 'ford',
            model : 'focus hatchback',
            year : 2005,
            engine : 'diesel',
            capacity : 1.4,
            horsePower : 215,
            kW : 151.4
        }]
    },
    {
        active : true,
        id : 2,
        firstName : 'Viorel',
        lastName : 'Narcisa',
        phoneNumbers : ['0745372645-0748462045'],
        email : 'viorel.narcisa@gmail.com',
        cars : [{ 
            active : true,
            id : 0,
            plateNumber : 'BC88CAN',
            series : 'VNMSHPL09327TKMAB',
            brand : 'ford',
            model : 'focus IV',
            year : 2019,
            engine : 'diesel',
            capacity : 2.5,
            horsePower : 150,
            kW : 111
        }]
    },
    {
        active : true,
        id : 3,
        firstName : 'Cornel',
        lastName : 'Danila',
        phoneNumbers : ['0745335912'],
        email : 'cornel.danila@gmail.com',
        cars : [{
            active : true, 
            id : 0,
            plateNumber : 'BC88CAN',
            series : 'VNMSHPL09327TKMAB',
            brand : 'ford',
            model : 'focus IV',
            year : 2019,
            engine : 'diesel',
            capacity : 2.5,
            horsePower : 150,
            kW : 111
        }]
    },
]

const appointments : Appointment[] = []

const history : AppointmentHistory[] = []

export {clients, appointments, history};
