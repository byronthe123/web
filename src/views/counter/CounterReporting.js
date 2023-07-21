import React, { Component, Fragment, useState, useContext  } from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import { AppContext } from '../../context';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import { Table, Button, Input, Card, CardBody, Breadcrumb, BreadcrumbItem, Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import classnames from "classnames";

import AppLayout from '../../components/AppLayout';


import Customers from '../../components/counter/counterReporting/Customers';
import Feedback from '../../components/counter/counterReporting/Feedback';

const CounterReporting = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, eightyWindow, width, createSuccessNotification
}) => {

    const { searchAwb } = useContext(AppContext);
    const { handleSearchAwb } = searchAwb;
    const [activeFirstTab, setActiveFirstTab] = useState('1');

    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md='12' lg='12'>
                            <Row>
                                <h1 className='pl-3' style={{position: 'relative', top: '6px'}}>Counter Reporting</h1>
                            </Row>

                            <Row className='mt-2'>
                                <Col mg='12' lg='12'>
                                    <Nav tabs className="separator-tabs ml-0 mb-2">
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "1",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("1");
                                            }}
                                            >
                                            Customers
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "2",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("2");
                                            }}
                                            >
                                            Customer Feedback
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent activeTab={activeFirstTab} className='mt-2'>
                                <TabPane tabId="1">
                                    <Customers 
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        user={user}
                                        handleSearchAwb={handleSearchAwb}
                                    />
                                </TabPane>
                                <TabPane tabId="2">
                                    <Feedback 
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        eightyWindow={eightyWindow}
                                        user={user}
                                        activeFirstTab={activeFirstTab}
                                    />
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </div>
            </div>



        </AppLayout>
    );
}

export default withRouter(CounterReporting);