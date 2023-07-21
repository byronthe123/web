import React, { useState, useEffect  } from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { Table, Button, Input, Card, CardBody, Breadcrumb, BreadcrumbItem, Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import classnames from "classnames";

import AppLayout from '../../components/AppLayout';

const WarehouseBreakdown = ({
    user, baseApiUrl, headerAuthCode, eightyWindow, createSuccessNotification
}) => {

    const [activeFirstTab, setActiveFirstTab] = useState('1');
    const [s_pou, set_s_pou] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    
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
                                <h1 className='pl-3' style={{position: 'relative', top: '6px'}}>Accept ULD</h1>
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
                                            Locate
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
                                            Unmanifested
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "3",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("3");
                                            }}
                                            >
                                            Close ULD
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent activeTab={activeFirstTab} className='mt-2'>
                                <TabPane tabId="1">
                                    <Locate 
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        userEmail={userEmail}
                                        s_pou={s_pou}
                                        eightyWindow={eightyWindow}
                                        createSuccessNotification={createSuccessNotification}                            
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

export default withRouter(WarehouseBreakdown);