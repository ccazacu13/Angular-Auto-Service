export const engineTypes = ['diesel' , 'petrol' , 'electric' , 'hybrid'] as const;
type Engine = (typeof engineTypes)[number];

function isEngine(engine : any) : engine is Engine{
    return engineTypes.includes(engine);
}

interface Car {
    active : boolean,
    id : number,
    plateNumber : string,
    series : string,
    brand : string,
    model : string,
    year : number,
    engine : Engine
    capacity : number,
    horsePower : number,
    kW : number

}

export {Engine, isEngine, Car};