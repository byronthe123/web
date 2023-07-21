import React from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';

export default function SpecialLocations ({
    specialLocations,
    handleOperation
}) {
    return (
        <Card className='custom-opacity-card mb-3' style={{borderRadius: '0.75rem'}}>
            <CardBody className='custom-card-transparent py-3 px-2' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                <Row className={'mb-1'}>
                    <Col md={12}>
                        <h4 className={'d-inline mr-2'}>Special Locations</h4>
                        <Button 
                            className={'d-inline'}
                            onClick={() => handleOperation('CREATE', 'SPECIAL')}
                        >
                            <i className="fas fa-plus-circle mr-2"></i>
                            Location
                        </Button>
                    </Col>
                </Row>
                <Row className={'mx-1'}>
                    {
                        Object.keys(specialLocations || {}).map((key, i) => (
                            <Col 
                                md={2} 
                                key={i} 
                                onClick={() => handleOperation('UPDATE', 'SPECIAL', null, null, key)}
                                style={{ border: '3px solid #dee2e6', fontSize: '16px' }}
                                className={'text-center pr-2 bg-primary hover-pointer'}
                            > 
                                { key }
                            </Col>
                        ))
                    }
                </Row>
            </CardBody>
        </Card>
    );
}