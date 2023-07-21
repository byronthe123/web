export interface IMap<T> {
    [key: string]: T;
    [key: number]: T;
}

export interface IUser {
    id: number;
    displayName: string;
    s_email: string;
    i_access_level: number;
    s_unit: string;
    accessMap: SidebarMap;
    b_airline: boolean;
    s_airline_codes: Array<string>;
    s_guid: string;
    pinCreated: boolean;
    localAccountId: string;
    s_phone_num: string;
    sharedVaultAccess: boolean;
    resetPassword?: boolean;
}

export interface IActiveUser {
    displayName: string;
    s_email: string;
    s_unit: string;
    path: string;
    online: boolean;
    status: string;
}

export type IActiverUsers = IMap<IActiveUser>;

export interface IRack {
    id: number;
    t_created: Date | string;
    s_created_by: string;
    t_modified: Date | string;
    s_modified_by: string;
    s_status: string;
    s_unit: string;
    s_location: string;
    s_mawb: string;
    s_hawb: string;
    i_pieces: number | string;
    s_airline: string;
    s_airline_code: string;
    i_airline_prefix: number;
    s_shc1: string;
    s_shc2: string;
    s_shc3: string;
    s_shc4: string;
    s_shc5: string;
    s_special_hanlding_code: string;
    s_notes: string;
    s_priority: string;
    t_delivered: Date | string;
    s_delivered_by: string;
    s_delivered_notes: string;
    t_delivered_notes: Date | string;
    s_guid: string;
    f_latitude: number;
    f_longitude: number;
    s_gps: string;
    d_flight: Date | string;
    s_flightnumber: string;
    s_flight_uld: string;
    s_tower: string;
    s_level: string;
    s_position: string;
    b_processed: boolean;
    t_processed: Date | string;
    s_processed_agent: string;
    b_delivered: boolean;
    s_delivered_agent: string;
    s_flight_id: string;
    s_platform: string;
    b_disabled: boolean;
    b_hold: boolean;
    b_breakdown_hawb: boolean;
    b_usda_hold: boolean;
    b_customs_hold: boolean;
    b_comat: boolean;
    b_general_order: boolean;
    s_destination: string;
    s_delivered_transaction_id: string;
}

export type QueueStatus =
    | 'WAITING'
    | 'DOCUMENTING'
    | 'DOCUMENTED'
    | 'REJECTED'
    | 'DOCKING'
    | 'DOCK COMPLETED'
    | 'LEFT EARLY';

export type QueueState =
    | 'IMPORT'
    | 'EXPORT'
    | 'MIXED'
    | 'TRANSFER-IMPORT'
    | 'REJECTED';

export interface IQueue {
    id: number;
    t_created: string;
    s_created_by: string;
    t_modified: string;
    s_modified_by: string;
    s_unit: string;
    s_transaction_id: string;
    s_type: string;
    s_priority: string;
    s_state: QueueState;
    s_status: QueueStatus;
    s_mawb: string;
    s_mawb_id: string;
    s_airline: string;
    s_airline_code: string;
    s_trucking_company: string;
    s_trucking_driver: string;
    s_trucking_cell: string;
    b_trucking_sms: boolean;
    s_trucking_email: string;
    s_trucking_language: string;
    t_kiosk_start: string;
    t_kiosk_submitted: string;
    s_counter_ownership_agent: string;
    t_counter_ownership: string;
    t_counter_start: string;
    t_counter_end: string;
    s_abandoned_agent: string;
    t_abandoned: string;
    s_restored_agent: string;
    t_restored: string;
    s_restored_reason: string;
    s_notes: string;
    ic_counter_time_waited: string;
    ic_counter_time_processed: string;
    b_counter_reject: string;
    s_counter_reject_agent: string;
    t_counter_reject_time: string;
    s_counter_reject_reason: string;
    b_isc_paid: string;
    t_dock_door: string;
    s_dock_door_assigned: string;
    s_dock_ownership: string;
    t_dock_ownership: string;
    s_hawb: string;
    s_dock_door_guid: string;
    s_warehouse_productivity_guid: string;
    b_dock_reject: string;
    s_dock_reject_reason: string;
    s_dock_door: string;
    sm_driver_photo: string;
    t_dock_complete: string;
    s_dock_agent_completed: string;
    ic_total_engagement_time: string;
    i_feedbackscore: string;
    s_driver_photo_link: string;
    ic_warehouse_wait: string;
    sc_warehouse_ownership_username: string;
    s_logo?: string;
}

