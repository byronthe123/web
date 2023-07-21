import { useState } from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardHeader,
    Nav,
    NavItem,
    TabContent,
    TabPane,
    Button,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import Layout from '../../../components/custom/Layout';
import CustomNavItem from '../../../components/custom/CustomNavItem';
import UldHistory from './History';
import CustomTabPane from '../../../components/custom/CustomTabPane';

export type Tab = 'HISTORY';

export default function ULD() {
    const [activeTabId, setActiveTabId] = useState<Tab>('HISTORY');
    const toggleTab = (tabId: Tab) => setActiveTabId(tabId);

    return (
        <Layout>
            <Nav tabs className="separator-tabs">
                <CustomNavItem<Tab>
                    tabName="History"
                    tabId="HISTORY"
                    activeTabId={activeTabId}
                    toggleTab={toggleTab}
                />
            </Nav>
            <TabContent activeTab={activeTabId} className="mt-2">
                <CustomTabPane<Tab> tabId={'HISTORY'}>
                    <UldHistory />
                </CustomTabPane>
            </TabContent>
        </Layout>
    );
}
