import { IFFM, IRack, IFHL, IMap } from "../../../../globals/interfaces";

export interface IULDFlight {
    s_flight_number: string,
    s_flight_id: string,
    s_logo: string
}

export interface IULDFFM extends IFFM {
    uldSum: number;
    flightSum: number;
    fwbPieces: number;
    locations: Array<IRack>;
    locatedCount: number;
    fhlsMap: IMap<number>
}

export interface ISelectedHawb {
    s_hawb: string;
    i_pieces: number;
}