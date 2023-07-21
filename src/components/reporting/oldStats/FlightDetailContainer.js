import React from 'react';
import { Row, Table, Col, Card, CardBody } from 'reactstrap';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";

import StatsTable from './StatsTable';
import FlightDetail from './FlightDetail';

const FlightDetailContainer = ({
    stats,
    filteredStats,
    displayFilteredStats,
    selectedStatId,
    handleInput,
    selectStatId,
    selectedStat,
    filterAirlineCode,
    filterFlightNum,
    filterAirlineDate,
    filterValidated,
    handleSwitchFilterValidated,
    handleFilterInput,
    type,
    halfWindow,
    eightyWindow,
    width
}) => {

    const getTableMapping = () => {
        const mapping = {
            names: ['Airline', 'Date', 'FLT #', 'Validated'],
            values: ['s_airline_code', 'd_flight', 's_flight_number', 'b_validated']
        }
        return mapping;
    }

    return (
        <Row>
            <Col md='12' lg='12'>
                <Row>
                    {
                        eightyWindow() ? 
                        <Card className='mb-3 mx-3' style={{width: '100%', borderRadius: '0.75rem'}}>
                            <CardBody className='py-4'>
                                <Col md='12' lg='12>'>
                                    <Row>
                                        <Col md='2' lg='2' style={{width: '230px'}}>
                                            <h2 className='mb-0'>Flight's Detail</h2>
                                        </Col>
                                        <Col md='10' lg='6' className='pb-2'>
                                            <Row>
                                                <h6 className='mr-3'>Airline Code:</h6>
                                                <input id={'filterAirlineCode'} value={filterAirlineCode} onChange={(e) => handleFilterInput(e)} type='text' style={{width: '55px'}} className='mr-4' />
                                                <h6 className='mr-3'>Flight Number:</h6>
                                                <input id={'filterFlightNum'} value={filterFlightNum} onChange={(e) => handleFilterInput(e)} type='number' style={{width: '70px'}} className='mr-4' />
                                            </Row>
                                            <Row className='mt-2'>
                                                <h6 className='mr-3'>Flight Date:</h6>
                                                <input id={'filterAirlineDate'} value={filterAirlineDate} onChange={(e) => handleFilterInput(e)} type='date'  style={{width: '140px'}} className='mr-4' />
                                                <h6 className='mr-3'>Validated:</h6>
                                                <Switch
                                                    className="custom-switch custom-switch-primary"
                                                    checked={filterValidated}
                                                    onClick={handleSwitchFilterValidated}
                                                />
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </CardBody>
                        </Card> : 
                        <Card className='mb-2 mx-3' style={{width: '100%', borderRadius: '0.75rem'}}>
                            <CardBody className='custom-card py-4'>
                                <Col md='12' lg='12'>
                                    <Row>
                                        <Col md='2' lg='2' style={{width: '230px'}}>
                                            <h2 className='mb-0'>Flight's Detail</h2>
                                        </Col>
                                        <Col md='10' lg='10' className='pb-2'>
                                            <Row>
                                                <h6 className='mr-3'>Airline Code:</h6>
                                                <input id={'filterAirlineCode'} value={filterAirlineCode} onChange={(e) => handleFilterInput(e)} type='text' style={{width: '55px'}} className='mr-4' />
                                                <h6 className='mr-3'>Flight Number:</h6>
                                                <input id={'filterFlightNum'} value={filterFlightNum} onChange={(e) => handleFilterInput(e)} type='number' style={{width: '70px'}} className='mr-4' />
                                                <h6 className='mr-3'>Flight Date:</h6>
                                                <input id={'filterAirlineDate'} value={filterAirlineDate} onChange={(e) => handleFilterInput(e)} type='date'  style={{width: '140px'}} className='mr-4' />
                                                <h6 className='mr-3'>Validated:</h6>
                                                <Switch
                                                    className="custom-switch custom-switch-primary"
                                                    checked={filterValidated}
                                                    onClick={handleSwitchFilterValidated}
                                                />
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>

                            </CardBody>                        
                        </Card>
                    }
                </Row>
                <Row style={{maxHeight: `${eightyWindow() ? '9999px' : '500px'}`}}>
                    <div className={`${eightyWindow() ? 'mb-3 col-12': 'col-5'}`}>
                        <Card style={{borderRadius: '0.75rem'}}>
                            <CardBody className='custom-card py-4'>
                                <StatsTable
                                    stats={stats}
                                    filteredStats={filteredStats}
                                    displayFilteredStats={displayFilteredStats}
                                    handleInput={handleInput}
                                    selectedStatId={selectedStatId}
                                    selectStatId={selectStatId}
                                    getTableMapping={getTableMapping}
                                    validate={false}
                                />
                            </CardBody>
                        </Card>
                    </div>
                    <div className={`${eightyWindow() ? 'col-12': 'col-7'}`}>
                        <Card style={{borderRadius: '0.75rem'}}>
                            <CardBody className='custom-card py-4 px-5'>
                                <FlightDetail 
                                    selectedStat={selectedStat}
                                    type={type}
                                />
                            </CardBody>
                        </Card>
                    </div>
                </Row>
            </Col>
        </Row>
    );
}

export default FlightDetailContainer;