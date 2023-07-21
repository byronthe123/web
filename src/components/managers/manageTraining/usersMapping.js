export default [
    {
        name: 'Selected',
        value: 'far fa-check-circle',
        icon: true,
        showCondition: (user) => user.selected
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
        name: 'Email',
        value: 's_email'
    },
    {
        name: 'Unit',
        value: 's_unit'
    },
    {
        name: 'Department',
        value: 's_department'
    },
    {
        name: 'Currently Assigned',
        value: 'alreadyAssigned',
        boolean: true
    }
]