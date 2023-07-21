export default {
    payments: [
        {
            name: 'Date',
            value: 't_created',
            date: true 
        },
        {
            name: 'Type',
            value: 's_payment_method',
            importPaymentMethod: true,
            customWidth: 110
        },
        {
            name: 'Description',
            value: 's_payment_type'
        },
        {
            name: 'Created by',
            value: 's_created_by',
            email: true
        },
        {
            name: 'House',
            value: 's_hawb'
        },
        {
            name: 'Amount',
            value: 'f_amount',
            money: true
        }
    ],
    ffm: [
        {
            name: 'Selected',
            value: 'fas fa-circle',
            icon: true,
            showCondition: (item) => item.selected,
            function: () => {}
        },
        {
            name: 'Flight',
            value: 's_flight_id',
            customWidth: 180
        },
        {
            name: 'Weight',
            value: 'f_weight'
        },
        {
            name: 'Type',
            value: 's_pieces_type',
            smallWidth: true
        },
        {
            name: 'Actual PCS',
            value: 'i_actual_piece_count',
        },
        {
            name: 'Total Pieces',
            value: 'i_pieces_total'
        }
    ],
    fwb: [
        {
            name: 'Created',
            value: 't_created',
            date: true
        },
        {
            name: 'FLT',
            value: 's_flight_1'
        },
        {
            name: 'ARR',
            value: 'd_flight_1_schedule',
            date: true
        },
        {
            name: 'PCS',
            value: 'i_total_pieces'
        },
        {
            name: 'WGT',
            value: 'f_weight'
        },
    ],
    fhl: [
        {
            name: 'Created',
            value: 't_created',
            date: true
        },
        {
            name: 'HAWB',
            value: 's_hawb'
        },
        {
            name: 'PCS',
            value: 'i_pieces'
        },
        {
            name: 'WGT',
            value: 'f_mawb_weight'
        }
    ]
}