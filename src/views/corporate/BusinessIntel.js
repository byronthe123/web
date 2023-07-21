import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Nav, NavItem, TabContent, TabPane, Row, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import AppLayout from '../../components/AppLayout';
import DataPull from '../../components/corporate/businessIntel/DataPull';

const Corporate = ({
    user,
    authButtonMethod,
    isAuthenticated,
    baseApiUrl,
    headerAuthCode,
    promptUserLocation,
    selectUserLocation,
    setUserLocation,
    saveUserLocation,
    launchModalChangeLocation,
    displaySubmenu,
    handleDisplaySubmenu,
    eightyWindow,
    width,
    createSuccessNotification,
}) => {
    const [activeFirstTab, setActiveFirstTab] = useState('1');
    const history = useHistory();

    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }
    };

    const accessUsers = [
        'byron@choice.aero',
        'mozart@choice.aero',
        'kwang@choice.aero',
        'hdq@choice.aero',
        'masheer@choice.aero',
        'yleong@choice.aero',
        'frank@choice.aero'
    ];

    const checkAccess = () => {
        return (
            user &&
            user.s_email &&
            accessUsers.indexOf(user.s_email.toLowerCase()) !== -1
        );
    };

    useEffect(() => {
        if (user && user.s_email) {
            if (!checkAccess()) {
                history.push('/');
            }
        }
    }, [user]);

    return (
        <AppLayout>
            <div
                className={`card queue-card-container`}
                style={{
                    backgroundColor: '#f8f8f8',
                    height: 'calc(100vh - 120px)',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                }}
            >
                <div className="card-body mb-5 px-1 py-1">
                    <Row className="px-3 py-3">
                        <Col md="12" lg="12">
                            <Row>
                                <h1
                                    className="pl-3"
                                    style={{ position: 'relative', top: '6px' }}
                                >
                                    Corporate
                                </h1>
                            </Row>

                            <Row className="mt-2">
                                <Col mg="12" lg="12">
                                    <Nav
                                        tabs
                                        className="separator-tabs ml-0 mb-2"
                                    >
                                        <NavItem>
                                            <NavLink
                                                location={{}}
                                                to="#"
                                                className={classnames({
                                                    active:
                                                        activeFirstTab === '1',
                                                    'nav-link': true,
                                                })}
                                                onClick={() => {
                                                    toggleTab('1');
                                                }}
                                            >
                                                Data Pull
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                location={{}}
                                                to="#"
                                                className={classnames({
                                                    active:
                                                        activeFirstTab === '2',
                                                    'nav-link': true,
                                                })}
                                                onClick={() => {
                                                    toggleTab('2');
                                                }}
                                            ></NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent
                                activeTab={activeFirstTab}
                                className="mt-2"
                            >
                                <TabPane tabId="1">
                                    <DataPull />
                                </TabPane>
                                <TabPane tabId="2"></TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </div>
            </div>
        </AppLayout>
    );
};

export default withRouter(Corporate);
