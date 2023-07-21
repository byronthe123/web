export type RefundStatus = 'OPEN' | 'PREAPPROVED' | 'APPROVED' | 'DENIED' | 'CLOSED';

export interface IRefundRequest {
    id: number;
    s_mawb: string;
    s_hawb: string;
    f_amount: number;
    s_record: string;
    s_type: string;
    s_email: string;
    s_airport: string;
    s_reason: string;
    s_status: RefundStatus;
    b_approved: boolean;
    t_approved: Date | null;
    f_amount_approved: number;
    s_approver: string;
    t_created: Date;
    s_created_by: string;
    t_modified: Date;
    s_modified_by: string;
    s_notes: string;
    ic_length: number;
    s_final_approver: string;
    t_final_approved: Date | null;
}

export interface IUpdateRefundRequestData {
    id: number;
    s_mawb: string;
    s_hawb: string | null;
    s_status: string;
    b_approved: boolean;
    t_approved: Date | null;
    f_amount_approved: number;
    s_approver: string;
    s_modified_by: string;
    t_modified: Date;
    s_final_approver: string;
    t_final_approved: Date | null;
    s_notes: string;
}

export interface IManageRefundRequestData {
    id: number;
    s_final_approver: string; 
    b_approved: boolean; 
    s_status: RefundStatus;
    f_amount_approved: number;
    s_final_approval_notes: string;
}

export type RefundRequests = Array<IRefundRequest>

export interface IUpdateRefundRequest {
    (data: IUpdateRefundRequestData): Promise<void>
}

export interface IManageRefundRequest {
    (data: IManageRefundRequestData): Promise<void>
}

export interface IDeleteRefundRequest {
    (id: number, s_mawb: string, s_hawb: string): Promise<void>
}


