export const servicesOptions = ['check', 'inspection'] as const;
type Services = (typeof servicesOptions)[number];

function isService(entry : any) : entry is Services{
    return servicesOptions.includes(entry);
}

type Arrival = {
    visual : string,
    problems : string,
    service : Services
}

type Processing = {
    operations : string,
    parts : string,
    problems : string,
    solvedProblems : string,
    timeMinutes : number
}

const stages = ['arrival', 'processing', 'done'] as const;
type Stages = (typeof stages)[number];

function isStage(entry : any) : entry is Stages{
    return stages.includes(entry);
}

interface AppointmentHistory {
    identifiers? : string
    stage : Stages,
    arrival? : Arrival
    processing? : Processing
}

export {Services, isService, AppointmentHistory, Stages, isStage, Arrival, Processing};