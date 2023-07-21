import React, { useState } from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import { Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import classnames from "classnames";

import AppLayout from '../../components/AppLayout';

import CounterMoneyTab from '../../components/managers/counterMoney/CounterMoneyTab';
import CargoSprintPayment from '../../components/managers/counterMoney/CargoSprintPayments';
import { asyncHandler, updateLocalValue, addLocalValue, deleteLocalValue } from '../../utils';

const CounterMoney = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, eightyWindow, width, createSuccessNotification
}) => {

    const [activeFirstTab, setActiveFirstTab] = useState('1');

    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{ height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden' }}>
                <div className="card-body mb-5 px-1 py-1">

                    <Row className='mt-2 mx-2'>
                        <Col mg='12' lg='12'>
                            <Nav tabs className="separator-tabs ml-0 mb-2" style={{ fontSize: '14px' }}>
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
                                    Counter Money
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
                                    Cargo Sprint Payments
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                    </Row>

                    <TabContent activeTab={activeFirstTab} className='mt-2'>
                        <TabPane tabId="1">
                            <CounterMoneyTab 
                                user={user}
                                baseApiUrl={baseApiUrl}
                                headerAuthCode={headerAuthCode}
                                eightyWindow={eightyWindow}
                                createSuccessNotification={createSuccessNotification}   
                                asyncHandler={asyncHandler}
                                updateLocalValue={updateLocalValue}
                                addLocalValue={addLocalValue}
                                deleteLocalValue={deleteLocalValue}                         
                            />
                        </TabPane>
                        <TabPane tabId={'2'}>
                            <CargoSprintPayment 
                                user={user}
                                baseApiUrl={baseApiUrl}
                                headerAuthCode={headerAuthCode}
                                eightyWindow={eightyWindow}
                                createSuccessNotification={createSuccessNotification} 
                                asyncHandler={asyncHandler}
                                updateLocalValue={updateLocalValue}
                                addLocalValue={addLocalValue}
                                deleteLocalValue={deleteLocalValue}                               
                            />
                        </TabPane>
                    </TabContent>

                </div>
            </div>

        </AppLayout>
    );
}

export default withRouter(CounterMoney);