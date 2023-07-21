import React, {Fragment} from 'react';
import {Row, Col, Button, Table, Card, CardBody} from 'reactstrap';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import moment from 'moment';

import StatsTable from './StatsTable';
import ValidatingFlightsTable from './ValidatingFlightsTable';

const ValidatePage = ({
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
    i_lavatory,
	i_water,
	i_cabin_cleaning,
	i_waste_removal,
    i_awb_transfer,
    f_courier_kg,
    f_tsa_kg,
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
    f_aircraft_handling,
    f_aircraft_parking,
    f_drayage,
    f_uld_overage,
    f_transfer_skid,
    f_security_labor,
    f_security_space,
    s_type,
    filterAirlineCode,
    filterFlightNum,
    filterAirlineDate,
    filterValidated,
    handleSwitchFilterValidated,
    displayLogo,
    selectPage,
    handleFilterInput,
    i_awb_prepare,
    eightyWindow,
    width,
    enableDeleteStatRecord,
    deleteStatRecord,
    f_misc,
    s_misc_uom,
    s_misc_type,
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

    const formatActivityNotes = (text) => {
        let textArray = text.split('.');
        textArray = textArray.filter(t => t.length > 0);
        return textArray;
    }

    const getTableMapping = () => {
        const mapping = {
            names: ['Type', 'Date', 'Airline:', 'FLT #', 'Validated'],
            values: ['s_type', 'd_flight', 's_airline_code', 's_flight_number', 'b_validated']
        }
        return mapping;
    }

    return (
        <div>
            <Row>
                <Col md='12' lg='12'>
                    <Row>
                        <Col md='4' lg='4'>
                            <h4>Validate Report</h4>
                        </Col>
                        <Col md='4' lg='4'>
                            {
                                displayFilteredStats && displayLogo() &&
                                <img src={airlineLogo} style={{height: '50px', width: 'auto'}} />
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col md='12' lg='12'>
                            <Card className='mb-2' style={{borderRadius: '0.75rem'}}>
                                <CardBody className='custom-card py-4'>
                                    <Row>
                                        <Col md='3' lg='1'>
                                            <Button color='primary' active={s_type === 'export'} id='s_type' value='export' onClick={(e) => handleFilterInput(e)} style={{borderRadius: '8px'}}>Export</Button>
                                        </Col>
                                        <Col md='3' lg='1'>
                                            <Button color='primary' active={s_type === 'import'} id='s_type' value='import' onClick={(e) => handleFilterInput(e)} style={{borderRadius: '8px'}}>Import</Button>
                                        </Col>
                                        <Col md='3' lg='1'>
                                            <Button color='primary' active={s_type === 'ramp'} id='s_type' value='ramp' onClick={(e) => handleFilterInput(e)} style={{borderRadius: '8px'}}>Ramp</Button>
                                        </Col>
                                        <Col md='3' lg='1'>
                                            <Button color='primary' active={s_type === 'misc'} id='s_type' value='misc' onClick={(e) => handleFilterInput(e)} style={{borderRadius: '8px'}}>Misc</Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div className={`${eightyWindow() ? 'col-12' : 'col-4'}`}>
                                            <Table style={{tableLayout: 'fixed'}} className='mt-2'>
                                                <thead>

                                                </thead>
                                                {
                                                    eightyWindow() ? 
                                                    <>
                                                        <tbody>
                                                            <tr className='bg-info'>
                                                                <th>Airline</th>
                                                                <th>Flight Number</th>
                                                                <th>Flight Date</th>
                                                                <th>Validated</th>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <input type='text' id={'filterAirlineCode'} value={filterAirlineCode} onChange={(e) => handleFilterInput(e)} />
                                                                </td>
                                                                <td>
                                                                    <input id={'filterFlightNum'} value={filterFlightNum} onChange={(e) => handleFilterInput(e)} type='number' style={{width: '90%'}}/>
                                                                </td>
                                                                <td>
                                                                    <input type='date' id={'filterAirlineDate'} value={filterAirlineDate} onChange={(e) => handleFilterInput(e)} /> 
                                                                </td>
                                                                <td>
                                                                    <Switch
                                                                        className="custom-switch custom-switch-primary"
                                                                        checked={filterValidated}
                                                                        onClick={handleSwitchFilterValidated}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </> : 
                                                    <>
                                                        <tbody>
                                                            <tr className='bg-info'>
                                                                <th>Airline</th>
                                                                <th>Flight Number</th>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <input type='text' id={'filterAirlineCode'} value={filterAirlineCode} onChange={(e) => handleFilterInput(e)} />
                                                                </td>
                                                                <td>
                                                                    <input id={'filterFlightNum'} value={filterFlightNum} onChange={(e) => handleFilterInput(e)} type='number' style={{width: '90%'}}/>
                                                                </td>
                                                            </tr>
                                                            <tr className='bg-info'>
                                                                <th>Flight Date</th>
                                                                <th>Validated</th>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <input type='date' id={'filterAirlineDate'} value={filterAirlineDate} onChange={(e) => handleFilterInput(e)} /> 
                                                                </td>
                                                                <td>
                                                                    <Switch
                                                                        className="custom-switch custom-switch-primary"
                                                                        checked={filterValidated}
                                                                        onClick={handleSwitchFilterValidated}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </>
                                                }
                                            </Table>
                                        </div>
                                        <div  className={`${eightyWindow() ? 'col-12' : 'col-8'}`}>
                                            <StatsTable
                                                stats={stats}
                                                filteredStats={filteredStats}
                                                displayFilteredStats={displayFilteredStats}
                                                handleInput={handleInput}
                                                selectedStatId={selectedStatId}
                                                selectStatId={selectStatId}
                                                getTableMapping={getTableMapping}
                                                validate={true}
                                            />
                                        </div>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='12' lg='12'>
                            <Row className='px-2'>
                                <Card className='mb-2' style={{borderRadius: '0.75rem'}}>
                                    <CardBody className={`custom-card py-4 px-4`}>
                                    {
                                    eightyWindow() ? 
                                    <>
                                        <Table striped className='mb-1' style={{tableLayout: 'fixed'}}>
                                            <thead>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Airline</td>
                                                    <td>Flight Number</td>
                                                    <td style={{width: '135px'}}>Flight Date</td>
                                                    <td>AWB</td>
                                                    <td>Pieces</td>
                                                    <td>DG AWB Count</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type='text' id={'s_airline_code'} value={s_airline_code} onChange={(e) => handleInput(e)} style={{width: '75px'}} />
                                                    </td>
                                                    <td>
                                                        <input id={'s_flight_number'} value={s_flight_number} onChange={(e) => handleInput(e)} type='number' style={{width: '75px'}}/>
                                                    </td>
                                                    <td>
                                                        <input id={'d_flight'} value={moment.utc(d_flight).format('YYYY-MM-DD')} onChange={(e) => handleInput(e)} type='date' style={{width: '135px'}}/>
                                                    </td>
                                                    <td>
                                                        <input id={'i_awb'} value={i_awb} onChange={(e) => handleInput(e)} type='number' style={{border: resolveInvalid(i_awb), width: '75px'}} />
                                                    </td>
                                                    <td>
                                                        <input id={'i_pieces'} value={i_pieces} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                                    </td>
                                                    <td>
                                                        <input id={'i_awb_dg'} value={i_awb_dg} onChange={(e) => handleInput(e)}  type='number' style={{width: '90%'}} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>AWB Prepare</td>
                                                    <td>LD3</td>
                                                    <td>LD3 BUP</td>
                                                    <td>LD7</td>
                                                    <td>LD7 BUP</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input id={'i_awb_prepare'} value={i_awb_prepare} onChange={(e) => handleInput(e)}  type='number' style={{width: '90%'}} />
                                                    </td>
                                                    <td>
                                                        <input id={'i_ld3'} value={i_ld3} onChange={(e) => handleInput(e)}  type='number' style={{width: '90%'}} />
                                                    </td>
                                                    <td>
                                                        <input id={'i_ld3_bup'} value={i_ld3_bup} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                                    </td>
                                                    <td>
                                                        <input id={'i_ld7'} value={i_ld7} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                                    </td>
                                                    <td>
                                                        <input id={'i_ld7_bup'} value={i_ld7_bup} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <Table style={{tableLayout: 'fixed'}} striped className='mb-0'>
                                            <thead>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className='pb-0'>TSA Weight KG</td>
                                                    <td className='py-1'>                              
                                                        <p style={{width: '80%'}}>Cargo Total Weight</p>
                                                    </td>
                                                    <td className='pb-0' style={{width: '5px'}}></td>
                                                    <td className='pb-0'>Cargo BUP KG</td>
                                                    <td className='pb-0' style={{width: '5px'}}></td>
                                                    <td className='pb-0'>Cargo Loose KG</td>
                                                    <td className='pb-0'>Cargo Total Weight</td>
                                                    <td className='pb-0' style={{width: '5px'}}></td>
                                                    <td className='pb-0'>Mail KG</td>
                                                    <td className='pb-0' style={{width: '5px'}}></td>
                                                    <td className='pb-0'>Total Flight Weight</td>
                                                </tr>
                                                <tr>
                                                    <td className='pr-0'>
                                                        <input type='number' id={'f_tsa_kg'} value={f_tsa_kg} min={0} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                                    </td>
                                                    <td className='pr-0' style={{backgroundColor: '#adc6f0'}}>
                                                        <input type='number' id={'f_total_kg'} value={f_total_kg} min={0} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                                    </td>
                                                    <td className='pl-0' style={{backgroundColor: '#adc6f0'}}>
                                                        <p className='fas fa-minus' style={{width: '5px'}}></p>
                                                    </td>
                                                    <td style={{backgroundColor: '#adc6f0'}}>
                                                        <input type='number' id={'f_bup_kg'} value={f_bup_kg} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                                    </td>
                                                    <td className='pl-0' style={{backgroundColor: '#adc6f0'}}>
                                                        <p className='fas fa-equals' style={{width: '5px'}}></p>
                                                    </td>
                                                    <td style={{backgroundColor: '#adc6f0'}}>
                                                        <p className='ml-5'>{f_loose_kg}</p>
                                                    </td>
                                                    <td className='text-center' style={{backgroundColor: '#b1f0ad'}}>
                                                        <p className='mr-5'>{f_total_kg}</p>
                                                    </td>
                                                    <td className='pl-0' style={{backgroundColor: '#b1f0ad'}}>
                                                        <p className='fas fa-plus' style={{width: '5px'}}></p>
                                                    </td>
                                                    <td style={{backgroundColor: '#b1f0ad'}}>
                                                        <input type='number' id={'f_mail_kg'} value={f_mail_kg} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                                    </td>
                                                    <td className='pl-0' style={{backgroundColor: '#b1f0ad'}}>
                                                        <p className='fas fa-equals' style={{width: '5px'}}></p>
                                                    </td>
                                                    <td style={{backgroundColor: '#b1f0ad'}}>
                                                        <p className='ml-5'>{f_flight_kg}</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <Table striped>
                                            <thead>

                                            </thead>
                                            <tbody>
                                            <tr>
                                                    <td className='pb-0'>Transfer KG</td>
                                                    <td className='pb-0'>Transfer AWB</td>
                                                    <td className='pb-0'>Courier KG</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input id={'f_transfer_kg'} value={f_transfer_kg} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                                    </td>
                                                    <td>
                                                        <input id={'i_awb_transfer'} value={i_awb_transfer} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                                    </td>
                                                    <td>
                                                        <input type='number' id={'f_courier_kg'} value={f_courier_kg} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </> :
                                    <>
                                    <Table striped className='mb-1'>
                                    <thead>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Airline</td>
                                            <td>Flight Number</td>
                                            <td>Aircraft Type</td>
                                            <td>Flight Date</td>
                                            <td>AWB</td>
                                            <td>Pieces</td>
                                            <td>DG AWB Count</td>
                                            <td>AWB Prepare</td>
                                            <td>LD3</td>
                                            <td>LD3 BUP</td>
                                            <td>LD7</td>
                                            <td>LD7 BUP</td>
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
                                                <input id={'d_flight'} value={moment.utc(d_flight).format('YYYY-MM-DD')} onChange={(e) => handleInput(e)} type='date'/>
                                            </td>
                                            <td>
                                                <input id={'i_awb'} value={i_awb} onChange={(e) => handleInput(e)} type='number' style={{border: resolveInvalid(i_awb)}} />
                                            </td>
                                            <td>
                                                <input id={'i_pieces'} value={i_pieces} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input id={'i_awb_dg'} value={i_awb_dg} onChange={(e) => handleInput(e)}  type='number' style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input id={'i_awb_prepare'} value={i_awb_prepare} onChange={(e) => handleInput(e)}  type='number' style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input id={'i_ld3'} value={i_ld3} onChange={(e) => handleInput(e)}  type='number' style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input id={'i_ld3_bup'} value={i_ld3_bup} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input id={'i_ld7'} value={i_ld7} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input id={'i_ld7_bup'} value={i_ld7_bup} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Table style={{tableLayout: 'fixed'}} striped className='mb-0'>
                                    <thead>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='pb-0'>TSA Weight KG</td>
                                            <td className='py-1'>                              
                                                <p style={{width: '80%'}}>Cargo Total Weight</p>
                                            </td>
                                            <td className='pb-0' style={{width: '5px'}}></td>
                                            <td className='pb-0'>Cargo BUP KG</td>
                                            <td className='pb-0' style={{width: '5px'}}></td>
                                            <td className='pb-0'>Cargo Loose KG</td>
                                            <td className='pb-0'>Cargo Total Weight</td>
                                            <td className='pb-0' style={{width: '5px'}}></td>
                                            <td className='pb-0'>Mail KG</td>
                                            <td className='pb-0' style={{width: '5px'}}></td>
                                            <td className='pb-0'>Total Flight Weight</td>
                                            <td className='pb-0'>Transfer KG</td>
                                            <td className='pb-0'>Transfer AWB</td>
                                            <td className='pb-0'>Courier KG</td>
                                        </tr>
                                        <tr>
                                            <td className='pr-0'>
                                                <input type='number' id={'f_tsa_kg'} value={f_tsa_kg} min={0} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                            </td>
                                            <td className='pr-0' style={{backgroundColor: '#adc6f0'}}>
                                                <input type='number' id={'f_total_kg'} value={f_total_kg} min={0} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                            </td>
                                            <td className='pl-0' style={{backgroundColor: '#adc6f0'}}>
                                                <p className='fas fa-minus' style={{width: '5px'}}></p>
                                            </td>
                                            <td style={{backgroundColor: '#adc6f0'}}>
                                                <input type='number' id={'f_bup_kg'} value={f_bup_kg} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                            </td>
                                            <td className='pl-0' style={{backgroundColor: '#adc6f0'}}>
                                                <p className='fas fa-equals' style={{width: '5px'}}></p>
                                            </td>
                                            <td style={{backgroundColor: '#adc6f0'}}>
                                                <p className='ml-5'>{f_loose_kg}</p>
                                            </td>
                                            <td className='text-center' style={{backgroundColor: '#b1f0ad'}}>
                                                <p className='mr-5'>{f_total_kg}</p>
                                            </td>
                                            <td className='pl-0' style={{backgroundColor: '#b1f0ad'}}>
                                                <p className='fas fa-plus' style={{width: '5px'}}></p>
                                            </td>
                                            <td style={{backgroundColor: '#b1f0ad'}}>
                                                <input type='number' id={'f_mail_kg'} value={f_mail_kg} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                            </td>
                                            <td className='pl-0' style={{backgroundColor: '#b1f0ad'}}>
                                                <p className='fas fa-equals' style={{width: '5px'}}></p>
                                            </td>
                                            <td style={{backgroundColor: '#b1f0ad'}}>
                                                <p className='ml-5'>{f_flight_kg}</p>
                                            </td>
                                            <td>
                                                <input id={'f_transfer_kg'} value={f_transfer_kg} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input id={'i_awb_transfer'} value={i_awb_transfer} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input type='number' id={'f_courier_kg'} value={f_courier_kg} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                                    </>
                                }
                                {/* Fits */}
                                <Table style={{tableLayout: 'fixed'}} striped className='mb-0'>
                                    <thead>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Aircraft Handling</td>
                                            <td>Aircraft Parking</td>
                                            <td>Lavatory</td>
                                            <td>Water</td>
                                            <td>Cabin Cleaning</td>
                                            <td>Waste Removal</td>
                                            <td>Dryage</td>
                                            <td>ULD Overage</td>
                                            <td>Transfer Skid</td>
                                            <td>Labor</td>
                                            <td>Space</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input type='number' id={'f_aircraft_handling'} value={f_aircraft_handling} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input type='number' id={'f_aircraft_parking'} value={f_aircraft_parking} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                            </td>

                                            <td>
                                                <input type='number' id={'i_lavatory'} value={i_lavatory} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input id={'i_water'} value={i_water} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input id={'i_cabin_cleaning'} value={i_cabin_cleaning} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}}/>
                                            </td>
                                            <td>
                                                <input id={'i_waste_removal'} value={i_waste_removal} onChange={(e) => handleInput(e)} type='number' style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input type='number' id={'f_drayage'} value={f_drayage} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input type='number' id={'f_uld_overage'} value={f_uld_overage} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input type='number' id={'f_transfer_skid'} value={f_transfer_skid} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input type='number' id={'f_security_labor'} value={f_security_labor} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
                                            </td>
                                            <td>
                                                <input type='number' id={'f_security_space'} value={f_security_space} onChange={(e) => handleInput(e)} style={{width: '90%'}} />
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
                                            <td>Misc Type</td>
                                            <td>Misc Charge</td>
                                            <td>Misc UOM</td>
                                            <td>Nil</td>
                                            <td>Cancelled</td>
                                            <td style={{width: '45%'}}>Notes</td>
                                            <td style={{width: '45%'}}>Previous Notes</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input id={'s_misc_type'} value={s_misc_type} onChange={(e) => handleInput(e)}  type='text' />
                                            </td>
                                            <td>
                                                <input id={'f_misc'} value={f_misc} onChange={(e) => handleInput(e)}  type='number' />
                                            </td>
                                            <td>
                                                <select value={s_misc_uom} id='s_misc_uom' onChange={(e) => handleInput(e)} >
                                                    <option value='USD'>USD</option>
                                                    <option value='KG'>KG</option>
                                                    <option value='UNITS'>UNITS</option>
                                                    <option value='HOURS'>HOURS</option>
                                                </select>                                            
                                            </td>
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
                                                {
                                                    selectedStat && selectedStat.s_notes && 
                                                    formatActivityNotes(selectedStat.s_notes).map((n, i) => 
                                                        <p key={i}>{n}</p>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Table striped className='mb-0'>
                                    <thead>

                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>Activity</th>
                                            <th>Created</th>
                                            <th>Created by</th>
                                            <th>Modified</th>
                                            <th>Modified by</th>
                                        </tr>
                                        {
                                            selectedStat &&  selectedStat !== null ?
                                            <tr>
                                                {
                                                    
                                                }
                                                <td>
                                                    {
                                                        formatActivityNotes(selectedStat.s_activity).map((t, i) => 
                                                            <p key={i}>{t}</p>
                                                        )
                                                    }
                                                </td>
                                                <td>{moment(selectedStat.t_created).format('MM/DD/YYYY')}</td>
                                                <td>{selectedStat.s_created_by}</td>
                                                <td>{moment(selectedStat.t_modified).format('MM/DD/YYYY')}</td>
                                                <td>{selectedStat.s_modified_by}</td>
                                            </tr> : 
                                            <tr style={{height: '60px'}}>
                                                
                                            </tr>
                                        }
                                    </tbody>
                                </Table>
                                <Col md='12' lg='12' className='text-right'>
                                    <Button color='danger' className='mr-3' onClick={() => deleteStatRecord()} disabled={!enableDeleteStatRecord()}>Delete</Button>
                                    <Button color='primary' onClick={() => createStatRecord('validate')}>Validate</Button>
                                </Col>
                                    </CardBody>
                                </Card>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default ValidatePage;