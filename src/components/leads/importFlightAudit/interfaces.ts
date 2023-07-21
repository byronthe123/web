import { IMap, IFFM } from '../../../globals/interfaces';

export type AwbsMap = IMap<IFFM>;

export interface IUniqueFlight {
    s_flight_number: string;
}

export interface IFlightAuditData extends IFFM {
    isc: number;
    storage: number;
    total: number;
}

export type FlightAuditData = Array<IFlightAuditData>;