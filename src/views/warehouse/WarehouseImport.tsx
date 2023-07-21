import React, { useState, useContext, useMemo } from 'react';
import {withRouter} from 'react-router-dom';
import { Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { AppContext } from '../../context';

import AppLayout from '../../components/AppLayout';
import AcceptUld from '../../components/warehouse/warehouseImport/acceptUld/AcceptUld';
import NilFlights from '../../components/warehouse/warehouseImport/nilFlights/NilFlights';
import WarehouseBreakdown from '../../components/warehouse/warehouseImport/warehouseBreakdown/WarehouseBreakdown';
import useLoading from '../../customHooks/useLoading';
import useBreakpoint from '../../customHooks/useBreakpoint';

const WarehouseImport = () => {

    const {
        user
    } = useContext(AppContext);

    const { setLoading } = useLoading();
    const { breakpoint } = useBreakpoint();

    const s_pou = useMemo(() => {
        return (user.s_unit || '').substring(1, 4);
    }, [user.s_unit]);

    const [activeFirstTab, setActiveFirstTab] = useState('1');
    
    const toggleTab = (tab: string) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md='12' lg='12'>
                            <Row>
                                <h1 className='pl-3' style={{position: 'relative', top: '6px'}}>Warehouse Import</h1>
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
                                            Accept ULD
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
                                            Breakdown
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
                                            Nil Flights
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent activeTab={activeFirstTab} className='mt-2'>
                                <TabPane tabId="1">
                                    <AcceptUld 
                                        user={user}
                                        s_pou={s_pou}
                                        breakpoint={breakpoint}                         
                                    />
                                </TabPane>
                                <TabPane tabId="2">
                                    <WarehouseBreakdown 
                                        user={user}
                                        s_pou={s_pou}
                                        setLoading={setLoading}    
                                        breakpoint={breakpoint}                      
                                    />
                                </TabPane>
                                <TabPane tabId="3">
                                    <NilFlights 
                                        user={user}
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

export default withRouter(WarehouseImport);