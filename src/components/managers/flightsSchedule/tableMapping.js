export const tableMapping = [
    {
        value: 'id',
        name: 'ID',
        exclude: true
    },
    {
        value: 's_unit',
        name: 'Unit'
    },
    {
        value: 's_status',
        name: 'Status'
    },
    {
        value: 's_flight_type',
        name: 'Flight Type'
    },
    {
        value: 's_airline_name',
        name: 'Name',
        exclude: true
    },
    {
        value: 's_airline_code',
        name: 'Code',
        smallWidth: true
    },
    {
        value: 's_flight_number',
        name: 'FLT Number',
        mediumWidth: true
    },
    {
        value: 's_aircraft',
        name: 'Aircraft',
        mediumWidth: true
    }, 
    {
        value: 's_aircraft_type',
        name: 'Type',
        smallWidth: true
    },
    {
        value: 's_origin_airport',
        name: 'Origin',
        smallWidth: true
    },
    {
        value: 's_destination_airport',
        name: 'Dest.',
        smallWidth: true
    },
    {
        value: 't_estimated_departure',
        name: 'EST Dept.',
        datetime: true,
        utc: true
    },
    {
        value: 't_estimated_arrival',
        name: 'EST Arrival',
        datetime: true,
        utc: true
    },
    {
        value: 't_actual_departure',
        name: 'Actual Dept.',
        datetime: true,
        utc: true
    },
    {
        value: 't_actual_arrival',
        name: 'Actual Arrival',
        datetime: true,
        utc: true
    },
    {
        value: 't_cut_off_time',
        name: 'Cut-off datetime',
        datetime: true,
        exclude: true
    },
    {
        value: 't_uws_time',
        name: 'UWS datetime',
        datetime: true,
        exclude: true
    },
    {
        value: 't_sla_breakdown',
        name: 'SLA Breakdown',
        datetime: true,
        exclude: true
    },
    {
        value: 's_notes',
        name: 'Notes',
        mediumWidth: true
    },
    // {
    //     value: 's_created_by',
    //     name: 'Created'
    // },
    // {
    //     value: 't_created',
    //     name: 'Created By'
    // },
    // {
    //     value: 's_modified_by',
    //     name: 'Modified'
    // },
    // {
    //     value: 't_modified',
    //     name: 'Modified By'
    // },
];