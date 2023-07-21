import React from 'react';
import moment from 'moment';
import {
    CustomInput,
  } from "reactstrap";
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import {Table, Card, CardBody} from 'reactstrap';

import {useEffect, useRef, useState} from 'react';

const SelectFlight = ({
    orderedAirlineCodes,
    orderedFlightSerials,
    d_arrival_date,
    s_airline_code,
    s_flight_serial,
    selectedMawb,
    goDate,
    handleInput
}) => {
    return (
        <div className='row py-2 px-3' style={{fontSize: '16px'}}>
            <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                    <h4>Select Flight:</h4>
                    <Table striped responsive>
                        <tdead>
                        </tdead>
                        <tbody>
                            <tr>
                                <td>Flight Date</td>
                                <td>Airline - {orderedAirlineCodes.length}</td>
                                <td>Flight - {orderedFlightSerials.length}</td>
                            </tr>
                            <tr>
                                <td>
                                    <input type='date' id={'d_arrival_date'} value={moment(d_arrival_date).format('YYYY-MM-DD')} onChange={(e) => handleInput(e)} />
                                </td>
                                <td>
                                    <select value={s_airline_code} id={'s_airline_code'} onChange={(e) => handleInput(e)}>
                                        {
                                            orderedAirlineCodes && orderedAirlineCodes.map((c, i) => 
                                                <option key={i} value={c}>{c}</option>
                                            )
                                        }
                                    </select> 
                                </td>
                                <td>
                                    <select value={s_flight_serial} id={'s_flight_serial'} onChange={(e) => handleInput(e)}>
                                        {
                                            orderedFlightSerials && orderedFlightSerials.map((s, i) => 
                                                <option key={i} value={s}>{s}</option>
                                            )
                                        }
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Flight ID</td>
                                <td colSpan='2'></td>
                            </tr>
                            <tr>
                                <td>Storage Start</td>
                                <td>GO Date</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><input type='date' value={selectedMawb && selectedMawb !== null ? moment.utc(selectedMawb[0].d_storage_start_day).format('YYYY-MM-DD') : ''} /></td>
                                <td className='pl-0'><input type='date' value={goDate} style={{widtd: '130px'}} /></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </div>

    );
}

export default SelectFlight;