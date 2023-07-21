import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";

import {Button, Row, Col, Table, Card, CardBody, CardTitle, CardText} from 'reactstrap';

import AppLayout from '../components/AppLayout';
import ModalConfirmLocation from '../components/ModalConfirmLocation';

const NilFlights = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, eightyWindow, width
}) => {

    const [s_pou, set_s_pou] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [d_arrival_date, set_d_arrival_date] = useState('');
    const [nilUlds, setNilUlds] = useState([]);

    const selectNilUlds = () => {
        axios.post(`${baseApiUrl}/selectNilUlds`, {
            d_arrival_date,
            s_pou
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setNilUlds(response.data);
        }).catch(error => {

        });
    }

    useEffect(() => {
        const s_unit = user && user.s_unit;
        const email = user && user.s_email; 

        s_unit && set_s_pou(s_unit.substr(1, 3));
        email && setUserEmail(email);
    }, [user]);

    useEffect(() => {
        selectNilUlds();
    }, [d_arrival_date]);

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundImage: 'url(/assets/img/bg-misc-1.jpg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md='12' lg='12' className='px-4 py-3'>
                            <Row>
                                <Col md='12' lg='12'>
                                    <Row>
                                        <h1 className='pl-3' style={{position: 'relative', top: '6px'}}>Nil Flights</h1>
                                    </Row>
                                    <Row>
                                        <Col md='12' lg='12'>
                                            <div className='row py-2' style={{fontSize: '16px'}}>
                                                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                                                    <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                                                        <Row>
                                                            <h4 className='pr-3' style={{display: 'inline'}}>Select Date:</h4>
                                                            <input type='date' onChange={(e) => set_d_arrival_date(e.target.value)} style={{width: '200px', display: 'inline'}} />
                                                        </Row>
                                                        <Row className='mt-4'>
                                                            <Table striped>
                                                                <thead className='bg-primary'>
                                                                    <tr>
                                                                        <th>Airline</th>
                                                                        <th>Flight</th>
                                                                        <th>Reported On</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        d_arrival_date !== '' && nilUlds.length === 0 ? 
                                                                        <h4>No results found</h4> : 
                                                                        nilUlds.map((u, i) => 
                                                                            <tr key={i}>
                                                                                <td>{u.s_airline_code}</td>
                                                                                <td>{u.s_flight_serial}</td>
                                                                                <td>{moment(u.t_created).format('MM/DD/YYYY HH:mm:ss')}</td>
                                                                            </tr>
                                                                        )
                                                                    }
                                                                </tbody>
                                                            </Table>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>



        </AppLayout>
    );
}

export default withRouter(NilFlights);