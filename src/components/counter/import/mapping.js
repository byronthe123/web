// export default [
//     's_transaction_id',
//     'd_last_arrival_date',
//     'd_last_arrival_date_auto',
//     'i_pieces',
//     'i_pieces_auto',
//     'f_weight',
//     'f_weight_auto',
//     's_hawb',
//     's_driver_name',
//     's_driver_id_type',
//     't_driver_id_expiration',
//     's_driver_id_number',
//     'b_driver_id_match_photo'
// ];

export default [
    's_unit', // app
    's_awb_type', // app
    's_status', // app
    's_mawb', // app
    's_hawb', // user input
    's_transaction_id',
    'i_pieces', // set in app / user input
    'i_pieces_auto', // set in app
    'f_weight', // set in app / user input
    'f_weight_auto', // set in app
    'd_last_arrival_date', // set in app / user input
    'f_charge_isc', // set in app
    'f_charge_isc_auto', // set in app
    'f_charge_storage', // set in app / user input calculated
    'f_charge_storage_auto', // set in app
    'f_charge_others', // !
    'f_charges_total', // app
    'f_paid_online', // Confirm if these are the only online payment types: ['CARGOSPRINT_CREDIT', 'CREDIT_CARD', 'ECHECK']
    'f_paid_online_auto', // need to ask Mozart about this
    'f_paid_check', // app
    'f_paid_cash', // app
    'f_paid_total', // app
    'b_cargo_located', // app
    's_customs_release', // user
    'f_balance_total', // app
    'f_balance_offset', // ! take override values (sum of all overrides)
    's_balance_approval_notes', // ! concatenate all s_notes for overrides separated by commas
    's_driver_name', // app, in selectedAwb.s_transaction_id useEffect, user can change
    's_driver_id_type', // user
    't_driver_id_expiration', // user
    's_driver_id_number', // user
    'b_driver_id_match_photo', // user
    's_driver_company', // app
    't_kiosk_submittedtime', // app
    's_counter_assigned_agent', // app
    't_counter_assigned_start', // app
    's_counter_by', // app 
    't_counter_start_time', // app, in selectedAwb useEffect
    't_counter_endtime', // app, submit
    't_created', // app
    's_created_by', // app
    't_modified', // app
    's_modified_by', // app
    's_notes', // user
    'b_counter_reject', // app
    's_counter_reject_agent', // app
    't_counter_reject_time', // app
    's_counter_reject_reason', // user
    'b_user_modified_auto', // app
    'd_last_arrival_date_auto', // app
    's_mawb_id', // app
];