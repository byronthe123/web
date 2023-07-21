import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/index';
import {NavLink} from 'react-router-dom';
import { Nav, NavItem, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import _ from 'lodash';

import useCompanyData from '../../components/import/notify/useCompanyData';
import Layout from '../../components/custom/Layout';
import NotifyTab from '../../components/import/notify/NotifyTab';
import LogTab from '../../components/import/notify/LogTab';
import ManageNotificationData from '../../components/import/notify/ManageNotificationData';
import Rejections from '../../components/import/notify/Rejections';

export default function Notify ({
    user, baseApiUrl, headerAuthCode, createSuccessNotification, eightyWindow
}) {

    const { searchAwb } = useContext(AppContext);
    const { handleSearchAwb } = searchAwb;
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [activeFirstTab, setActiveFirstTab] = useState('1');
    const [runLogQuery, setRunLogQuery] = useState(false);

    const { 
        companyData,
        setCompanyData,
        emailData,
        setEmailData,
        phoneData,
        setPhoneData,
        blacklist
    } = useCompanyData(_.get(user, 's_unit', null));

    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
            if (tab === '2') {
                setRunLogQuery(true);
            }
        }   
    }

    return (
        <Layout> 
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
                        <h6>Notify</h6>
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
                        <h6>Notification Log</h6>
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
                        <h6>Profiles</h6>
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
                        <h6>Rejections</h6>
                    </NavLink>
                </NavItem>
            </Nav>

            <TabContent activeTab={activeFirstTab} className='mt-2'>
                
                <TabPane tabId="1">
                    <NotifyTab 
                        user={user}
                        baseApiUrl={baseApiUrl}
                        headerAuthCode={headerAuthCode}
                        createSuccessNotification={createSuccessNotification}
                        selectedCompany={selectedCompany}
                        setSelectedCompany={setSelectedCompany}
                        companyData={companyData}
                        setCompanyData={setCompanyData}
                        emailData={emailData}
                        setEmailData={setEmailData}
                        phoneData={phoneData}
                        setPhoneData={setPhoneData}
                        blacklist={blacklist}
                        handleSearchAwb={handleSearchAwb}
                    />
                </TabPane>

                <TabPane tabId="2">
                    <LogTab 
                        user={user}
                        baseApiUrl={baseApiUrl}
                        headerAuthCode={headerAuthCode}
                        runLogQuery={runLogQuery}
                        createSuccessNotification={createSuccessNotification}
                    />
                </TabPane>

                <TabPane tabId="3">
                    <ManageNotificationData 
                        user={user}
                        companyData={companyData}
                        setCompanyData={setCompanyData}
                        emailData={emailData}
                        setEmailData={setEmailData}
                        phoneData={phoneData}
                        setPhoneData={setPhoneData}
                        selectedCompany={selectedCompany}
                        setSelectedCompany={setSelectedCompany}
                        fwbData={null}
                        blacklist={blacklist}
                        wizardNext={false}
                        onClickNext={() => {}}                    
                    />
                </TabPane>

                <TabPane tabId={'4'}>
                    <Rejections user={user} />
                </TabPane>

            </TabContent>
        </Layout>
    );
}