export interface IIMport {
    t_created: string;
    s_status: string;
    s_hawb: string;
    i_pieces: number;
    i_pcs_delivered: number;
    f_weight: number;
    s_created_by: string;
    s_driver_company: string;
    f_charges_total: number;
    f_balance_offset: number;
    f_paid_total: number;
}

export interface IFFM {
    id: number;
    s_parser_guid: string;
    s_message_type: string;
    i_unique: number;
    i_message_sequence: number;
    b_message_complete: boolean;
    b_has_continuation: boolean;
    s_flight_number: string;
    d_arrival_date: Date;
    t_scheduled_time: string;
    s_pol: string;
    s_pou: string;
    s_aircraft_registration: string;
    t_actual_arrival: Date;
    s_flight_id: string;
    s_uld: string;
    s_uld_type: string;
    s_uld_number: string;
    s_uld_code: string;
    s_uld_remarks: string;
    s_uld_loading_indicator: string;
    s_mawb: string;
    s_origin: string;
    s_destination: string;
    s_pieces_type: string;
    i_actual_piece_count: number;
    f_weight: number;
    s_weight_type: string;
    i_pieces_total: number;
    s_volume: string;
    s_volume_unit: string;
    i_total_consignment_pieces: number;
    s_commodity: string;
    s_special_handling_code: string;
    s_movement_priority: string;
    s_customs_origin_code: string;
    s_onward_routing_booking_carrier_code: string;
    s_onward_routing_booking_destination: string;
    s_onward_routing_booking_flight_number: string;
    d_onward_routing_booking_Date_departure: Date;
    s_other_service_information: string;
    t_created: Date;
    s_created_by: string;
    t_modified: Date;
    s_modified_by: string;
    s_status: string;
    d_storage_first_free: Date;
    d_storage_second_free: Date;
    d_storage_third_free: Date;
    d_storage_start: Date;
    s_arrived_weekday: string;
    i_arrived_Date: number;
    i_arrived_year: number;
    i_arrived_month: number;
    s_arrived_month: string;
    i_arrived_week: number;
    s_guid: string;
    s_airline_code: string;
    s_notes: string;
    b_customs_hold: boolean;
    b_usda_hold: boolean;
    b_hold: boolean;
    b_breakdown_hawb: boolean;
    s_flight_serial: string;
}

export interface IULD {
    id: number;
    i_unique: number;
    s_flight_id: string;
    s_status: string;
    s_airline_code: string;
    s_flight_number: string;
    s_flight_serial: string;
    d_arrival_date: Date;
    s_origin: string;
    s_destination: string;
    f_weight: number;
    s_weight_type: string;
    i_pieces_total: number;
    s_volume: string;
    s_uld: string;
    s_uld_type: string;
    s_uld_number: string;
    s_uld_code: string;
    s_message_type: string;
    t_created: Date;
    s_created_by: string;
    s_modified_by: string;
    t_modified: Date;
    s_notes: string;
    s_pol: string;
    s_pou: string;
    s_user_accepted_uld: string;
    t_user_accepted_uld: Date;
    s_user_opened_uld: string;
    t_user_opened_uld: Date;
    s_user_closed_uld: string;
    t_user_closed_uld: Date;
    s_shc: string;
    b_accepted: boolean;
    b_opened: boolean;
    b_closed: boolean;
    s_unit: string;
    s_platform: string;
    b_offloaded: boolean;
    b_message_complete: boolean;
    s_parser_guid: string;
    s_guid: string;
}

export interface IFHL {
    id: number;
    s_guid: string;
    s_parser_guid: string;
    s_type: string;
    t_created: Date;
    s_created_by: string;
    t_modified: Date;
    s_modified_by: string;
    s_mawb: string;
    s_mawb_origin: string;
    s_mawb_destination: string;
    s_mawb_quantity_code: string;
    i_mawb_pieces: number;
    f_mawb_weight: number;
    s_mawb_weight_unit: string;
    s_hawb: string;
    s_origin: string;
    s_destination: string;
    i_pieces: number;
    f_weight: number;
    s_weight_unit: string;
    s_nature_of_goods: string;
    s_special_handling_codes: string;
    s_free_text_description_of_goods: string;
    s_shipper_address_name1: string;
    s_shipper_street_address1: string;
    s_shipper_place: string;
    s_shipper_state_province: string;
    s_shipper_country: string;
    s_shipper_postcode: string;
    s_shipper_contact_id: string;
    s_shipper_contact_number: string;
    s_consignee_address_name1: string;
    s_consignee_street_address1: string;
    s_consignee_place: string;
    s_consignee_state_province: string;
    s_consignee_country: string;
    s_consignee_postcode: string;
    s_consignee_contact_id: string;
    s_consignee_contact_number: string;
    s_iso_currency_code: string;
    s_payment_weight_valuation: string;
    s_payment_other_charges: string;
    i_shippers_load_and_count: number;
    s_edi: string;
}

