export const tablesMap = {
    ffm: {
        s_table: 'ffm',
        fieldsMapping: [
            {
                value: 't_created',
                name: 'Received',
                datetime: true
            },
            {
                value: 's_uld',
                name: 'ULD',
            },
            {
                value: 's_mawb',
                name: 'AWB'
            },
            {
                value: 's_flight_id',
                name: 'Flight'
            }, 
            {
                values: '',
                values: ['s_origin', 's_pol', 's_pou', 's_destination'],
                name: 'ORI-POL-POU-DES',
                concat: true,
                operator: '>'
            },
            {
                value: 'f_weight',
                name: 'Weight'
            },
            {
                value: 's_pieces_type',
                name: 'Type'
            },
            {
                value: 'i_actual_piece_count',
                name: 'Actual PCS'
            },
            {
                value: 'i_pieces_total',
                name: 'Total PCS'
            },
            {
                value: 's_commodity',
                name: 'Commodity'
            },
        ]
    },
    fwb: {
        s_table: 'fwb',
        fieldsMapping: [
            {
                value: 't_created',
                name: 'Created',
                datetime: true
            },
            {
                value: 'i_id',
                name: 'ID'
            },
            {
                value: 's_mawb',
                name: 'MAWB'
            },
            {
                value: 's_origin',
                name: 'Origin'
            },
            {
                value: 's_destination',
                name: 'Destination'
            },
            {
                value: 'i_total_consignment_number_of_pieces',
                name: 'Consignment Pcs'
            },
            {
                value: 'f_weight',
                name: 'Weight'
            },
            {
                value: 's_shipper_address_name1',
                name: 'Shipper'
            },
            {
                value: 's_agent_name',
                name: 'Agent'
            },
            {
                value: 's_consignee_address_name1',
                name: 'Consignee'
            },
            {
                value: 'i_chargeitems_numberofpieces',
                name: 'Charge Items Pcs'
            },
            {
                value: 'f_chargeitems_grossweight_amount',
                name: 'Chargeable Weight'
            },
            {
                value: 's_goodsdescription',
                name: 'Goods'
            },
            {
                value: 'b_consolidation',
                name: 'Consolidation',
                boolean: true
            },
        ]
    },
    fhl: {
        s_table: 'fhl',
        fieldsMapping: []
    }
}