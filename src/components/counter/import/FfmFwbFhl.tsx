import React,{ useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, CardBody, Nav, NavLink, NavItem, TabContent, TabPane } from 'reactstrap';
import tableMapping from './tableMappings';
import ReactTable from '../../custom/ReactTable';
import classnames from 'classnames';
import { FFM, FHL, FWB, ISelectedAwb } from './interfaces';
import { IFHL, IMap } from '../../../globals/interfaces';

interface Props {
    ffms: Array<FFM>;
    handleSelectFfm: (ffm: FFM) => void;
    fhls: Array<FHL>;
    fwbs: Array<FWB>;
    s_hawb: string;
}

export default function FfmFwbFhl ({
    ffms,
    handleSelectFfm,
    fhls,
    fwbs,
    s_hawb
}: Props) {
    
    const [activeFirstTab, setActiveFirstTab] = useState('1');

    const toggleTab = (tab: string) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    const selectedFhls = useMemo(() => {
        const map: IMap<IFHL> =  {};
        for (let i = 0; i < fhls.length; i++) {
            const { s_hawb: fhlHawb } = fhls[i];
            if (
                !s_hawb || 
                (s_hawb && s_hawb.length > 0 && s_hawb === fhlHawb)
            ) {
                if (map[fhlHawb] === undefined) {
                    // @ts-ignore
                    map[fhlHawb] = fhls[i];
                }
            }
        }
        return Object.keys(map).map(key => map[key]);
    }, [fhls, s_hawb]);

    return ( 
        <Row>
            <Col md={12}>
                <Card>
                    <CardBody>
                        <Row className='mt-2'>
                            <Col mg='12' lg='12'>
                                <Nav tabs className="separator-tabs ml-0 mb-2">
                                    <NavItem>
                                        <h6
                                            className={classnames({
                                                active: activeFirstTab === "1",
                                                "nav-link": true
                                            })}
                                            onClick={() => toggleTab('1')}
                                        >
                                        FFM
                                        </h6>
                                    </NavItem>
                                    <NavItem>
                                        <h6
                                            className={classnames({
                                                active: activeFirstTab === "2",
                                                "nav-link": true
                                            })}
                                            onClick={() => toggleTab('2')}
                                        >
                                        FWB
                                        </h6>
                                    </NavItem>
                                    <NavItem>
                                        <h6
                                            className={classnames({
                                                active: activeFirstTab === "3",
                                                "nav-link": true
                                            })}
                                            onClick={() => toggleTab('3')}
                                        >
                                        FHL
                                        </h6>
                                    </NavItem>
                                </Nav>
                            </Col>
                        </Row>

                        <TabContent activeTab={activeFirstTab} className='mt-2'>
                            <TabPane tabId="1">
                                <ReactTable 
                                    data={ffms}
                                    mapping={tableMapping.ffm}
                                    index={true}
                                    locked={true}
                                    numRows={7}
                                    handleClick={(item: FFM) => handleSelectFfm(item)}
                                />
                            </TabPane>
                            <TabPane tabId="2">
                                <ReactTable 
                                    data={fwbs}
                                    mapping={tableMapping.fwb}
                                    index={true}
                                    locked={true}
                                    numRows={7}
                                    handleClick={(item: FFM) => handleSelectFfm(item)}
                                />
                            </TabPane>
                            <TabPane activeTab={'3'} tabId={'3'}>
                                <ReactTable 
                                    data={selectedFhls}
                                    mapping={tableMapping.fhl}
                                    index={true}
                                    numRows={5}
                                />
                            </TabPane>
                        </TabContent>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}