import React, { useState, useEffect, useContext  } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import { AppContext } from '../../context';
import AppLayout from '../../components/AppLayout';

const SiteMap = () => {

    const { accessMap } = useContext(AppContext);

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md={12}>
                            {
                                Object.keys(accessMap).map(tabId => accessMap[tabId].label && (
                                    <div className={'mb-5'}>
                                        {
                                            <div key={tabId}>
                                                <p className='mb-0'>
                                                    <h1 className='mb-0 pb-0'>{accessMap[tabId].label}</h1>
                                                </p>
                                                <hr />
                                            </div>
                                        }
                                        {
                                            accessMap[tabId].subs && Object.keys(accessMap[tabId].subs).map(subId => (
                                                <div>
                                                    <h3 key={subId}>
                                                        {
                                                            (accessMap[tabId].subs[subId].subs === undefined || Object.keys(accessMap[tabId].subs[subId].subs).length === 0) ? 
                                                                <NavLink
                                                                    to={accessMap[tabId].subs[subId].to}
                                                                >
                                                                    {accessMap[tabId].subs[subId].label}
                                                                </NavLink> :
                                                                <span style={{ fontStyle: 'italic' }}>
                                                                    {
                                                                        accessMap[tabId].subs[subId].label
                                                                    }
                                                                </span>
                                                                
                                                        }
                                                    </h3>
                                                    {
                                                        accessMap[tabId].subs[subId].subs && Object.keys(accessMap[tabId].subs[subId].subs).map(finalSubId => (
                                                            <h5 className={'pl-4'}>
                                                                <NavLink
                                                                    to={accessMap[tabId].subs[subId].subs[finalSubId].to}
                                                                >
                                                                    {accessMap[tabId].subs[subId].subs[finalSubId].label}
                                                                </NavLink>
                                                            </h5>
                                                        ))
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                ))
                            }
                        </Col>
                    </Row>
                </div>
            </div>
        </AppLayout>
    );
}

export default withRouter(SiteMap);