import React, { useState, useEffect, useContext  } from 'react';
import { AppContext } from '../../context';
import {withRouter, NavLink} from 'react-router-dom';
import { Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import classnames from "classnames";
import { motion, AnimatePresence } from 'framer-motion';
import { api, asyncHandler, formatDatetime, getDate, getTsDate, updateLocalValue } from '../../utils';

import AppLayout from '../../components/AppLayout';

import Updates from '../../components/dev/Updates';
import WebcamCapture from '../../components/dev/WebcamCapture';
import BlobFiles from '../../components/dev/BlobFiles';
import FormRecognize from '../../components/dev/FormRecognize';
import Wiki from '../../components/dev/Wiki';
import DragDrop from '../../components/dev/DragDrop';
import Comms from '../../components/dev/Comms';
import Emails from '../../components/dev/emails/index';
import CargoSprintApi from '../../components/dev/CargoSprintApi';
import IacCcsf from '../../components/dev/iacCcsf';
import EmailsQueue from '../../components/dev/emailsQueue';
import CsApi from '../../components/dev/csApi';
import Location from '../../components/dev/Location';
import AccessRecord from '../../components/dev/AccessRecord';
import ManageCache from '../../components/dev/manageCache';
import DynamicSidebar from '../../components/dev/dynamicSidebar';
import GoTo from '../../components/dev/goto';
import _ from 'lodash';
import Log from '../../components/dev/log';
import Card from '../../components/custom/Card';
import ManageChangeLog from '../../components/ManageChangeLog';
import WorkItems from '../../components/dev/workItems';

const DevMain = () => {

    const { user, baseApiUrl, headerAuthCode, createSuccessNotification, setLoading } = useContext(AppContext);

    const [activeFirstTab, setActiveFirstTab] = useState('-9');
    
    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    useEffect(() => {
        console.log(user);
    }, [user]);

    const [times, setTimes] = useState([]);
    const [layoutId, setLayoutId] = useState();

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{ height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden' }}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md='12' lg='12'>
                            <Row>
                                <h1 className='pl-3' style={{position: 'relative', top: '6px'}}>DEV</h1>
                            </Row>

                            <Row className='mt-2'>
                                <Col mg='12' lg='12'>
                                    <Nav tabs className="separator-tabs ml-0 mb-2">
                                    <NavItem>
                                        <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "logs",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("logs");
                                            }}
                                            >
                                            Logs
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                location={{}}
                                                to="#"
                                                className={classnames({
                                                    active: activeFirstTab === "changeLog",
                                                    "nav-link": true
                                                })}
                                                onClick={() => {
                                                    toggleTab("changeLog");
                                                }}
                                            >
                                                Change Log
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "-8",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("-8");
                                            }}
                                            >
                                            Access Record
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "manageCache",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("manageCache");
                                            }}
                                            >
                                            Manage Cache
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "-7",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("-7");
                                            }}
                                            >
                                            Location
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "-6",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("-6");
                                            }}
                                            >
                                            CS API
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "-5",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("-5");
                                            }}
                                            >
                                            Emails Queue
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "-2",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("-2");
                                            }}
                                            >
                                            CargoSprint Payment JSON
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "-1",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("-1");
                                            }}
                                            >
                                            Emails
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "0",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("0");
                                            }}
                                            >
                                            Comms
                                            </NavLink>
                                        </NavItem>
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
                                            Updates
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
                                            Webcam Capture
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
                                            Blob Files
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "4",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("4");
                                            }}
                                            >
                                            Form Recognize
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                location={{}}
                                                to="#"
                                                className={classnames({
                                                    active: activeFirstTab === "5",
                                                    "nav-link": true
                                                })}
                                                onClick={() => {
                                                    toggleTab("5");
                                                }}
                                            >
                                                Wiki
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                location={{}}
                                                to="#"
                                                className={classnames({
                                                    active: activeFirstTab === "6",
                                                    "nav-link": true
                                                })}
                                                onClick={() => {
                                                    toggleTab("6");
                                                }}
                                            >
                                                Drag Drop
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent activeTab={activeFirstTab} className='mt-2'>
                                <TabPane tabId={'-9'}>
                                    <h1>Landing</h1>
                                    <WorkItems />
                                    {/* <motion.div layoutId={1} onClick={() => setLayoutId(1)}>
                                        <Card>
                                            DATA
                                        </Card>
                                    </motion.div>

                                    <AnimatePresence>
                                        {
                                            layoutId && (
                                                <motion.div layoutId={layoutId}>
                                                    <h1>DATA EXPANDED</h1>
                                                </motion.div>
                                            )
                                        }
                                    </AnimatePresence> */}
                                </TabPane>  
                                <TabPane tabId={'logs'}>
                                    <Log />
                                </TabPane>
                                <TabPane tabId={'changeLog'}>
                                    <ManageChangeLog activeTab={activeFirstTab} />
                                </TabPane>
                                <TabPane tabId={'manageCache'}>
                                    <ManageCache />
                                </TabPane>
                                <TabPane tabId={'-8'}>
                                    <AccessRecord />
                                </TabPane>
                                <TabPane tabId={'-7'}>
                                    <Location />
                                </TabPane>
                                <TabPane tabId={'-6'}>
                                    <CsApi 
                                        tabId={activeFirstTab}
                                    />
                                </TabPane>
                                <TabPane tabId={'-5'}>
                                    <EmailsQueue 
                                        activeFirstTab={activeFirstTab}
                                        setLoading={setLoading}
                                    />
                                </TabPane>
                                <TabPane tabId="-2">
                                    <CargoSprintApi />
                                </TabPane>
                                <TabPane tabId="-1">
                                    <Emails 
                                        tabId={activeFirstTab}
                                    />
                                </TabPane>
                                <TabPane tabId="0">
                                    <Comms 
                                        user={user}
                                    />
                                </TabPane>
                                <TabPane tabId="1">
                                    <Updates 
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        asyncHandler={asyncHandler}
                                        updateLocalValue={updateLocalValue}
                                        user={user}
                                        tabId={activeFirstTab}
                                    />
                                </TabPane>
                                <TabPane tabId="2">
                                    <WebcamCapture
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        asyncHandler={asyncHandler}
                                        updateLocalValue={updateLocalValue}
                                        user={user}
                                    />
                                </TabPane>
                                <TabPane tabId='3'>
                                    <BlobFiles 
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        asyncHandler={asyncHandler}
                                        updateLocalValue={updateLocalValue}
                                        user={user}
                                        activeFirstTab={activeFirstTab}
                                        setLoading={setLoading}
                                    />
                                </TabPane>
                                <TabPane tabId='4'>
                                    <FormRecognize 
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        asyncHandler={asyncHandler}
                                        updateLocalValue={updateLocalValue}
                                        user={user}
                                        activeFirstTab={activeFirstTab}
                                    />
                                </TabPane>
                                <TabPane tabId='5'>
                                    <Wiki 
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        asyncHandler={asyncHandler}
                                        user={user}
                                        createSuccessNotification={createSuccessNotification}
                                    />
                                </TabPane>
                                <TabPane tabId='6'>
                                    <DragDrop 
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        asyncHandler={asyncHandler}
                                        user={user}
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

export default withRouter(DevMain);