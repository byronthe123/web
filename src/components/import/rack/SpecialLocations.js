import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import ModalSpecLocations from './ModalSpecLocations';

export default function SpecialLocations ({
    specialLocations,
    rackData,
    rackLocations,
    handleAddUpdate
}) {

    const [modal, setModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    const handleViewLocations = (location) => {
        setSelectedLocation(location);
        const items = rackData.filter(l => l.s_location === location);
        setSelectedItems(items);
        setModal(true);
    }

    return (
        <>
            <Card className='custom-opacity-card mb-3' style={{borderRadius: '0.75rem'}}>
                <CardBody className='custom-card-transparent py-3 px-2' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                    <Row>
                        <Col md={12}>
                            <h4>Special Locations</h4>
                        </Col>
                    </Row>
                    <Row className={'mx-1'}>
                        {
                            Object.keys(specialLocations || {}).map((key, i) => (
                                <Col 
                                    md={2} 
                                    key={i} 
                                    onClick={() => handleViewLocations(key)}
                                    style={{ border: '3px solid #dee2e6', fontSize: '16px' }}
                                    className={'text-center bg-primary pr-2 hover-pointer'}
                                > 
                                    { key }
                                </Col>
                            ))
                        }
                    </Row>
                </CardBody>
            </Card>
            <ModalSpecLocations 
                modal={modal}
                setModal={setModal}
                selectedLocation={selectedLocation}
                selectedItems={selectedItems}
                handleAddUpdate={handleAddUpdate}
            />
        </>
    );
}