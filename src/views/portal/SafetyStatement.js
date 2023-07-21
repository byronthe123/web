import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import { withRouter, useHistory} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";

import {Form, FormGroup, Label, Input, Button, Row, Col, Table, Card, CardBody, CardTitle, CardText} from 'reactstrap';

import AppLayout from '../../components/AppLayout';

const SafetyStatement = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, eightyWindow, width
}) => {

    const history = useHistory();

    useEffect(() => {
        if (!user.b_internal) {
            history.push('/EOS/Portal/Profile');
        }
    }, []);

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: 'white', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-5 py-3">
                    <Row className='px-3 py-3'>
                        <Col md='12' lg='12'>
                            <Row className='mb-2'>
                                <h1 style={{fontWeight: 'bold'}}>
                                    MANAGEMENT COMMITMENT - Safety Policy Statement
                                </h1>     
                            </Row>
                            <Row className='mb-2'>
                                <h4>
                                    At CHOICE Aviation Services safety is a core value of our stations, where the safety and health of each employee comes first. Personnel and equipment in the aviation industry are often exposed to many hazards. I acknowledge this fact and am personally committed to doing everything possible to eliminate injury and damage in our working environment. The ongoing process of CHOICE Aviation Services' Safety Management System is ultimately the responsibility of CHOICE Aviation Services Management. However, each employee shall cooperate with management to ensure implementation of this program. 
                                </h4>
                            </Row>
                            <Row className='mb-2'>
                                <h4>
                                    The Safety Committee at CHOICE Aviation Services will continue to be proactive to identify risks that may pose injury to personnel, or damage to equipment. To keep these risks to a minimum we will continuously examine our operations on the airport and within its facilities. The management team will respond to incidents, conduct audits, communicate and document our findings, and constantly train all our employees on safety policies. I have appointed a Safety Committee at CHOICE Aviation Services which consists of two (2) people. They are: Vice President of Operations and Vice President of Training.                                
                                </h4>
                            </Row>
                            <Row className='mb-2'>
                                <h4>
                                    As the President, I carry the ultimate responsibility for the Safety Management System. I expect that every employee, contractor, and our customers to be active participants in our Safety Program. Everyone shall use safe practices in their everyday operations and report any discrepancies to his/her Manager. The Safety Committee will be held accountable for recommending and monitoring safer steps for the prevention of incidents and accidents. In addition, no employee will be disciplined for reporting a Safety hazard or incident through our "non-punitive" reporting system. Employees that report these hazards will be recognized and commended by our local stations.                                
                                </h4>
                            </Row>
                            <Row>
                                <h4 style={{fontFamily: 'Kalam, cursive'}}>Manny Casalinho</h4>
                            </Row>
                            <Row>
                                <h4>President</h4>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>

        </AppLayout>
    );
}

export default withRouter(SafetyStatement);