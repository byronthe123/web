export interface FFM {
    id: number;
    selected: boolean;
    d_arrival_date: any;
    d_storage_start: Date;
    d_storage_second_free: Date;
    i_actual_piece_count: number;
    f_weight: number;
    s_airline_code: string;
    s_origin: string;
    s_destination: string
}

export interface FHL {
    s_hawb: string;
    i_mawb_pieces: number;
    f_mawb_weight: number;
    i_pieces: number;
    f_weight: number;
    s_nature_of_goods: string;
    s_shipper_address_name1: string;
    s_consignee_address_name1: string;
    t_created: Date;
    t_modified: Date
}

export interface FWB {
    t_created: Date;
    s_flight_1: string;
    d_flight_1_schedule: Date;
    i_total_pieces: number;
    f_weight: number
}

export interface Payment {
    [x: string]: any;
    s_awb: string;
    s_hawb: string | null;
    selected: boolean;
    s_payment_method: string;
    s_payment_type: string;
    b_override_approved: boolean;
    f_amount: number
}

export interface Location {
    [x: string]: any;
    selected: boolean;
    b_comat: boolean;
    s_hawb: string;
    i_pieces: number;
    b_customs_hold: boolean;
    b_usda_hold: boolean;
    b_hold: boolean
}

export interface IscData {
    airlineDataWithDetail?: {
        AirlineMappingDetail: {
            f_import_isc_cost: number;
            f_import_per_kg: number;
            f_import_min_charge: number
        }
    };
    corpStationData?: {
        f_import_isc_cost: number;
        f_import_per_kg: number;
        f_import_min_charge: number
    }
}

export interface File {
    base64: string;
    type: string;
    s_file_type?: string;
    guid: string;
    name?: string;
    modalType?: string
}

export interface FSN {
    id: number;
    s_mawb: string;
    s_hawb: string;
    s_location: string;
    s_arr: string;
    s_csn: string;
    s_csn_code: string;
    s_edi: string;
    t_created: string;
    hold?: boolean
}

export interface ISelectedAwb {
    id: number;
    s_mawb: string;
    s_transaction_id: string;
    s_type: string;
    s_trucking_driver: string;
    s_unit: string;
    s_airline: string;
    s_mawb_id: string;
    s_driver_photo_link: string | null
}

export interface IOtherCharge {
    amount: number;
    description: string
}
