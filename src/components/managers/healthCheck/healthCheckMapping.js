export default [
    {
        name: 'Unit',
        value: 's_unit',
        mediumWidth: true
    },
    {
        name: 'Employee #',
        value: 'i_employee_number',
        mediumWidth: true
    },
    {
        name: 'Name',
        value: 's_employee_name',
        largeWidth: true
    },
    {
        name: 'Date',
        value: 't_created',
        datetime: true,
        utc: true
    },
    {
        name: 'Fever/COVID-19 Symptoms',
        value: 'b_q1',
        boolean: true,
        smallWidth: true
    },
    {
        name: 'Contact w/Infected',
        value: 'b_q2',
        boolean: true,
        smallWidth: true
    },
    {
        name: 'Household diagnosed COVID-19',
        value: 'b_q3',
        boolean: true,
        smallWidth: true
    },
    {
        name: 'Traveled out of state/country',
        value: 'b_q4',
        boolean: true,
        smallWidth: true
    },
    {
        name: 'Passed Test',
        value: 'b_pass_test',
        boolean: true,
        smallWidth: true
    },
    {
        name: 'Location',
        value: 'address'
    },
]