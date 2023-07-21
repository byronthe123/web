import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../context';
import { Row, Col, Button } from 'reactstrap';
import { api } from '../../../utils';
import Switch from 'rc-switch';

export default function ManageCache () {

    const { createSuccessNotification } = useContext(AppContext);
    const [timer, setTimer] = useState(false);

    const clearCaches = async () => {
        const res = await api('post', 'clearCaches');
        if (res.status === 200) {
            createSuccessNotification('All caches cleared');
        }
    }

    useEffect(() => {
        if (timer) {
            const interval = setInterval(() => {
                clearCaches();
            }, 15000);
        
            return () => {
                clearInterval(interval);
            }
        }
    }, [timer]);

    return (
        <Row>
            <Col md={3}>
                <Button onClick={() => clearCaches()}>Clear Cache</Button>
            </Col>
            <Col md={6}>
                <h3>Automatic 15 second interval</h3>
                <Switch 
                    className={"custom-switch custom-switch-primary"}
                    checked={timer}
                    onChange={() => setTimer(prev => !prev)}
                />
            </Col>
        </Row>
    );
}