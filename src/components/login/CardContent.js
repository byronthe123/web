import React from 'react';
import {Col, Row} from 'reactstrap';

const CardContent = ({
    title,
    logoUrl
}) => {
    return (
        <Col md='12' lg='12'>
            <Row>
                <Col mg='12' lg='12' className='text-center pb-1'>
                    <img src={logoUrl} style={{height: '50px', width: 'auto'}} />
                </Col>
            </Row>
            <Row>
                <Col sm='12' md='12' lg='12' className='text-center px-1' style={{overflow: 'hidden', whiteSpace: 'wrap'}}>
                    <p className='mb-0' style={{fontWeight: 'bold'}}>{title}</p>
                </Col>
            </Row>
        </Col>
    );   
}

export default CardContent;