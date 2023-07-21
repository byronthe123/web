import { IFFM } from "../../../globals/interfaces";

export interface IExtendedFFM extends IFFM {
    rackPcs: number;
    deliveredPcs: number;
}

export interface IFlight {
    s_flight_number: string;
}