export interface IFWB {
    id: number;
    s_type: string;
    s_parser_guid: string;
    s_guid: string;
    s_mawb: string;
    s_origin: string;
    s_destination: string;
    i_total_pieces: number;
    f_weight: number;
    s_weight_unit: string;
    s_flight_1: string;
    d_flight_1_schedule: Date;
    s_flight_2: string;
    d_flight_2_schedule: Date;
    s_route_carrier_code_1: string;
    s_route_destination_1: string;
    s_route_carrier_code_2: string;
    s_route_destination_2: string;
    s_route_carrier_code_3: string;
    s_route_destination_3: string;
    s_shipper_account_number: string;
    s_shipper_name1: string;
    s_shipper_streetaddress1: string;
    s_shipper_place: string;
    s_shipper_state_province: string;
    s_shipper_country: string;
    s_shipper_postcode: string;
    s_shipper_contact_id: string;
    s_shipper_contact_number: string;
    s_consignee_name1: string;
    s_consignee_streetaddress1: string;
    s_consignee_place: string;
    s_consignee_state_province: string;
    s_consignee_country: string;
    s_consignee_postcode: string;
    s_consignee_contact_id: string;
    s_consignee_contact_number: string;
    d_carriers_execution: Date;
    s_carriers_execution_airport: string;
    s_carriers_execution_authorisation_signature: string;
    s_office_message_address_airport_city_code: string;
    s_office_message_address_office_function_designator: string;
    s_office_message_address_company_designator: string;
    s_iso_currency_code: string;
    s_charge_code: string;
    s_payment_weight_valuation: string;
    s_payment_other_charges: string;
    s_agent_name: string;
    s_agent_place: string;
    s_agent_account_number: string;
    s_agent_iata_cargo_agent_numeric_code: string;
    s_agent_iata_cargo_agent_cass_address: string;
    s_agent_participant_identifier: string;
    s_agent_special_service_request: string;
    f_total_weight_charge: number;
    f_valuation_charge: number;
    f_taxes: number;
    f_total_other_charges_due_agent: number;
    f_total_other_charges_due_carrier: number;
    f_charge_summary_total: number;
    s_special_handling_codes: string;
    s_other_service_information: string;
    s_customs_origin_code: string;
    s_goods_description: string;
    b_consolidation: boolean;
    t_created: Date;
    s_created_by: string;
    t_modified: Date;
    s_modified_by: string;
    s_edi: string;
}

// type IPositionProps = {
//     allowDuplicates: boolean
// }

// type Position = IMap<IPositionProps>

type IPositionProps = {
    allowDuplicates: boolean;
};
type Position = IMap<IPositionProps>;
type Level = IMap<Position>;
type Tower = IMap<Level>;

type ISpecialLocationProps = {};
type ISpecialLocation = IMap<ISpecialLocationProps>;

export interface IUnitRack {
    _id: string;
    unit: string;
    createdBy: string;
    modifiedBy: string;
    createdAt: Date;
    updatedAt: Date;
    schema: IMap<Tower>;
    specialLocations: IMap<ISpecialLocation>;
}

export interface ISelectOption {
    label: string;
    value: string | number;
}

export interface IReactTableMappingProps {
    name: string;
    value: string;
    button?: boolean;
    date?: boolean;
    datetime?: boolean;
    utc?: boolean;
    boolean?: boolean;
    function?: (props?: any) => any;
}

export type CreateSuccessNotification = (
    message: string,
    type?: 'success' | 'warning' | 'danger'
) => void;

export interface IFile {
    base64: string;
    type: string;
    name?: string;
}

