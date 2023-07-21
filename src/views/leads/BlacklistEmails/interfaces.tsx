export interface IBlacklistEmail {
    id: number,
    s_email: string,
    s_reason: string,
    s_created_by: string,
    t_created: string,
    s_modified_by: string,
    t_modified: string
}

export interface IMap {
    [key: string]: any
}
