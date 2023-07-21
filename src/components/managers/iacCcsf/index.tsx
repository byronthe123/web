import React, { useState } from 'react';
import styled from 'styled-components';
import { Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import classnames from "classnames";

import Layout from '../../custom/Layout';
import CustomNavItem from '../../custom/CustomNavItem';
import Iac from './Iac';
import Ccsf from './Ccsf';

export default function IacCcsf () {

    const [activeTabId, setActiveTabId] = useState('iac');
    const toggleTab = (tabId: string) => setActiveTabId(tabId);

    return (
        <Layout>
            <Container>
                <h4>Manage IAC/CCSF</h4>
                <Nav tabs className="separator-tabs ml-0 mb-2">
                    <CustomNavItem 
                        tabName='IAC'
                        tabId='iac'
                        activeTabId={activeTabId}
                        toggleTab={toggleTab}
                    />
                    <CustomNavItem 
                        tabName='CCSF'
                        tabId='ccsf'
                        activeTabId={activeTabId}
                        toggleTab={toggleTab}
                    />
                </Nav>
                <TabContent activeTab={activeTabId} className='mt-2'>
                    <TabPane tabId="iac">
                        <Iac 
                            activeTabId={activeTabId}
                        />
                    </TabPane>
                    <TabPane tabId="ccsf">
                        <Ccsf 
                            activeTabId={activeTabId}
                        />
                    </TabPane>
                </TabContent>
            </Container>
        </Layout>
    );
}

const Container = styled.div``;