export interface IPayment {
    i_id: number;
    s_cs_id: string;
    s_awb: string;
    s_hawb: string;
    f_amount: number;
    f_profit_share: number;
    s_payment_type: string;
    s_notification_email: string;
    f_invoice_amount: number;
    f_credit_card_fee: number;
    f_isc_fee: number;
    s_payment_method: string;
    s_name: string;
    s_origin: string;
    s_destination: string;
    s_created_by: string;
    t_created: Date;
    s_modified_by: string;
    t_modified: Date;
    s_notes: string;
    b_processed: boolean;
    t_processed: string;
    s_processed_by: string;
    b_override_approved: boolean;
    s_override_approver: string;
    t_override_approved: string;
    s_status: string;
    i_pieces: number;
    f_weight: number;
    selected?: boolean;
}

export interface IStep {
    id: string;
    name: string;
    desc: string;
    isDone: boolean;
    disabled: boolean;
}

export type PushStep = (id: string) => void;

export type GoToNextStep = () => void;

export interface IWizardProps {
    step: IStep;
    steps: Array<IStep>;
    push: PushStep;
    next: GoToNextStep;
    previous: GoToNextStep;
}

export type SearchAwb = (e: any, overrideSearch: string) => Promise<void>;

interface IGraphDonutDataSet {
    label: string;
    borderColor: [string, string];
    backgroundColor: [string, string];
    borderWidth: number;
    data: [number, number];
}

export interface IGraphDonutData {
    labels: [string, string];
    datasets: Array<IGraphDonutDataSet>;
}

export interface SidebarItem {
    id: string;
    icon: string;
    label: string;
    to: string;
    subs: IMap<SidebarItem>;
    manager?: boolean;
    restricted?: boolean;
    selected?: boolean;
    component?: any;
    access?: boolean;
}

export type SidebarMap = IMap<SidebarItem>;

export interface ICorpStation {
    id: number;
    s_unit: string;
    s_address: string;
    s_phone: string;
    s_firms_code: string;
    s_weekday_hours: string;
    s_weekend_hours: string;
    s_airport: string;
    i_add_first_free_day: number;
    i_add_second_free_day: number;
}

export interface IEmployee {
    id: number;
    s_email: string;
    s_unit: string;
    i_employee_number: number;
    s_first_name: string;
    s_last_name: string;
    s_job_title: string;
    s_department: string;
    s_phone_num: string;
    s_status: string;
    t_created: string;
    s_created_by: string;
    t_modified: string;
    s_modified_by: string;
    i_access_level: number;
    b_internal: boolean;
    b_airline: boolean;
    s_airline_codes: string;
    s_work_type: string;
    d_hire: string;
    s_ip_subnet: string;
}

export interface ICbpAceCode {
    id: number;
    s_code: string;
    b_customs_hold: boolean;
    b_general_order: boolean;
    b_usda_hold: boolean;
    b_hold: boolean;
    s_description: string;
    s_reason: string;
    s_created_by: string;
    t_created: string;
    s_modified_by: string;
    t_modified: string;
}

export interface IFSN {
    id: number;
    t_created: string;
    s_created_by: string;
    s_mawb: string;
    s_hawb: string;
    s_location: string;
    s_arr: string;
    s_csn: string;
    s_csn_code: string;
    s_edi: string;
}

export interface IFsnLocationCode {
    id: number;
    s_code: string;
    i_airline_mapping_detail_id: number;
    s_status: string;
    s_created_by: string;
    t_created: string;
    s_modified_by: string;
    t_modified: string;
}

export interface IAirlineMappingDetail {
    id: number;
    i_airline_id: number;
    s_unit: string;
    s_status: string;
    f_import_isc_cost: number;
    f_import_per_kg: number;
    f_import_min_charge: number;
    s_import_distribution_email: string;
    s_firms_code: string;
    i_import_sla_cao_breakdown_min: number;
    i_import_sla_pax_breakdown_min: number;
    i_export_sla_cao_cut_off_min: number;
    i_export_sla_pax_cut_off_min: number;
    i_export_sla_cao_uws_min: number;
    i_export_pax_uws_min: number;
    t_created: string;
    s_created_by: string;
    t_modified: string;
    s_modified_by: string;
    f_import_isc_cost_previous: number;
    d_switch: string;
    f_import_per_kg_previous: number;
    f_import_min_charge_previous: number;
    i_add_first_free_day: number;
    i_add_second_free_day: number;
    s_airline_code?: string;
    s_airline_name?: string;
}

