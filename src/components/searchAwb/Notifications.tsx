import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col } from 'reactstrap';

import ReactTable from '../custom/ReactTable';
import { INotification } from '../../globals/interfaces';
import Header from './Header';

interface Props {
    data: Array<INotification>;
    toggle: () => void;
}

export default function Notifications ({
    data,
    toggle
}: Props) {

    const [selectedNotification, setSelectedNotification] = useState<INotification>();

    useEffect(() => {
        if (data.length > 0) {
            setSelectedNotification(data[0]);
        }
    }, [data]);

    return (
        <Row>
            <Col md={12}>
                <Header 
                    title={`Notifications Sent: ${data.length}`}
                    navigation={{
                        path: '/EOS/Operations/Import/Notify',
                        toggle: () => toggle()
                    }}
                />
            </Col>
            <Col md={6}>
                <ReactTable 
                    data={data}
                    mapping={[{
                        name: 'Sent',
                        value: 't_created',
                        utc: true,
                        datetime: true
                    }, {
                        name: 'Flight ID',
                        value: 's_flight_id'
                    }, {
                        name: 'Type',
                        value: 's_notification_type'
                    }, {
                        name: 'Agent',
                        value: 's_created_by',
                        email: true
                    }]}
                    handleClick={(item) => setSelectedNotification(item)}
                    enableClick={true}
                    numRows={10}
                />
            </Col>
            <Col md={6} style={{ height: 'calc(100vh - 400px)', overflowY: 'scroll' }}>
                {
                    selectedNotification && selectedNotification.s_email_message && 
                    <div dangerouslySetInnerHTML={{__html: selectedNotification.s_email_message || ''}}></div>
                }
            </Col>
        </Row>
    );
}