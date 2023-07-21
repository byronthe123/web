import { useState } from "react";
import Layout from "../../../components/custom/Layout";
import ModalFile from "./ModalFile";
import { useAppContext } from "../../../context";
import { IHrFile } from "../../../globals/interfaces";
import ActionIcon from "../../../components/custom/ActionIcon";
import apiClient from "../../../apiClient";
import { notify, omit } from "../../../utils";
import _ from "lodash";
import { Nav } from "reactstrap";
import CustomNavItem from "../../../components/custom/CustomNavItem";
import { TabContent } from "reactstrap";
import CustomTabPane from "../../../components/custom/CustomTabPane";
import Files from "./Files";

export type Tab = 'FILES';

export default function HrSettings () {
    const { user } = useAppContext();
    const [activeTab, setActiveTab] = useState<Tab>('FILES');
    const toggleTab = (tab: Tab) => setActiveTab(tab);

    return (
        <Layout>
            <h4>HR Settings</h4>
            <Nav tabs className={'separator-tabs'}>
                <CustomNavItem<Tab> 
                    tabName="Files"
                    tabId="FILES"
                    activeTabId={activeTab}
                    toggleTab={toggleTab}
                />
            </Nav>
            <TabContent activeTab={activeTab} className={'mt-2'}>
                <CustomTabPane<Tab> tabId={'FILES'}>
                    <Files 
                        user={user}
                    />
                </CustomTabPane>
            </TabContent>
        </Layout>       
    );
}