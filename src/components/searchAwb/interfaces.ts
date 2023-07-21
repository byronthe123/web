import { IFSN, ICbpAceCode } from "../../globals/interfaces";

export interface IMenuItem {
    key: string,
    name: string,
    data: Array<any>,
    hasData: boolean,
    dataCount?: number
}

export interface IPcsWgtMap {
    [s_flight_id: string]: {
        i_actual_piece_count: number,
        f_weight: number
    }
}

export type IFsnCbpJoin = IFSN & ICbpAceCode;