import React, {Fragment} from 'react';
import {Row, Col, Button, Table, Card, CardBody} from 'reactstrap';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";

import FlightDetailContainer from './FlightDetailContainer';

const RampPage = ({
    handleInput,
    handleSwitchNil,
    handleSwitchCancelled,
    s_airline_code,
    s_flight_number,
    s_aircraft_type,
    d_flight,
    i_awb,
    i_pieces,
    i_awb_dg,
    i_awb_prepare,
    i_ld3,
    i_ld3_bup,
    i_ld7,
    i_ld7_bup,
    f_total_kg,
    f_bup_kg,
    f_loose_kg,
    f_mail_kg,
    f_flight_kg,
    f_transfer_kg,
    i_awb_transfer,
    f_courier_kg,
    i_lavatory,
	i_water,
	i_cabin_cleaning,
	i_waste_removal,
    f_aircraft_handling,
    f_aircraft_parking,
    f_drayage,
    b_nil,
    b_cancelled,
    s_notes,
    enableSubmitStat,
    resolveAmountValues,
    createStatRecord,
    stats,
    filteredStats,
    displayFilteredStats,
    airlineLogo,
    selectedStatId,
    selectStatId,
    selectedStat,
    filterAirlineCode,
    filterFlightNum,
    filterAirlineDate,
    filterValidated,
    handleSwitchFilterValidated,
    displayLogo,
    handleFilterInput,
    selectionBoxFlightCode,
    getSelectionBoxFlights,
    setSelectionBoxFlightCode,
    halfWindow,
    eightyWindow,
    width,
    f_flight_watch,
    f_gpu,
    f_asu,
    f_deicing,
    f_weight_balance,
    f_customs,
    f_gen_dec
}) => {

    const resolveInvalid = (value) => {
        if (value < 0) {
            return '2px solid red';
        }
        return '';
    }

    return (
        <div>
            <Row>
                <Col md='4' lg='4'>
                    <h4>Ramp Report</h4>
                </Col>
                <Col md='4' lg='4'>
                    {
                        displayFilteredStats && displayLogo() &&
                        <img src={airlineLogo} style={{height: '50px', width: 'auto'}} />
                    }
                </Col>
            </Row>
            <Row className='px-3'>
                <Card className='mb-2' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card py-4'>
                        <Col md='12' lg='12'>
                            <Row className='mb-5'>
                                <Col md='12' className={`${eightyWindow() && 'mt-5'}`}>
                                    <Table style={{tableLayout: 'fixed'}} striped className='mb-1'>
                                        <thead>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Airline</td>
                                                <td>Flight Number</td>
                                                <td>Aircraft Type</td>
                                                <td>Flight Date</td>
                                                <td>Aircraft Handling</td>
                                                <td>Aircraft Parking</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input type='text' id={'s_airline_code'} value={s_airline_code} onChange={(e) => handleInput(e)} />
                                                </td>
                                                <td>
                                                    <input id={'s_flight_number'} value={s_flight_number} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}}/>
                                                </td>
                                                <td>
                                                    <input id={'s_aircraft_type'} value={s_aircraft_type} onChange={(e) => handleInput(e)} type='text'/>
                                                </td>
                                                <td>
                                                    <input id={'d_flight'} value={d_flight} onChange={(e) => handleInput(e)} type='date'/>
                                                </td>
                                                <td>
                                                    <input id={'f_aircraft_handling'} value={f_aircraft_handling} onChange={(e) => handleInput(e)} type='number' style={{border: resolveInvalid(i_awb)}} />
                                                </td>
                                                <td>
                                                    <input id={'f_aircraft_parking'} value={f_aircraft_parking} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Table style={{tableLayout: 'fixed'}} striped className='mb-1'>
                                        <thead>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Drayage</td>
                                                <td>Lavatory</td>
                                                <td>Water</td>
                                                <td>Cabin Cleaning</td>
                                                <td>Waste Removal</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input id={'f_drayage'} value={f_drayage} onChange={(e) => handleInput(e)}  type='number' style={{width: '90%'}} />
                                                </td>
                                                <td>
                                                    <input type='number' id={'i_lavatory'} value={i_lavatory} onChange={(e) => handleInput(e)} />
                                                </td>
                                                <td>
                                                    <input id={'i_water'} value={i_water} onChange={(e) => handleInput(e)} type='number' />
                                                </td>
                                                <td>
                                                    <input id={'i_cabin_cleaning'} value={i_cabin_cleaning} onChange={(e) => handleInput(e)} type='number'/>
                                                </td>
                                                <td>
                                                    <input id={'i_waste_removal'} value={i_waste_removal} onChange={(e) => handleInput(e)} type='number' />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Table striped className='mb-1'>
                                        <thead></thead>
                                        <tbody>
                                            <tr>
                                                <td>Flight Watch</td>
                                                <td>GPU</td>
                                                <td>ASU</td>
                                                <td>Deicing</td>
                                                <td>Weight Balance</td>
                                                <td>Customs</td>
                                                <td>Gen Dec</td>
                                            </tr>
                                            <tr>
                                                <td><input id={'f_flight_watch'} value={f_flight_watch} onChange={(e) => handleInput(e)} type='number' /></td>
                                                <td><input id={'f_gpu'} value={f_gpu} onChange={(e) => handleInput(e)} type='number' /></td>
                                                <td><input id={'f_asu'} value={f_asu} onChange={(e) => handleInput(e)} type='number' /></td>
                                                <td><input id={'f_deicing'} value={f_deicing} onChange={(e) => handleInput(e)} type='number' /></td>
                                                <td><input id={'f_weight_balance'} value={f_weight_balance} onChange={(e) => handleInput(e)} type='number' /></td>
                                                <td><input id={'f_customs'} value={f_customs} onChange={(e) => handleInput(e)} type='number' /></td>
                                                <td><input id={'f_gen_dec'} value={f_gen_dec} onChange={(e) => handleInput(e)} type='number' /></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Table striped className='mb-0'>
                                        <thead>

                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Nil</td>
                                                <td>Cancelled</td>
                                                <td style={{width: '90%'}}>Notes</td>
                                                <td style={{width: '90%'}}></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Switch
                                                        className="custom-switch custom-switch-primary"
                                                        checked={b_nil}
                                                        onClick={handleSwitchNil}
                                                    />
                                                </td>
                                                <td>
                                                    <Switch
                                                        className="custom-switch custom-switch-primary"
                                                        checked={b_cancelled}
                                                        onClick={handleSwitchCancelled}
                                                    />
                                                </td>
                                                <td>
                                                    <textarea id={'s_notes'} value={s_notes} onChange={(e) => handleInput(e)} type='text' style={{width: '100%', height: '40px'}}></textarea>
                                                </td>
                                                <td>
                                                    <Button disabled={!enableSubmitStat()} onClick={() => createStatRecord('ramp')} >Submit</Button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Col>
                    </CardBody>
                </Card>
            </Row>
            <FlightDetailContainer 
                stats={stats}
                filteredStats={filteredStats}
                displayFilteredStats={displayFilteredStats}
                handleInput={handleInput}
                selectedStatId={selectedStatId}
                selectStatId={selectStatId}
                selectedStat={selectedStat}
                filterAirlineCode={filterAirlineCode}
                filterFlightNum={filterFlightNum}
                filterAirlineDate={filterAirlineDate}
                filterValidated={filterValidated}
                handleSwitchFilterValidated={handleSwitchFilterValidated}
                handleFilterInput={handleFilterInput}
                type={'ramp'}
                eightyWindow={eightyWindow}
                width={width}
            />
        </div>
    );
}

export default RampPage;