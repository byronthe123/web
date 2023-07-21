import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';

import ReactTable from '../custom/ReactTable';
import { IQueue } from '../../globals/interfaces';

interface Props {
    data: Array<IQueue>
}

export default function WarehouseCheckIn ({
    data
}: Props) {
    return (
        <Row>
            <Col md={12}>
                <h6>Warehouse Check-ins: {data.length}</h6>
                <ReactTable 
                    data={data}
                    mapping={[{
                        name: 'Created',
                        value: 't_created',
                        utc: true,
                        datetime: true
                    }, {
                        name: 'Status',
                        value: 's_status'
                    }, {
                        name: 'Customer',
                        values: ['s_trucking_company', 's_trucking_driver'],
                        operator: '/',
                        concat: true
                    }, {
                        name: 'Kiosk',
                        value: 't_kiosk_start',
                        datetime: true,
                        utc: true
                    }, {
                        name: 'Counter Start',
                        value: 't_counter_ownership',
                        datetime: true,
                        utc: true
                    }, {
                        name: 'Office Agent',
                        value: 's_counter_ownership_agent',
                        email: true
                    }, {
                        name: 'Counter End',
                        value: 't_counter_end',
                        datetime: true,
                        utc: true
                    }, {
                        name: 'Dock Start',
                        value: 't_dock_ownership',
                        datetime: true,
                        utc: true
                    }, {
                        name: 'Dock End',
                        value: 't_dock_complete',
                        datetime: true,
                        utc: true
                    }, {
                        name: 'Warehouse',
                        value: 's_dock_door_assigned',
                        email: true
                    }, {
                        name: 'Minutes',
                        value: 'ic_total_engagement_time'
                    }]}
                    numRows={10}
                />
            </Col>
        </Row>
    );
}