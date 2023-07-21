import React from 'react';
import { useWindowWidth } from '@react-hook/window-size';
import { Table, Card, CardBody, Button, Row, Col } from 'reactstrap';
import Td from './Td';

const TableLayoutter = ({
    tower,
    levels,
    rackData,
    rackLocations,
    handleAddUpdate,
    selectedLocation,
    setSelectedLocation
}) => {

    const width = useWindowWidth();

    return (
        <Card className='custom-opacity-card mb-3' style={{borderRadius: '0.75rem'}}>
            <CardBody className='custom-card-transparent py-3 px-2' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                <Row className={'mb-1'}>
                    <Col md={12}>
                        <h4 className={'d-inline mr-2'}>Tower {tower}</h4>
                    </Col>
                </Row>
                <Table responsive bordered className='mb-0'>
                    <thead>

                    </thead>
                    <tbody>
                        <tr>
                            {
                                width > 1000 && 
                                <td 
                                    rowSpan={Object.keys(levels).length + 1} 
                                    className='text-center align-middle bg-primary' 
                                    style={{fontSize: '48px', fontWeight: 'bolder'}}
                                >
                                    {tower}
                                </td>
                            }
                        </tr>
                        {
                            Object.keys(levels).map((level, i) => (
                                <tr key={i}>
                                    <td 
                                        className={'text-center bg-info align-middle text-white'} 
                                        style={{ width: '25px' }}
                                    >
                                        {level}
                                    </td>
                                    {
                                        Object.keys(levels[level]).sort((a, b) => Number(a) - Number(b)).map((loc, j) => (
                                            <Td 
                                                location={`${tower}${level}${loc}`}
                                                number={`${level}${loc}`}
                                                rackData={rackData}
                                                rackLocations={rackLocations}
                                                selectedLocation={selectedLocation}
                                                setSelectedLocation={setSelectedLocation}
                                                handleAddUpdate={handleAddUpdate}
                                                key={j}
                                            />
                                        ))
                                    }
                                </tr>  
                            ))
                        }
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
}

export default TableLayoutter;