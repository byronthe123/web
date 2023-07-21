import { IMap, IFFM, IFHL, IULD } from "../../../globals/interfaces";

export interface IExtendedFFM extends IFFM {
    s_logo: string;
    hawbs: Array<IFHL>;
    hasHawb: boolean;
    hawbsCount: number;
}

export interface IAirline {
    s_flight_number: string;
    s_flight_id: string;
    s_logo: string;
    s_status: string;
    s_modified_by: string;
    t_modified: Date;
}

export interface IExtendedULD extends IULD {
    awbs: Array<IExtendedFFM>;
}

export interface IUldMapData {
    s_shc: string;
    awbs: IMap<IExtendedFFM>;
}

export type UldMap = IMap<IUldMapData>;

export type DeleteLevel = 'FLIGHT' | 'ULD' | 'AWB';

export type AddNotesType = 'uld' | 'awb';
