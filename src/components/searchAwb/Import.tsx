import React from 'react';
import { Row, Col } from 'reactstrap';
import { IIMport } from '../../globals/interfaces';

import ReactTable from '../custom/ReactTable';

interface Props {
    data: Array<IIMport>
}

export default function Import ({
    data
}: Props) {
    return (
        <Row>
            <Col md={12}>
                <ReactTable 
                    data={data}
                    mapping={[{
                        name: 'Processed',
                        value: 't_created',
                        datetime: true,
                        utc: true
                    }, {
                        name: 'Status',
                        value: 's_status'
                    }, {
                        name: 'HAWB',
                        value: 's_hawb'
                    }, {
                        name: 'Pieces',
                        value: 'i_pieces'
                    }, {
                        name: 'Picked up',
                        value: 'i_pcs_delivered'
                    }, {
                        name: 'Weight',
                        value: 'f_weight'
                    }, {
                        name: 'Agent',
                        value: 's_created_by',
                        email: true
                    }, {
                        name: 'Customer',
                        values: ['s_driver_company', 's_driver_name'],
                        concat: true,
                        operator: '/'
                    }, {
                        name: 'Charges',
                        value: 'f_charges_total',
                        money: true
                    }, {
                        name: 'Overrides',
                        value: 'f_balance_offset',
                        money: true
                    }, {
                        name: 'Payment',
                        value: 'f_paid_total',
                        money: true
                    }]}
                />
            </Col>
        </Row>
    );
}