export interface IExport {
    i_id: number;
    s_unit: string;
    s_awb_type: string;
    s_status: string;
    s_mawb: string;
    s_priority: string;
    s_airline: string;
    s_airline_code: string;
    s_flight_number: string;
    t_depart_string: string;
    s_origin: string;
    s_destination: string;
    i_weight: number;
    i_pieces: number;
    s_transport_type: string;
    s_iac: string;
    t_flight_depart: string;
    s_port_of_unlading: string;
    s_commodity: string;
    s_shc1: string;
    s_shc2: string;
    s_shc3: string;
    s_shc4: string;
    s_shc5: string;
    b_dg: boolean;
    b_screened: boolean;
    s_ccsf: string;
    s_non_iac: string;
    s_language: string;
    b_sms_enabled: boolean;
    s_sms: string;
    s_company: string;
    s_company_driver_name: string;
    s_company_driver_id_type_1: string;
    s_company_driver_id_num_1: string;
    d_company_driver_id_expiration_1: string;
    b_company_driver_photo_match_1: boolean;
    s_company_driver_id_type_2: string;
    s_company_driver_id_num_2: string;
    d_company_driver_id_expiration_2: string;
    b_company_driver_photo_match_2: boolean;
    b_counter_reject: boolean;
    s_counter_reject_agent: string;
    t_counter_reject_time: string;
    s_counter_reject_reason: string;
    s_kiosk_submitted_agent: string;
    t_kiosk_submittedstring: string;
    s_counter_assigned_agent: string;
    t_counter_assigned_start: string;
    s_counter_by: string;
    t_counter_start_time: string;
    t_counter_endtime: string;
    i_counter_length: number;
    i_dock_wait: number;
    t_dock_start: string;
    t_dock_end: string;
    i_dock_length: number;
    i_dock_door: number;
    s_dock_assignor: string;
    s_dock_assignee: string;
    i_dock_accepted_pieces: number;
    i_scale_weight: number;
    i_discrepancy_weight: number;
    t_dock_assigned_door_time: string;
    b_dock_reject: boolean;
    s_dock_reject_reason: string;
    t_dock_reject_time: string;
    i_screening_wait: number;
    t_screening_start_time: string;
    t_screening_end_time: string;
    i_screening_length: number;
    s_screening_agent: string;
    s_screening_result: string;
    t_screening_alarm_start: string;
    t_screening_alarm_end: string;
    s_screening_notes: string;
    t_created: string;
    s_created_by: string;
    t_modified: string;
    s_modified_by: string;
    s_transaction_id: string;
    s_mawb_id: string;
    s_notes: string;
    b_numbererline_transfer: boolean;
    s_numbererline_transfer: string;
}

export interface ISpecialHandlingCode {
    id: number;
    s_special_handling_code: string;
    s_description: string;
    b_requires_refrigeration: boolean;
    b_dg: boolean;
    s_dg_class: string;
    s_example: string;
    s_detail: string;
    b_cargo_only: boolean;
    s_emergency_action: string;
    s_created_by: string;
    t_created: string;
    s_modified_by: string;
    t_modified: string;
}

export interface ILog {
    id: number;
    s_created_by: string;
    t_created: string;
    s_priority: string;
    s_mawb: string;
    s_hawb: string;
    s_notes: string;
    s_page: string;
    s_procedure: string;
}

export interface ICharge {
    id: number;
    i_corp_station_id: number;
    s_name: string;
    f_multiplier: number;
    s_uom: string;
    s_created_by: string;
    t_created: string;
    s_modified_by: string;
    t_modified: string;
    s_unit?: string;
}

export type MenuAppType = 'SYSTEM' | 'USER';

export interface IMenuApp {
    id: number;
    title: string;
    link: string;
    logoUrl: string;
    indexNum: string;
    type: MenuAppType;
    createdBy: string;
    createdAt: string;
    modifiedBy: string;
    modifiedAt: string;
}

export interface IMenuApps {
    system: Array<IMenuApp>;
    user: Array<IMenuApp>;
}

export interface IVisualReporting {
    id: number;
    user_submitted: string;
    awb_uld: string;
    comments: string;
    time_submitted: string;
    file_name: string;
    file_link: string;
    collection_id: string;
    full_name: string;
    unit: string;
}

