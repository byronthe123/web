import React from 'react';
import { Row, Col } from 'reactstrap';

export default function BroadcastNotification ({ message }) {
    return (
        <div style={{ fontFamily: 'Segoe UI', fontSize: '20px' }}>
            <Row className='mt-2'>
                <Col className='text-center'>
                    <i class="fas fa-exclamation-triangle"></i>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col className='text-center'>
                    <h4>Notification</h4>
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col className='text-center'>
                    {message.toUpperCase()}
                </Col> 
            </Row>
        </div>
    );
}