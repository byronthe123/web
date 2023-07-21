import React, { useState, useEffect, useContext  } from 'react';
import { AppContext } from '../../context';
import {withRouter, NavLink} from 'react-router-dom';
import axios from 'axios';
import { Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import classnames from "classnames";
import { updateLocalValue, addLocalValue, asyncHandler, deleteLocalValue } from '../../utils';

import AppLayout from '../../components/AppLayout';

import Stations from '../../components/corporate/companyProfiles/stations/Stations';
import ManageRack from '../../components/corporate/companyProfiles/manageRack/index';
import StationCustomers from '../../components/corporate/companyProfiles/stationCustomers/StationCustomers';
import Airlines from '../../components/corporate/companyProfiles/airlines/Airlines';
import AceCbp from '../../components/corporate/companyProfiles/aceCbp';
import SpecialHandlingCodes from '../../components/corporate/companyProfiles/specialHandlingCodes';
import Charges from '../../components/corporate/companyProfiles/charges';
import Airports from '../../components/corporate/airports';

const CompanyProfiles = ({
    baseApiUrl, headerAuthCode, eightyWindow
}) => {

    const { user, appData: {stations}, createSuccessNotification } = useContext(AppContext);
    const [activeFirstTab, setActiveFirstTab] = useState('1');
    const [airlines, setAirlines] = useState([]);

    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    useEffect(() => {
        const selectAllAirlines = async () => {
            try {
                const response = await axios.get(`${baseApiUrl}/selectAllAirlines`, {
                    headers: {
                        Authorization: `Bearer ${headerAuthCode}`
                    }
                });
    
                if (response.status === 200) {
                    setAirlines(response.data);
                }
            } catch (err) {
                alert(err);
            }
        }
        if (user) {
            selectAllAirlines();
        }
    }, [user]);

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md='12' lg='12'>
                            <Row>
                                <h1 className='pl-3' style={{position: 'relative', top: '6px'}}>Company Profiles</h1>
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
                                            Stations
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
                                            Station Racks
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
                                            Station Customers
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
                                            Airlines
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "aceCbp",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("aceCbp");
                                            }}
                                            >
                                            ACE CBP
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "shcs",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("shcs");
                                            }}
                                            >
                                            SHCs
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "charges",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("charges");
                                            }}
                                            >
                                            Charges
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "airports",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("airports");
                                            }}
                                            >
                                            Airports
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent activeTab={activeFirstTab} className='mt-2'>
                                <TabPane tabId="1">
                                    <Stations 
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        user={user}
                                        eightyWindow={eightyWindow}
                                        activeTabId={activeFirstTab}
                                        tabId={'1'}                             
                                    />
                                </TabPane>
                                <TabPane tabId="2">
                                    <ManageRack 
                                        user={user}
                                        stations={stations}
                                        activeFirstTab={activeFirstTab}                            
                                    />
                                </TabPane>
                                <TabPane tabId="3">
                                    <StationCustomers 
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        user={user}
                                        eightyWindow={eightyWindow}  
                                        airlines={airlines}                        
                                    />
                                </TabPane>
                                <TabPane tabId={'4'}>
                                    <Airlines 
                                        airlines={airlines}
                                        setAirlines={setAirlines}
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        user={user}
                                        eightyWindow={eightyWindow}
                                        updateLocalValue={updateLocalValue}
                                        addLocalValue={addLocalValue}
                                        asyncHandler={asyncHandler}
                                        deleteLocalValue={deleteLocalValue}
                                    />
                                </TabPane>
                                <TabPane tabId={'aceCbp'}>
                                    <AceCbp 
                                        activeTabId={activeFirstTab}
                                        tabId={'aceCbp'}
                                    />
                                </TabPane>
                                <TabPane tabId={'shcs'}>
                                    <SpecialHandlingCodes 
                                        activeTabId={activeFirstTab}
                                        tabId={'shcs'}
                                        user={user}
                                    />
                                </TabPane>
                                <TabPane tabId={'charges'}>
                                    <Charges 
                                        activeTabId={activeFirstTab}
                                        tabId={'charges'}
                                        user={user}
                                        stations={stations}
                                    />
                                </TabPane>
                                <TabPane tabId={'airports'}>
                                    <Airports 
                                        activeTabId={activeFirstTab}
                                        tabId={'airports'}
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

export default withRouter(CompanyProfiles);