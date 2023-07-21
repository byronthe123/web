import dayjs from "dayjs";
import { ICompany } from "./interfaces";

export const defaultInitialValues = {
    s_trucking_company: '',
    s_trucking_driver: '',
    s_trucking_cell: '',
    s_trucking_email: '',
    s_driver_photo_link: '',
    t_kiosk_start: dayjs().format('MM/DD/YYYY HH:mm')
}

export const defaultCompany: ICompany = {
    s_transaction_id: '', 
    s_trucking_company: '', 
    s_trucking_driver: '', 
    s_counter_ownership_agent: '',
    t_kiosk_submitted: '',
    t_counter_ownership: '',
    s_status: 'WAITING',
    s_state: 'IMPORT',
    s_trucking_email: '',
    s_trucking_cell: '', 
    b_trucking_sms: false,
    s_driver_photo_link: '',
    awbs: [],
    importCount: 0,
    exportCount: 0,
    total: 0,
    processed: 0,
    firstWaitingCo: false
}

export const defaultQueueStat = {
    minWaitingTime: 0,
    aveWaitingTime: 0,
    maxWaitingTime: 0,
    transactionsProcessed: 0,
    unitMinProcessingTime: 0, 
    unitAveProcessingTime: 0, 
    unitMaxProcessingTime: 0, 
    unitAwbsProcessed: 0,
    userMinProcessingTime: 0, 
    userAveProcessingTime: 0, 
    userMaxProcessingTime: 0, 
    userAwbsProcessed: 0
}