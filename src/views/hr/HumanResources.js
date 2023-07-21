import React, { useState, useEffect, useContext  } from 'react';
import { AppContext } from '../../context';
import {withRouter, NavLink} from 'react-router-dom';
import { Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import classnames from "classnames";
import { asyncHandler, addLocalValue, deleteLocalValue, updateLocalValue, api } from '../../utils';
import { restrictedEmails } from '../../components/adminEmails';

import AppLayout from '../../components/AppLayout';

import Employees from '../../components/hr/Employees'; 
import Access from '../../components/hr/Access';

const HumanResources = ({
    baseApiUrl, headerAuthCode, eightyWindow, 
}) => {

    const { user, appData: {stations}, createSuccessNotification, setLoading } = useContext(AppContext);
    const [activeFirstTab, setActiveFirstTab] = useState('1');
    const [accessLevels, setAccessLevels] = useState([]);
    const [accessTabs, setAccessTabs] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [nativeAccessMapSchema, setNativeAccessMapSchema] = useState({});

    const units = stations.map(s => s.s_unit);

    useEffect(() => {
        if (user) {
            const getAccessData = asyncHandler(async () => {
                const response = await api('get', 'getAccessData');
    
                const { accessLevels, accessTabs, employees, nativeAccessMapSchema } = response.data;
                console.log(response.data);
                setAccessLevels(accessLevels);
                setAccessTabs(accessTabs);
                setEmployees(employees);
                setNativeAccessMapSchema(nativeAccessMapSchema);
            });
            getAccessData();
        }
    }, [user]);

    const getAirlines = asyncHandler(async() => {
        const res = await api('get', 'selectAllAirlines');
        console.log(res.data);
        setAirlines(res.data);
    });
    
    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{ height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md='12' lg='12'>
                            <Row>
                                <h1 className='pl-3' style={{position: 'relative', top: '6px'}}>Human Resources</h1>
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
                                            Internal Users
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
                                            External Users
                                            </NavLink>
                                        </NavItem>
                                        {
                                            restrictedEmails.includes(user && user.s_email && user.s_email.toLowerCase()) &&
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
                                                Access
                                                </NavLink>
                                            </NavItem>
                                        }
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent activeTab={activeFirstTab} className='mt-2'>
                                <TabPane tabId="1">
                                    <Employees 
                                        user={user}
                                        units={units}
                                        employees={employees.filter(e => e.b_internal)}
                                        setEmployees={setEmployees}
                                        accessLevels={accessLevels}
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        eightyWindow={eightyWindow}
                                        createSuccessNotification={createSuccessNotification}  
                                        getAirlines={getAirlines}      
                                        airlines={airlines}    
                                        setLoading={setLoading}     
                                        nativeAccessMapSchema={nativeAccessMapSchema}            
                                    />
                                </TabPane>
                                <TabPane tabId={'2'}>
                                    <Employees 
                                        user={user}
                                        units={units}
                                        employees={employees.filter(e => !e.b_internal)}
                                        setEmployees={setEmployees}
                                        accessLevels={accessLevels}
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        eightyWindow={eightyWindow}
                                        createSuccessNotification={createSuccessNotification}
                                        getAirlines={getAirlines} 
                                        airlines={airlines}
                                        setLoading={setLoading}
                                        nativeAccessMapSchema={nativeAccessMapSchema}                            
                                    />
                                </TabPane>
                                <TabPane tabId={'3'}>
                                    <Access 
                                        user={user}
                                        accessLevels={accessLevels}
                                        setAccessLevels={setAccessLevels}
                                        accessTabs={accessTabs}
                                        asyncHandler={asyncHandler}
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        createSuccessNotification={createSuccessNotification}  
                                        addLocalValue={addLocalValue}
                                        deleteLocalValue={deleteLocalValue}
                                        updateLocalValue={updateLocalValue}
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

export default withRouter(HumanResources);