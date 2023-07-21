import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/index';
import classnames from 'classnames';
import Clipboard from 'react-clipboard.js';
import { Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import AppLayout from '../AppLayout';
import EdiTable from './EdiTable';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import { Input } from 'reactstrap';
import { api } from '../../utils';
const baseApiUrl = process.env.REACT_APP_BASE_API_URL;
const headerAuthCode = process.env.REACT_APP_HEADER_AUTH_CODE;

const EdiComponent = ({
    s_type,
    s_table,
    fieldsMapping,
    tab2,
    tab3
}) => {

    const { user, setLoading } = useContext(AppContext);
    const [activeFirstTab, setActiveFirstTab] = useState('1');
    const [prefix, setPrefix] = useState('');
    const [awb, setAwb] = useState('');

    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    const generateAwb = async () => {
        const res = await api('get', `generate-awb/${prefix}`);
        if (res.status === 200) {
            setAwb(res.data);
        }
    }

    return (

        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md='12' lg='12'>
                            <Row>
                                <h1 className='pl-3' style={{position: 'relative', top: '6px'}}>EDI {s_table && s_table.toUpperCase()}</h1>
                            </Row>

                            {
                                s_table === 'fwb' && (
                                    <GenerateAwbContainer>
                                        <Input 
                                            type={'text'} 
                                            value={prefix} 
                                            onChange={(e) => setPrefix(e.target.value)} 
                                            style={{ width: '100px' }} 
                                        />
                                        <Button 
                                            onClick={() => generateAwb()}
                                            disabled={!prefix || prefix.length < 3}
                                        >
                                            Generate AWB
                                        </Button>
                                        {
                                            awb.length === 11 && (
                                                <>
                                                    <h6 
                                                        id={'copyLinkAwb'}
                                                        className={'font-weight-bold mt-2'}
                                                    >
                                                    {awb}
                                                    </h6>
                                                    <Clipboard data-clipboard-target="#copyLinkAwb" className={'btn btn-secondary'}>
                                                        <i className={'fas fa-copy'} style={{ fontSize: '20px' }} />
                                                    </Clipboard>
                                                </>
                                            )
                                        }
                                    </GenerateAwbContainer>
                                )
                            }

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
                                            Main
                                            </NavLink>
                                        </NavItem>
                                        {
                                            tab2 && 
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
                                                { tab2.name }
                                                </NavLink>
                                            </NavItem>
                                        }
                                        {
                                            tab3 && 
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
                                                { tab3.name }
                                                </NavLink>
                                            </NavItem>
                                        }
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent activeTab={activeFirstTab} className='mt-2'>
                                <TabPane tabId={`1`}>
                                    <EdiTable 
                                        user={user}
                                        s_type={s_type}
                                        s_table={s_table}
                                        fieldsMapping={fieldsMapping}
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        setLoading={setLoading}
                                    />
                                </TabPane>
                                {
                                    tab2 && 
                                    <TabPane tabId={`2`}>
                                        <tab2.component 
                                            user={user}
                                            activeFirstTab={activeFirstTab}
                                        />
                                    </TabPane>
                                }
                                {
                                    tab3 && 
                                    <TabPane tabId={`3`}>
                                        <tab3.component 
                                            user={user}
                                            activeFirstTab={activeFirstTab}
                                        />
                                    </TabPane>
                                }
                            </TabContent>
                        </Col>
                    </Row>
                </div>
            </div>

        </AppLayout>
    );
}

const GenerateAwbContainer = styled.div`
    display: flex;
    gap: 10px;
`;

export default EdiComponent;