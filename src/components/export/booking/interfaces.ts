export interface IBookingMawb {
    id: number;
    s_mawb: string;
    s_origin: string;
    s_destination: string;
    s_nature_of_goods: string;
    s_carrier_agent: string;
    s_carrier_iata: string;
    s_carrier_account: string;
    i_pieces: number;
    f_weight: number;
    f_volume: number;
    s_shc: string;
    s_shipment_remarks: string;
    s_created_by: string;
    t_created: Date;
    s_modified_by: string;
    t_modified: Date;
    s_status: string;
}

export interface IBookingMawbPiece {
    id: number;
    s_pieces_guid: string;
    i_pieces: number;
    f_width: number;
    f_length: number;
    f_height: number;
    f_weight: number;
    f_chargable_weight: number;
    f_volume: number;
    s_shc: string;
    i_booking_mawb_id: number;
    s_piece_remark: string;
    s_created_by: string;
    t_created: Date;
    s_modified_by: string;
    t_modified: Date;
    s_status: string;
}

export interface IBooking {
    id: number;
    i_flight_id: number;
    s_mawb: string;
    i_pieces: number;
    f_weight: number;
    f_cw: number;
    f_volume: number;
    s_shc: string;
    s_created_by: string;
    t_created: Date;
    s_modified_by: string;
    t_modified: Date;
    s_status: string;
    s_remarks: string;
}

export interface IExtendedBooking extends IBooking {
    s_flight_id: string;
    s_origin_airport: string;
    s_destination_airport: string;
    acceptedTime: string;
    bookingMawbPieces?: Array<IBookingMawbPiece>;
    s_carrier_agent?: string;
}

export type CreateUpdateBookingMawb = (
    data: IBookingMawb,
    update: boolean
) => Promise<boolean>;

export type CreateUpdateBookingMawbPieces = (
    data: IBookingMawbPiece,
    update: boolean
) => Promise<boolean>;

export type DeleteBookMawbPieces = (id: number) => Promise<boolean>;

export type CreateUpdateBooking = (data: IBooking, update: boolean) => Promise<boolean>;

export type DeleteBooking = (id: number) => Promise<boolean>;