export interface IFlightSchedule {
    id: number;
    s_unit: string;
    s_status: string;
    s_flight_type: string;
    s_airline_name: string;
    s_airline_code: string;
    s_flight_number: string;
    s_aircraft: string;
    s_aircraft_type: string;
    s_origin_airport: string;
    t_estimated_departure: Date;
    t_actual_departure: Date;
    t_cut_off_time: Date;
    t_uws_time: Date;
    s_destination_airport: string;
    t_estimated_arrival: Date;
    t_actual_arrival: Date;
    t_sla_breakdown: Date;
    s_notes: string;
    s_created_by: string;
    t_created: Date;
    s_modified_by: string;
    t_modified: Date;
    s_flight_id: string;
    f_aircraft_capacity: number;
}

export interface INotification {
    id: number;
    t_created: Date;
    s_created_by: string;
    t_modified: Date;
    s_modified_by: string;
    s_unit: string;
    s_mawb: string;
    s_airline: string;
    s_airline_code: string;
    i_airline_prefix: number;
    s_notes: string;
    s_notification_type: string;
    s_number_called: string;
    s_caller: string;
    s_emails_to: string;
    s_emails_from: string;
    s_email_message: string;
    s_flight_id: string;
    s_company_guid: string;
    s_emails_to_cc: string;
    i_payment_quantity: number;
    i_company_record: number;
    b_manual: number;
}

export interface IIac {
    id: number;
    approval_number: string;
    indirect_carrier_name: string;
    city: string;
    state: string;
    postal_code: string;
    expiration_date: Date | string;
    IACSSP_08_001: string;
    valid: boolean;
    s_created_by: string;
    t_created: Date | string;
    s_modified_by: string;
    t_modified: Date | string;
}

export interface ICcsf {
    id: number;
    approval_number: string;
    certified_cargo_screening_facility_name: string;
    street_address: string;
    city: string;
    state: string;
    ccsf_expiration_date: string;
    iac_number: string;
    valid: boolean;
    s_created_by: string;
    t_created: Date | string;
    s_modified_by: string;
    t_modified: Date | string;
}

export interface IAirport {
    id: number;
    code: string;
    icao: string;
    name: string;
    countryCode: string;
    country: string;
    cityCode: string;
    city: string;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date;
}

export interface IBlobFile {
    id: number;
    s_transaction_id: string;
    s_mawb_id: string;
    s_file_name: string;
    s_container: string;
    s_type: string;
    s_created_by: string;
    t_created: Date;
    s_file_type: string;
    accessLink?: string;
}

export interface IEmployeeFile extends IBlobFile {
    employee_id: number;
    file_id: number;
    expiration_date: Date;
    reminder_date: Date;
    category: HrFileCategory;
}

export type HrFileCategory = 'ID' | 'FORM';

export const hrFileCategories: Array<HrFileCategory> = ['FORM', 'ID'];

export interface IHrFile {
    id: number;
    name: string;
    expires: boolean;
    expirationReminder: number;
    category: HrFileCategory;
    createdBy: string;
    created: Date;
    modifiedBy: string;
    modified: Date;
}

export interface IAccessLevel {
    id: number;
    i_access_level: number;
    s_name: string;
    s_created_by: string;
    t_created: Date;
    s_modified_by: string;
    t_modified: Date;
}

export interface IEmployeeLog {
    id: number;
    employee_id: number;
    changes: string;
    created: Date;
    createdBy: string;
}

export interface IUserPassword {
    id: number;
    userId: string;
    username: string;
    name: string;
    password: string;
    link: string;
    notes: string;
    created: Date;
    createdBy: string;
    modified: Date;
    modifiedBy: string;
    guid: string;
}

export interface IAssignedPassword {
    id: number;
    email: string;
    passwordGuid: string;
    created: string;
    createdBy: Date;
}

export interface IChangeLog {
    id: number;
    version: string;
    date: Date;
    type: string;
    title: string;
    detail: string;
    url: string;
    created: Date | string;
    createdBy: string;
}

export interface ITaskItem {
    id: number;
    title: string;
    description: string;
    changedDate: string;
    boardColumn: string;
    workItemType: string;
    assignedTo: string;
    project: string;
}

export type MediaDevice = {
    kind: string;
    deviceId: string;
    // Add other properties here if needed
};

export type SetFieldValue = (field: string, value: any) => void;
export type FormEvent = React.FormEvent<HTMLFormElement>;

export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
