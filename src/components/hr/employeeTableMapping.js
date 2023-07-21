export default [
    {
        name: 'Unit',
        value: 's_unit' 
    },
    {
        name: 'Employee #',
        value: 'i_employee_number' 
    },
    {
        name: 'Email',
        value: 's_email' 
    },
    {
        name: 'First Name',
        value: 's_first_name' 
    },
    {
        name: 'Last Name',
        value: 's_last_name' 
    },
    {
        name: 'Date of Hire',
        value: 'd_hire',
        utc: true 
    },
    {
        name: 'Status',
        value: 's_status' 
    }, 
    {
        name: 'Work Type',
        value: 's_work_type' 
    }, 
    {
        name: 'Level Name',
        nested: true,
        value: 'AccessLevel',
        subvalue: 's_name'
    }
];