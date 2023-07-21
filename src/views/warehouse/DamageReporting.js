import React, { useState, useEffect  } from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import {  Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import classnames from "classnames";

import Add from '../../components/warehouse/damageReporting/Add';
import View from '../../components/warehouse/damageReporting/View';
import Layout from '../../components/custom/Layout';
import { api } from '../../utils';
import useLoading from '../../customHooks/useLoading';

const DamageReporting = ({
    user
}) => {
    
    const { setLoading } = useLoading();
    const [activeFirstTab, setActiveFirstTab] = useState('1');
    const [dataStore, setDataStore] = useState([]);

    useEffect(() => {
        const getVisualReportingData = async (s_unit) => {
            setLoading(true);
            const res = await api('get', `/visualReportingData/${s_unit}`);
            setDataStore(res.data);
            setLoading(false);
        }
        getVisualReportingData(user.s_unit);
    }, [user.s_unit]);

    const appendCreatedRecords = (records) => {
        setDataStore(prev => {
            const combined = [...prev, ...records];
            return combined;
        });
    }

    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    return (
        <Layout>
            <Row className='px-3 py-3'>
                <Col md='12' lg='12'>
                    <Row>
                        <h1 className='pl-3' style={{position: 'relative', top: '6px'}}>Damage Reporting</h1>
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
                                    Add
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
                                    View
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                    </Row>

                    <TabContent activeTab={activeFirstTab} className='mt-2'>
                        <TabPane tabId="1">
                            <Add 
                                user={user} 
                                appendCreatedRecords={appendCreatedRecords}                         
                            />
                        </TabPane>
                        <TabPane tabId='2'>
                            <View
                                user={user}
                                dataStore={dataStore}
                                appendCreatedRecords={appendCreatedRecords}
                            />
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </Layout>
    );
}

export default withRouter(DamageReporting);