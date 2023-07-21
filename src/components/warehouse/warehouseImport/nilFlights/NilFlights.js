import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import "rc-switch/assets/index.css";

import {Button, Row, Col, Table, Card, CardBody, CardTitle, CardText} from 'reactstrap';
import ReactTable from '../../../custom/ReactTable';

const NilFlights = ({
    user, baseApiUrl, headerAuthCode,
}) => {

    const [s_pou, set_s_pou] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [d_arrival_date, set_d_arrival_date] = useState(moment().format('YYYY-MM-DD'));
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
        const email = user && user.name; 
        const s_unit = user && user.s_unit;

        s_unit && set_s_pou(s_unit.substr(1, 3));
        email && setUserEmail(email);
    }, [user]);

    useEffect(() => {
        selectNilUlds();
    }, [d_arrival_date]);

    return (
        <Row className='px-2'>
            <Col md='12' lg='12'>
                <div className='row py-2' style={{fontSize: '16px'}}>
                    <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                        <CardBody className='custom-card-transparent py-3' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                            <Row>
                                <h4 className='pr-3' style={{display: 'inline'}}>Select Date:</h4>
                                <input type='date' value={d_arrival_date} onChange={(e) => set_d_arrival_date(e.target.value)} style={{width: '200px', display: 'inline'}} />
                            </Row>
                            <Row className='mt-4'>
                                <Col md={12}>
                                    <ReactTable 
                                        data={nilUlds}
                                        mapping={[
                                            {
                                                name: 'Airline',
                                                value: 's_airline_code'
                                            },
                                            {
                                                name: 'Flight',
                                                value: 's_flight_serial'
                                            },
                                            {
                                                name: 'Reported On',
                                                value: 't_created',
                                                datetime: true,
                                                utc: true
                                            }
                                        ]}
                                        numRows={10}
                                    />
                                </Col>                                
                            </Row>
                        </CardBody>
                    </Card>
                </div>
            </Col>
        </Row>
    );
}

export default withRouter(NilFlights);