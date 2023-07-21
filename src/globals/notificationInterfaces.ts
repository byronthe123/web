export interface INotificationName {
    id: number;
    t_created: string;
    s_created_by: string;
    t_modified: string;
    s_modified_by: string;
    s_unit: string;
    s_guid: string;
    s_name: string;
    i_record: number;
}

export interface INotificationEmail {
    id: number;
    t_created: string;
    s_created_by: string;
    t_modified: string;
    s_modified_by: string;
    s_unit: string;
    s_guid: string;
    s_email: string;
    i_record: number;
}

export interface INotificationPhone {
    id: number;
    t_created: string;
    s_created_by: string;
    t_modified: string;
    s_modified_by: string;
    s_unit: string;
    s_guid: string;
    s_phone: string;
    i_record: number;
}