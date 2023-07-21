import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/index';
import { withRouter } from 'react-router-dom';
import { Nav, NavItem, TabContent, TabPane, Row, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import AppLayout from '../../components/AppLayout';
import Profile from '../../components/portal/Profile';
import ToDoList from '../../components/portal/ToDoList';

const baseApiUrl = process.env.REACT_APP_BASE_API_URL;
const headerAuthCode = process.env.REACT_APP_HEADER_AUTH_CODE;

const Portal = () => {
    const {
        user,
        appData: { readingSigns, setReadingSigns, updates },
        createSuccessNotification,
    } = useContext(AppContext);

    const [activeFirstTab, setActiveFirstTab] = useState('1');

    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }
    };

    const test = () => {
        const error = new Error('test');
        throw error;
    };

    const ButtonComponent = () => {
        throw Error('error!');
        return <></>;
    };

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
                    <Row className="px-3 py-3" data-testid={'view-portal'}>
                        <Col md="12" lg="12">
                            <Row>
                                <h1
                                    className="pl-3"
                                    style={{ position: 'relative', top: '6px' }}
                                    data-testid={'text-display-name'}
                                >
                                    Welcome {user && user.displayName}
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
                                                Profile
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
                                            >
                                                To Do
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent
                                activeTab={activeFirstTab}
                                className="mt-2"
                            >
                                <TabPane tabId="1">
                                    <Profile
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        user={user}
                                        createSuccessNotification={
                                            createSuccessNotification
                                        }
                                        updates={updates}
                                        readingSigns={readingSigns}
                                        setReadingSigns={setReadingSigns}
                                    />
                                </TabPane>
                                <TabPane tabId="2">
                                    <ToDoList
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        user={user}
                                        createSuccessNotification={
                                            createSuccessNotification
                                        }
                                    />
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* <DynamicModal /> */}
        </AppLayout>
    );
};

export default withRouter(Portal);
