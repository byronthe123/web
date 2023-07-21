import { IFFM } from "../../../globals/interfaces";

export interface INotifyFFM extends IFFM {
    notification_id: number;
    s_logo: string;
    selected?: boolean;
}

export interface INotifyFlight {
    uniqueFlightAwbs: Array<INotifyFFM>;
    notifiedSum: number;
}

export interface IFlightArrayItem {
    s_flight_number: string;
    s_logo: string;
    uniqueFlightAwbs: Array<INotifyFFM>;
    notifiedSum: number;
    notifiedPercent: string;
}