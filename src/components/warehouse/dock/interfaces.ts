import { IMap, IRack } from '../../../globals/interfaces';

export interface IDockAwb {
    id: number;
    s_mawb: string;
    s_hawb: string;
    s_unit: string;
    s_type: string;
    s_status: string;
    s_state: string;
    s_trucking_company: string;
    s_trucking_driver: string;
    s_transaction_id: string;
    s_mawb_id: string;
    t_kiosk_submitted: string;
    t_counter_end: string;
    s_counter_ownership_agent: string;
    t_dock_ownership: string;
    s_dock_ownership: string;
    s_driver_photo_link: string | null;
    b_trucking_sms: boolean;
    t_created: string;
    s_created_by: string;
    s_location: string;
    s_notes: string;
    s_dock_door: string;
    s_dock_door_assigned: string;
    s_dock_door_guid: string;
    t_dock_door: string;
}

export interface ICompany {
    s_transaction_id: string;
    exportCount: number;
    importCount: number;
    s_trucking_company: string;
    s_trucking_driver: string;
    s_dock_door: string;
    s_dock_ownership: string;
    s_state: string;
    s_status: string;
    waitTime: string;
    processingTime: string;
    overDue: boolean;
    awbs: Array<IDockAwb>;
}

interface IAwbRackData {
    rackData: Array<IRack>;
    rackPieces: number;
    rackWeight: number;
    rackShc: string;
    rackLocations: number;
    fwbCommodity: string;
    fwbPieces: string;
}

export type IAwbRackDataMap = IMap<IAwbRackData>;

export interface IDoorProps {
    multiService: boolean;
}

export type IDoors = IMap<IDoorProps>;

export type LaunchModalReject = (rejectType: 'COMPANY' | 'AWB') => void;

export type PrevNextAwbType = 'PREV' | 'NEXT';

export type DockNextAwbStatusTypes = 'DOCK PROCESSED' | 'DOCKING';