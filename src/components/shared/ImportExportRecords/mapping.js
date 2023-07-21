export const importMapping = [
    {
        name: 'ID',
        value: 'i_id',
        customWidth: 100
    },
    {
        name: 'AWB',
        value: 's_mawb',
        s_mawb: true
    },
    {
        name: 'HAWB',
        value: 's_hawb'
    },
    {
        name: 'Transfer',
        // value: 's_hawb',
        boolean: true,
        showCondition: item => item.s_awb_type.includes('TRANSFER')
    },
    {
        name: 'Last Status',
        value: 's_status',
        customWidth: 125 
    },
    {
        name: 'Company',
        value: 's_driver_company',
        customWidth: 500
    },
    {
        name: 'Driver',
        value: 's_driver_name'
    },
    {
        name: 'Created',
        value: 't_created',
        datetime: true,
        utc: true
    }
]

export const exportMapping = [
    {
        name: 'ID',
        value: 'i_id',
        customWidth: 100
    },
    {
        name: 'AWB',
        value: 's_mawb',
        s_mawb: true
    },
    {
        name: 'Last Status',
        value: 's_status',
        customWidth: 125 
    },
    {
        name: 'Company',
        value: 's_company',
        customWidth: 500
    },
    {
        name: 'Driver',
        value: 's_company_driver_name'
    },
    {
        name: 'Created',
        value: 't_created',
        datetime: true,
        utc: true
    }
]