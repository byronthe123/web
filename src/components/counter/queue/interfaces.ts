import { IQueue, QueueStatus, QueueState, IMap, ISelectOption } from "../../../globals/interfaces";

export interface ICompany {
    s_transaction_id: string; 
    s_trucking_company: string; 
    s_trucking_driver: string; 
    s_counter_ownership_agent: string;
    t_kiosk_submitted: string;
    t_counter_ownership: string;
    s_status: QueueStatus;
    s_state: QueueState;
    s_trucking_email: string;
    s_trucking_cell: string; 
    b_trucking_sms: boolean;
    s_driver_photo_link: string | null;
    awbs: Array<IQueue>;
    importCount: number;
    exportCount: number;
    total: number;
    processed: number;
    firstWaitingCo: boolean
}

export type SelectedTypeOptions = 'ALL' | 'IMPORT' | 'EXPORT'| 'TRANSFERS';

export type ProcessingAgentsMap = IMap<boolean>

export interface IExtendedSelectOption extends ISelectOption {
    busy: boolean
}

export interface IQueueStats {
    minWaitingTime: number;
    aveWaitingTime: number;
    maxWaitingTime: number;
    transactionsProcessed: number;
    unitMinProcessingTime: number; 
    unitAveProcessingTime: number; 
    unitMaxProcessingTime: number; 
    unitAwbsProcessed: number;
    userMinProcessingTime: number; 
    userAveProcessingTime: number; 
    userMaxProcessingTime: number; 
    userAwbsProcessed: number;
}