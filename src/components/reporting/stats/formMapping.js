import moment from 'moment';

export default [
    {
        key: 's_airline_code'
    },
    {
        key: 's_flight_number'
    },
    {
        key: 'd_flight',
        defaultValue: moment().format('YYYY-MM-DD')
    },
    {
        key: 'b_nil',
        defaultValue: false
    },
    {
        key: 'b_cancelled',
        defaultValue: false
    },
    {
        key: 'i_awb',
        defaultValue: 0
    },
    {
        key: 'i_pieces',
        defaultValue: 0
    },
    {
        key: 'i_awb_dg',
        defaultValue: 0
    },
    {
        key: 'i_ld3',
        defaultValue: 0
    },
    {
        key: 'i_ld3_bup',
        defaultValue: 0
    },
    {
        key: 'i_ld7',
        defaultValue: 0
    },
    {
        key: 'i_ld7_bup',
        defaultValue: 0
    },
    {
        key: 'f_total_kg',
        defaultValue: 0
    },
    {
        key: 'f_bup_kg',
        defaultValue: 0
    },
    {
        key: 'f_loose_kg',
        defaultValue: 0
    },
    {
        key: 'f_mail_kg',
        defaultValue: 0
    },
    {
        key: 'f_flight_kg',
        defaultValue: 0
    },
    {
        key: 'f_awb_transfer',
        defaultValue: 0
    },
    {
        key: 'f_transfer_kg',
        defaultValue: 0
    },
    {
        key: 'f_courier_kg',
        defaultValue: 0
    },
    {
        key: 's_notes'
    },
    // Export Only:
    {
        key: 'i_awb_prepare',
        defaultValue: 0
    },
    {
        key: 'f_tsa_kg',
        defaultValue: 0
    },
    // Ramp only:
    {
        key: 's_aircraft_type'
    },
    {
        key: 'f_aircraft_handling',
        defaultValue: 0
    },
    {
        key: 'f_aircraft_parking',
        defaultValue: 0
    },
    {
        key: 'f_drayage',
        defaultValue: 0
    },
    {
        key: 'i_lavatory',
        defaultValue: 0
    },
    {
        key: 'i_water',
        defaultValue: 0
    },
    {
        key: 'i_cabin_cleaning',
        defaultValue: 0
    },
    {
        key: 'i_waste_removal',
        defaultValue: 0
    },
    {
        key: 'f_flight_watch',
        defaultValue: 0
    },
    {
        key: 'f_gpu',
        defaultValue: 0
    },
    {
        key: 'f_asu',
        defaultValue: 0
    },
    {
        key: 'f_deicing',
        defaultValue: 0
    },
    {
        key: 'f_weight_balance',
        defaultValue: 0
    },
    {
        key: 'f_customs',
        defaultValue: 0
    },
    {
        key: 'f_gen_dec',
        defaultValue: 0
    },
    {
        key: 'f_crew_transport',
        defaultValue: 0
    },
    // Misc only:
    {
        key: 's_type'
    },
    {
        key: 'f_misc',
        defaultValue: 0
    },
    {
        key: 's_misc_type'
    },
    {
        key: 's_misc_uom',
        defaultValue: 'USD'
    },
    // other
    {
        key: 's_activity'
    },
    // front-end lb values:
    {
        key: 'f_total_lb'
    },
    {
        key: 'f_bup_lb'
    },
    {
        key: 'f_loose_lb'
    },
    {
        key: 'f_mail_lb'
    },
    {
        key: 'f_flight_lb'
    },
    {
        key: 'f_courier_lb'
    },
    // front-end lb values Export only:
    {
        key: 'f_awb_transfer_lb'
    },
    {
        key: 'f_transfer_lb'
    },
    {
        key: 's_status'
    }
];