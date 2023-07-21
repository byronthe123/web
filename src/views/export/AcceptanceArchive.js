import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import { Table, Button, Input, Card, CardBody, Breadcrumb, BreadcrumbItem, Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";

import AppLayout from '../../components/AppLayout';

import AcceptanceSheet from '../../components/export/acceptanceArchive/AcceptanceSheet';
import { useAppContext } from '../../context';

const AcceptanceArchive = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, eightyWindow, width, createSuccessNotification
}) => {
    const [activeFirstTab, setActiveFirstTab] = useState('1');
    const [s_unit, set_s_unit] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    
    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    useEffect(() => {
        const s_unit = user && user.s_unit;
        const email = user && user.s_email; 
        set_s_unit(s_unit);
        setUserEmail(email);
    }, [user]);

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md='12' lg='12'>
                            <Row>
                                <h1 className='pl-3' style={{position: 'relative', top: '6px'}}>Acceptance Archive</h1>
                            </Row>

                            <Row className='mt-2'>
                                <Col mg='12' lg='12'>
                                    <AcceptanceSheet 
                                        s_unit={s_unit}
                                        userEmail={userEmail}
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>



        </AppLayout>
    );
}

export default withRouter(AcceptanceArchive);