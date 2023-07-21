import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";

import {Row, Col, Table, Card, CardBody, CardTitle, CardText, Button} from 'reactstrap';

import AppLayout from '../../components/AppLayout';


const ImportTransfers = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, halfWindow, width, station
}) => {

    const resolveStorageStartDate = () => {
        //Another way to do the calculation is to just add 2 days to the do not count date.
        //The only thing that changes based on the day of the week is the do not count date.
        //If non-Friday, d_arrival_date = do not count date.
        //Else if Friday, d_arrival_date = do not count date += 1 day.
        //Add 2 days to whatever the do not count date is to get the storage start date.
        const addDays = moment(d_arrival_date).format('dddd').toUpperCase() === 'FRIDAY' ? 4 : 3;
        console.log(addDays);
        return moment().add(addDays, 'days');
    }

    const resolveDoNotCountDate = () => {
        //Based on FFM logic: If arrival date is Friday, do not count date = d_arrival_date += 1. Else, do not count date = d_arrival_date.
        const addDays = moment(d_arrival_date).format('dddd').toUpperCase() === 'FRIDAY' ? 1 : 0;
        console.log(addDays);
        return moment().add(addDays, 'days');
    }

    const resolveIscCost = (iscDataObj) => {
        let iscCost;
        const office = user && user.s_unit;
        if (office === 'CEWR1') {
            iscCost = iscDataObj.f_cewr1;
        } else if (office === 'CIAD1') {
            iscCost = iscDataObj.f_ciad1;
        } else if (office === 'CBOS1') {
            iscCost = iscDataObj.f_cbos1;
        }
        return iscCost;
    }

    const [s_flight_serial, set_s_flight_serial] = useState('');

    const [s_mawb_prefix, set_s_mawb_prefix] = useState('');
    const [s_mawb_post, set_s_mawb_post] = useState('');
    const [i_actual_piece_count, set_i_actual_piece_count] = useState('');
    const [i_pieces_total, set_i_pieces_total] = useState('');

    const [s_pieces_type, set_s_pieces_type] = useState('');
    const [f_weight, set_f_weight] = useState('');
    const [s_commodity, set_s_commodity] = useState('');
    const [s_origin, set_s_origin] = useState('');

    const [s_pol, set_s_pol] = useState('');
    const [s_pou, set_s_pou] = useState('');
    const [s_shc1, set_s_shc1] = useState('');
    const [s_shc2, set_s_shc2] = useState('');

    const [s_shc3, set_s_shc3] = useState('');
    const [s_shc4, set_s_shc4] = useState('');
    const [s_shc5, set_s_shc5] = useState('');
    const [s_uld_type, set_s_uld_type] = useState('');

    const [s_uld_number, set_s_uld_number] = useState('LOOSE');
    const [s_uld_code, set_s_uld_code] = useState('');
    const s_uld = s_uld_number.toUpperCase();
    const [s_volume, set_s_volume] = useState('');

    const [d_arrival_date, set_d_arrival_date] = useState(moment().format('YYYY-MM-DD'));
    const [d_do_not_count_date, set_d_do_not_count_date] = useState(resolveDoNotCountDate());
    const [d_first_free_day, set_d_first_free_day] = useState(moment().add(1, 'days'));
    const [d_second_free_day, set_d_second_free_day] = useState(moment().add(2, 'days'));
    
    const [d_storage_start_day, set_d_storage_start_day] = useState(resolveStorageStartDate());
    const [f_daily_storage_rate, set_f_daily_storage_rate] = useState('');
    const [s_airline_code, set_s_airline_code] = useState('');
    const [s_arrival_weekday, set_s_arrival_weekday] = useState(moment().format('dddd').toUpperCase());

    const s_created_by = user && user.s_email;
    const s_destination = user.s_unit.substr(1, 3);
    const [s_flight_number, set_s_flight_number] = useState('');
    const [s_flight_id, set_s_flight_id] = useState('');
    
    //flight seriail above
    const [s_mawb, set_s_mawb] = useState('');
    const s_message_type = 'MANUAL';
    const s_modified_by = user && user.s_email;

    const [s_notes, set_s_notes] = useState('');
    const [s_pieces, set_s_pieces] = useState('');
    const [s_special_handling_code, set_s_special_handling_code] = useState('');
    const s_status = 'ENTERED';

    const s_type = 'IMPORT';
    const s_unique = 'M01';
    const s_weight_type = 'KG';
    const t_created = moment().format('MM/DD/YYYY HH:mm:ss');

    const t_modified = moment().format('MM/DD/YYYY HH:mm:ss');
    const s_cs_id = 'NONE';

    useEffect(() => {
        set_d_do_not_count_date(d_arrival_date);
        set_d_first_free_day(moment(d_arrival_date).add(1, 'days'));
        set_d_second_free_day(moment(d_arrival_date).add(2, 'days'));
        set_d_storage_start_day(resolveStorageStartDate());
        set_s_arrival_weekday(moment(d_arrival_date).format('dddd').toUpperCase());
    }, [d_arrival_date]);

    useEffect(() => {
        if (s_mawb_prefix.length === 3) {
            const s_airline_prefix = s_mawb_prefix;
            const data = {
                s_airline_prefix,
                s_unit: user && user.s_unit
            }
            axios.post(`${baseApiUrl}/resolveIsc`, {
                data
            }, {
                headers: {'Authorization': `Bearer ${headerAuthCode}`}
            }).then(response => {
                const { data } = response;

                let importMinCharge = 0;
                if (data.airlineDataWithDetail.AirlineMappingDetail && data.airlineDataWithDetail.AirlineMappingDetail.f_import_isc_cost && data.airlineDataWithDetail.AirlineMappingDetail.f_import_isc_cost > 0) {
                    importMinCharge = data.airlineDataWithDetail.AirlineMappingDetail.f_import_min_charge;
                } else {
                    importMinCharge = data.corpStationData.f_import_min_charge;
                }

                set_f_daily_storage_rate(importMinCharge);
                set_s_airline_code(data.airlineDataWithDetail.s_airline_code || null);
    
            }).catch(error => {
    
            });
        } else if (s_mawb_prefix.length > 3) {
            set_s_mawb_prefix(s_mawb_prefix.substr(0, 3));
        } else {
            set_f_daily_storage_rate('');
            set_s_airline_code('');
        }
    }, [s_mawb_prefix]);

    useEffect(() => {
        set_s_flight_number(`${s_airline_code}${s_flight_serial}`);
        set_s_flight_id(`${s_airline_code}${s_flight_serial}/${d_arrival_date}`);
    }, [s_flight_serial, s_airline_code]);

    useEffect(() => {
        set_s_mawb(`${s_mawb_prefix}-${s_mawb_post}`);
    }, [s_mawb_prefix, s_mawb_post]);

    useEffect(() => {
        set_s_pieces(`${i_actual_piece_count} OF ${i_pieces_total}`);
    }, [i_actual_piece_count, i_pieces_total]);

    useEffect(() => {
        if (s_mawb_post.length > 8) {
            set_s_mawb_post(s_mawb_post.substr(0, 8));
        }
    }, [s_mawb_post]);

    const submit = () => {
        axios.post(`${baseApiUrl}/insertIntoFFM`, {
            s_cs_id,
            s_unique,
            s_flight_id,
            s_status,
            s_type,
            s_mawb,
            s_mawb_prefix,
            s_mawb_post,
            s_airline_code,
            s_flight_number,
            s_flight_serial,
            d_arrival_date,
            s_origin,
            s_destination,
            f_weight,
            s_weight_type,
            s_pieces_type,
            i_actual_piece_count,
            i_pieces_total,
            s_pieces,
            s_volume,
            s_commodity,
            s_special_handling_code,
            s_shc1,
            s_shc2,
            s_shc3,
            s_shc4,
            s_shc5,
            s_uld,
            s_uld_type,
            s_uld_number,
            s_uld_code,
            d_do_not_count_date,
            d_first_free_day,
            d_second_free_day,
            d_storage_start_day,
            f_daily_storage_rate,
            s_arrival_weekday,
            s_message_type,
            t_created,
            s_created_by,
            s_modified_by,
            t_modified,
            s_notes,
            s_pol,
            s_pou
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            window.location.reload();
        }).catch(error => {
            alert('Error creating record');
        });
    }

    const resolveBorder = (value) => {
        if (value.length === 0) {
            return '2px solid red';
        }
        return '1px solid grey';
    }

    const validMawbPost = () => {
        return s_mawb_post.length === 8;
    }

    const validMawbPrefix = () => {
        return s_mawb_prefix.length === 3;
    }

    const validFlightSerial = () => {
        return s_flight_serial.length >= 3;
    }

    const enableSubmit = () => {
        let checkArrayValid = true;
        const checkArray = [
            s_cs_id,
            s_unique,
            s_flight_id,
            s_type,
            s_mawb,
            s_mawb_post,
            s_airline_code,
            s_flight_number,
            s_flight_serial,
            d_arrival_date,
            s_origin,
            s_destination,
            f_weight,
            s_weight_type,
            s_pieces_type,
            i_actual_piece_count,
            i_pieces_total,
            s_commodity,
            s_uld,
            d_do_not_count_date,
            d_first_free_day,
            d_second_free_day,
            d_storage_start_day,
            f_daily_storage_rate,
            s_arrival_weekday,
            s_message_type,
            t_created            
        ];

        for (let i = 0; i < checkArray.length; i++) {
            if (checkArray[i] && checkArray[i] !== null && checkArray[i].length < 1) {
                checkArrayValid = false;
            }
        }

        return checkArrayValid && validMawbPost() && validMawbPrefix() && validFlightSerial();
        
    }

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Col md='auto' lg='auto' className='px-3 py-3'>
                        <Row>
                            <h1>Import Transfers</h1>
                        </Row>
                        <Row>
                            <Table>
                                <thead>

                                </thead>
                                <tbody>
                                    <tr style={{fontSize: `${width < 1725 ? '14px' : '18px'}`}}>
                                        <td>Flight Date</td>
                                        <td><input type='date' value={moment(d_arrival_date).format('YYYY-MM-DD')} onChange={(e) => set_d_arrival_date(e.target.value)} style={{border: resolveBorder(d_arrival_date)}} /></td>
                                        <td>Destination</td>
                                        <td><input type='text' value={s_destination} /></td>
                                        <td>Origin</td>
                                        <td><input type='text' value={s_origin} onChange={(e) => set_s_origin(e.target.value)} style={{border: resolveBorder(s_origin)}} /></td>
                                        <td>Flight Serial</td>
                                        <td><input type='number' value={s_flight_serial} onChange={(e) => set_s_flight_serial(e.target.value)} style={{border: `${validFlightSerial() ? 'none' : '2px solid red'}`}} /></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Row>
                        <Row style={{height: '620px', overflowY: 'scroll'}}>
                            <Table striped style={{fontSize: '16px'}}>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>MAWB Prefix</td>
                                        <td>MAWB Post</td>
                                        <td>Actual Piece Count</td>
                                        <td>Pieces Total</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type='number' value={s_mawb_prefix} onChange={(e) => set_s_mawb_prefix(e.target.value)} style={{border: `${validMawbPrefix() ? 'none' : '2px solid red'}`}} />
                                        </td>
                                        <td>
                                            <input type='number' value={s_mawb_post} onChange={(e) => set_s_mawb_post(e.target.value)} style={{border: `${validMawbPost() ? 'none' : '2px solid red'}`}} />
                                        </td>
                                        <td>
                                            <input type='number' value={i_actual_piece_count} onChange={(e) => set_i_actual_piece_count(e.target.value)} style={{border: resolveBorder(i_actual_piece_count)}} />
                                        </td>
                                        <td>
                                            <input type='number' value={i_pieces_total} onChange={(e) => set_i_pieces_total(e.target.value)} style={{border: resolveBorder(i_pieces_total)}} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Pieces Type</td>
                                        <td>Weight</td>
                                        <td>Commodity</td>
                                        <td>Origin</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type='text' value={s_pieces_type} onChange={(e) => set_s_pieces_type(e.target.value)} style={{border: resolveBorder(s_pieces_type)}} />
                                        </td>
                                        <td>
                                            <input type='number' value={f_weight} onChange={(e) => set_f_weight(e.target.value)} style={{border: resolveBorder(f_weight)}} />
                                        </td>
                                        <td>
                                            <input type='text' value={s_commodity} onChange={(e) => set_s_commodity(e.target.value)} style={{border: resolveBorder(s_commodity)}} />
                                        </td>
                                        <td>
                                            <p>{s_origin}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>POL</td>
                                        <td>POU</td>
                                        <td>SHC1</td>
                                        <td>SHC2</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type='text' value={s_pol} onChange={(e) => set_s_pol(e.target.value)} />
                                        </td>
                                        <td>
                                            <input type='text' value={s_pou} onChange={(e) => set_s_pou(e.target.value)} />
                                        </td>
                                        <td>
                                            <input type='text' value={s_shc1} onChange={(e) => set_s_shc1(e.target.value)} />
                                        </td>
                                        <td>
                                            <input type='text' value={s_shc2} onChange={(e) => set_s_shc2(e.target.value)} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>SHC3</td>
                                        <td>SHC4</td>
                                        <td>SHC5</td>
                                        <td>ULD Type</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type='text' value={s_shc3} onChange={(e) => set_s_shc3(e.target.value)} />
                                        </td>
                                        <td>
                                            <input type='text' value={s_shc4} onChange={(e) => set_s_shc4(e.target.value)} />
                                        </td>
                                        <td>
                                            <input type='text' value={s_shc5} onChange={(e) => set_s_shc5(e.target.value)} />
                                        </td>
                                        <td>
                                            <input type='text' value={s_uld_type} onChange={(e) => set_s_uld_type(e.target.value)} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>ULD Number</td>
                                        <td>ULD Code</td>
                                        <td>ULD</td>
                                        <td>Volume</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type='text' value={s_uld_number} onChange={(e) => set_s_uld_number(e.target.value)} style={{border: resolveBorder(s_uld_number)}} />
                                        </td>
                                        <td>
                                            <input type='text' value={s_uld_code} onChange={(e) => set_s_uld_code(e.target.value)} />
                                        </td>
                                        <td>
                                            <p>{s_uld}</p>
                                        </td>
                                        <td>
                                            <input type='number' value={s_volume} onChange={(e) => set_s_volume(e.target.value)} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Arrival Date</td>
                                        <td>Do not Count Date</td>
                                        <td>First Free Day</td>
                                        <td>Second Free Day</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>{moment(d_arrival_date).format('MM/DD/YYYY')}</p>
                                        </td>
                                        <td>
                                            <p>{moment(d_do_not_count_date).format('MM/DD/YYYY')}</p>
                                        </td>
                                        <td>
                                            <p>{moment(d_first_free_day).format('MM/DD/YYYY')}</p>
                                        </td>
                                        <td>
                                            <p>{moment(d_second_free_day).format('MM/DD/YYYY')}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Storage Start Day</td>
                                        <td>Daily Storage Rate</td>
                                        <td>Airline Code</td>
                                        <td>Arrival Weekday</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>{moment(d_storage_start_day).format('MM/DD/YYYY')}</p>
                                        </td>
                                        <td>
                                            <p>{f_daily_storage_rate}</p>
                                        </td>
                                        <td>
                                            <p>{s_airline_code}</p>
                                        </td>
                                        <td>
                                            <p>{s_arrival_weekday}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Created By</td>
                                        <td>Destination</td>
                                        <td>Flight Number</td>
                                        <td>Flight Id</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>{s_created_by}</p>
                                        </td>
                                        <td>
                                            <p>{s_destination}</p>
                                        </td>
                                        <td>
                                            <p>{s_flight_number}</p>
                                        </td>
                                        <td>
                                            <p>{s_flight_id}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Flight Serial</td>
                                        <td>MAWB</td>
                                        <td>Message Type</td>
                                        <td>Modified By</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>{s_flight_serial}</p>
                                        </td>
                                        <td>
                                            <p>{s_mawb}</p>
                                        </td>
                                        <td>
                                            <p>{s_message_type}</p>
                                        </td>
                                        <td>
                                            <p>{s_modified_by}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Notes</td>
                                        <td>Pieces</td>
                                        <td>Special Handling Code</td>
                                        <td>Status</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type='text' value={s_notes} onChange={(e) => set_s_notes(e.target.value)} />
                                        </td>
                                        <td>
                                            <p>{s_pieces}</p>
                                        </td>
                                        <td>
                                            <input type='text' value={s_special_handling_code} onChange={(e) => set_s_special_handling_code(e.target.value)} />
                                        </td>
                                        <td>
                                            <p>{s_status}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Type</td>
                                        <td>Unique</td>
                                        <td>Weight Type</td>
                                        <td>Created</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>{s_type}</p>
                                        </td>
                                        <td>
                                            <p>{s_unique}</p>
                                        </td>
                                        <td>
                                            <p>{s_weight_type}</p>
                                        </td>
                                        <td>
                                            <p>{t_created}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Modified</td>
                                        <td>CS ID</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>{t_modified}</p>
                                        </td>
                                        <td>
                                            <p>{s_cs_id}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Row>
                        <Row>
                            <Button className='text-right' color='primary' disabled={!enableSubmit()} onClick={(e) => submit()}>Submit</Button>
                        </Row>
                    </Col>  
                </div>  
            </div>



        </AppLayout>
    );
}

export default withRouter(ImportTransfers);