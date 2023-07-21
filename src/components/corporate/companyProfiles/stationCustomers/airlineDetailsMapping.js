export default [
    {
        name: 'Status',
        value: 's_status'
    },
    {
        name: 'Logo',
        value: 'AirlineDatum',
        subvalue: 's_logo',
        nested: true,
        image: true,
        imageWidth: '200px'
    },
    {
        name: 'Code',
        value: 'AirlineDatum',
        subvalue: 's_airline_code',
        nested: true,
        smallWidth: true
    },
    {
        name: 'Airline',
        value: 'AirlineDatum',
        subvalue: 's_airline_name',
        nested: true
    },
    {
        name: 'Prefix',
        value: 'AirlineDatum',
        subvalue: 's_airline_prefix',
        nested: true,
        smallWidth: true
    },
    {
        name: 'ISC',
        value: 'f_import_isc_cost',
        money: true
    },
    {
        name: 'Updated on',
        value: 't_modified',
        datetime: true,
        utc: true
    }
]