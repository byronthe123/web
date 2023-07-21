import React, { useState, useEffect, useRef  } from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import classnames from "classnames";

import AppLayout from '../../components/AppLayout';
import CreateUpdate from '../../components/managers/manageReadingSigns/CreateUpdate';
import Assign from '../../components/managers/manageReadingSigns/Assign';
import { asyncHandler } from '../../utils';
import Overview from '../../components/managers/manageReadingSigns/Overview';

const ManageReadingSigns = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, eightyWindow, width, createSuccessNotification
}) => {

    const [activeFirstTab, setActiveFirstTab] = useState('1');
    const toggleTab = (tab) => setActiveFirstTab(tab);

    const [readingSigns, setReadingSigns] = useState([]);
    const [readingSignRecords, setReadingSignRecords] = useState([]);

    const getReadingSignsData = asyncHandler(async() => {
        const res = await axios.post(`${baseApiUrl}/getReadingSignsData`, {
            data: {
                units: user.authorizedUnits
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        const { readingSigns, readingSignRecords } = res.data;

        setReadingSigns(readingSigns);
        setReadingSignRecords(readingSignRecords);

        console.log(res.data);
    });

    const [employees, setEmployees] = useState([]);
    const [employeesQuery, setEmployeesQuery] = useState(false);
    const getEmployeesForReadingSign = asyncHandler(async() => {
        const res = await axios.post(`${baseApiUrl}/getEmployeesForReadingSign`, {
            data: {
                units: user.authorizedUnits
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        const users = res.data;

        for (let i = 0; i < users.length; i++) {
            users[i].selected = false;
        }

        setEmployees(users);
        setEmployeesQuery(true);
    }); 

    useEffect(() => {
        if (user && user.s_unit) {
            getReadingSignsData();
            if (!employeesQuery && activeFirstTab === '2') {
                getEmployeesForReadingSign();
            }
        }
    }, [user.s_unit, employeesQuery, activeFirstTab]);

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md='12' lg='12'>
                            <Row>
                                <h1 className='pl-3' style={{position: 'relative', top: '6px'}}>Manage Read and Signs</h1>
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
                                            Overview
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
                                            Assign
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
                                            Create/Update
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent activeTab={activeFirstTab} className='mt-2'>
                                <TabPane tabId="1">
                                    <Overview 
                                        readingSigns={readingSigns}
                                        readingSignRecords={readingSignRecords}
                                    />
                                </TabPane>
                                <TabPane tabId={'2'}>
                                    <Assign 
                                        employees={employees}
                                        setEmployees={setEmployees}
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        user={user}
                                        readingSigns={readingSigns}
                                        readingSignRecords={readingSignRecords}
                                        setReadingSignRecords={setReadingSignRecords}
                                        createSuccessNotification={createSuccessNotification}
                                    />
                                </TabPane>
                                <TabPane tabId={'3'}>
                                    <CreateUpdate 
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        user={user}
                                        readingSigns={readingSigns}
                                        setReadingSigns={setReadingSigns}
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

export default withRouter(ManageReadingSigns);