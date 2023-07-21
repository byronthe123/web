import React, {Fragment} from 'react';
import {Row, Col, Button, Table, Card, CardBody} from 'reactstrap';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";

import FlightDetailContainer from './FlightDetailContainer';

const MiscPage = ({
    handleInput,
    handleSwitchNil,
    handleSwitchCancelled,
    s_airline_code,
    s_flight_number,
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
    f_aircraft_handling,
    f_aircraft_parking,
    f_drayage,
    f_uld_overage,
    f_transfer_skid,
    f_security_labor,
    f_security_space,
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
    f_misc,
    s_misc_uom,
    s_misc_type
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
                    <h4>Misc Report</h4>
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
                                <Col md='12' className={`${eightyWindow() && 'mt-4'}`}>
                                    <Table style={{tableLayout: 'fixed'}} striped className='mb-1'>
                                        <thead>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Airline</td>
                                                <td>Charge Date</td>
                                                <td>ULD Overage</td>
                                                <td>Transfer Skid</td>
                                                <td>Labor</td>
                                                <td>Space</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input type='text' id={'s_airline_code'} value={s_airline_code} onChange={(e) => handleInput(e)} />
                                                </td>
                                                <td>
                                                    <input id={'d_flight'} value={d_flight} onChange={(e) => handleInput(e)} type='date'/>
                                                </td>
                                                <td>
                                                    <input id={'f_uld_overage'} value={f_uld_overage} onChange={(e) => handleInput(e)} type='number' style={{border: resolveInvalid(i_awb)}} />
                                                </td>
                                                <td>
                                                    <input id={'f_transfer_skid'} value={f_transfer_skid} onChange={(e) => handleInput(e)} type='number' style={{border: resolveInvalid(i_awb)}} />
                                                </td>
                                                <td>
                                                    <input id={'f_security_labor'} value={f_security_labor} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                                </td>
                                                <td>
                                                    <input id={'f_security_space'} value={f_security_space} onChange={(e) => handleInput(e)}  type='number' style={{width: '90%'}} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Table striped className='mb-0'>
                                        <thead>

                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Misc Charge</td>
                                                <td>Misc UOM</td>
                                                <td>Misc Type</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input id={'f_misc'} value={f_misc} onChange={(e) => handleInput(e)}  type='number' />
                                                </td>
                                                <td>
                                                    <input id={'s_misc_uom'} value={s_misc_uom} onChange={(e) => handleInput(e)}  type='text' />
                                                </td>
                                                <td>
                                                    <input id={'s_misc_type'} value={s_misc_type} onChange={(e) => handleInput(e)}  type='text' />
                                                </td>
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
                                                    <Button disabled={!enableSubmitStat()} onClick={() => createStatRecord('misc')} >Submit</Button>
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
                type={'misc'}
                eightyWindow={eightyWindow}
                width={width}
            />
        </div>
    );
}

export default MiscPage;