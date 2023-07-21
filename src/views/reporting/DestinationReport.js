import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import { Table, Button, Input, Card, CardBody, Breadcrumb, BreadcrumbItem, Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import Clipboard from 'react-clipboard.js';

import AppLayout from '../../components/AppLayout';


const DestinationReport = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, eightyWindow, width, createSuccessNotification
}) => {

    const [s_airline_code, set_s_airline_code] = useState('');
    const [s_flight_serial, set_s_flight_serial] = useState('');
    const [d_arrival_date, set_d_arrival_date] = useState('');
    const [reportData, setReportData] = useState([]);
    const [flights, setFlights] = useState([]);
    const [s_flight_id, set_s_flight_id] = useState('');

    const destinationReportFlights = () => {
        const s_pou = user && user.s_unit && user.s_unit.substr(1, 3);

        axios.post(`${baseApiUrl}/destinationReportFlights`, {
            d_arrival_date,
            s_pou
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            console.log(response.data);
            setFlights(response.data);
        }).catch(error => {

        });

    }

    useEffect(() => {
        if (user && user.s_unit && user.s_unit !== null) {
            destinationReportFlights();
        }
    }, [d_arrival_date, user]);

    const search = () => {
        const s_unit = user && user.s_unit;
        axios.post(`${baseApiUrl}/destinationReport`, {
            s_flight_id,
            s_unit
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setReportData(response.data);
        }).catch(error => {

        });
    }

    useEffect(() => {
        if (user && user.s_unit && user.s_unit !== null) {
            search();
        }
    }, [s_flight_id]);

    const formatCost = (cost) => {
        const toFormat = cost && cost !== null && cost > 0 ? parseFloat(cost) : 0;
        return `${toFormat.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md='12' lg='12' className='py-4 px-4'>
                            <Row>
                                <Col md='4' lg='4'>
                                    <h1>Destination Report</h1>
                                </Col>
                            </Row>
                            <Row className='mt-2'>

                                <div className={`mb-3 ${eightyWindow() ? 'col-12' : 'col-3'}`}>
                                    <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                                        <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                                            <Row>
                                                <h4 className='pr-3'>Select Date: </h4>
                                                <input type='date' onChange={(e) => set_d_arrival_date(e.target.value)} style={{display: 'inline'}} />
                                            </Row>
                                            <Row className='mt-4'>
                                                <Table className={'table-row-hover'}>
                                                    <thead>

                                                    </thead>
                                                    <tbody>
                                                    {
                                                        d_arrival_date !== '' && flights.length === 0 ? 
                                                        <h4>No flights found.</h4> : 
                                                        flights.map((f, i) => 
                                                            <tr key={i} onClick={() => set_s_flight_id(f.s_flight_id)}  className={s_flight_id === f.s_flight_id ? 'table-row-selected' : ''}>
                                                                <td>
                                                                    <img src={f.logo_url} style={{width: '170px', height: 'auto'}} />
                                                                </td>
                                                                <td>
                                                                    <h1>{f.s_flight_number}</h1>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                    </tbody>
                                                </Table>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </div>

                                <div className={`mb-3 ${eightyWindow() ? 'col-12' : 'col-7'}`}>
                                    <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                                        <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                                            <Table striped id='copyTable' className='mb-0' style={{tableLayout: 'fixed', textAlign: 'center'}}>
                                                <thead>
                                                    <tr className='table-primary'>
                                                        <th width='20%' className='pl-5'>POU</th>
                                                        <th width='20%'>Destination</th>
                                                        <th width='20%'>Distinct Count of AWB</th>
                                                        <th width='20%'>% of TTL</th>
                                                        <th width='20%'>Weight Sum</th>
                                                    </tr>
                                                </thead>    
                                                <tbody>
                                                    {
                                                        reportData.map((d, i) => 
                                                            <tr key={i}>
                                                                <td width='20%' className='pl-5'>{d.s_pou}</td>
                                                                <td width='20%'>{d.s_destination}</td>
                                                                <td width='20%'>{d.distinct_awb}</td>
                                                                <td width='20%'>{parseFloat(d.percentage).toFixed(2)}%</td>
                                                                <td width='20%'>{formatCost(d.weight)}</td>
                                                            </tr>
                                                        )
                                                    }
                                                    {
                                                        reportData.length > 0 &&
                                                        <tr className='table-info'>
                                                            <th className='pl-5' colspan="2">Grand Total</th>
                                                            <th>{reportData[0].total_awbs}</th>
                                                            <th>100%</th>
                                                            <th>{formatCost(reportData[0].total_weight)}</th>
                                                        </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <Clipboard data-clipboard-target="#copyTable" button-title="Copy Table" className='btn btn-success ml-3 mt-3'>
                                                Copy
                                            </Clipboard>                      
                                        </CardBody>
                                    </Card>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>



        </AppLayout>
    );
}

export default withRouter(DestinationReport);