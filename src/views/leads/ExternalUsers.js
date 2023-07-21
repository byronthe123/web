import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import "rc-switch/assets/index.css";
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import { Button, Row, Col, Nav, NavItem, TabContent, TabPane } from 'reactstrap';

import AppLayout from '../../components/AppLayout';

import ModalEditUser from '../../components/leads/externalUsers/ModalEditUser';
import Users from '../../components/leads/externalUsers/Users'; 
import Companies from '../../components/leads/externalUsers/Companies'; 
import ModalAddEditCompany from '../../components/leads/externalUsers/ModalAddEditCompany'; 
import { useAppContext } from '../../context';

const ExternalUsers = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, createSuccessNotification, eightyWindow, width
}) => {

    const { appData: {stations} } = useAppContext();
    const units = stations.map(s => s.s_unit);
    //Properties
    const [activeFirstTab, setActiveFirstTab] = useState('1');
    const [externalUsers, setExternalUsers] = useState([]);
    const [externalCompanies, setExternalCompanies] = useState([]);
    const [modalEditUserOpen, setModalEditUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalAddCompany, setModalAddCompany] = useState(false);
    const [newCompany, setNewCompany] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState({});
    const [b_approved, set_b_approved] = useState(false);
    const [s_company_guid, set_company_guid] = useState('');
    const [selectedUnits, setSelectedUnits] = useState([]);

    //Methods
    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    const selectExternalUsersAndCompanies = () => {
        axios.get(`${baseApiUrl}/selectExternalUsersAndCompanies`, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            const { users, companies } = response.data;
            setExternalUsers(users);
            setExternalCompanies(companies);
        }).catch(error => {
            alert(error);
        });
    }

    const updateExternalUser = () => {

        const company = externalCompanies.find(c => c.s_guid === s_company_guid);

        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        const data = {
            s_user_id: selectedUser.s_user_id,
            b_approved,
            t_modified: now,
            s_modified_by: user.s_email,
            s_company_guid,
            s_company: company.s_company
        }

        axios.post(`${baseApiUrl}/updateExternalUser`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setExternalUsers(response.data);
            createSuccessNotification(`User info. updated`);
            setModalEditUserOpen(false);
        }).catch(error => {

        });
    }

    const addExternalCompany = async (e, values) => {
        e.preventDefault();
        const now = moment().local();
        const email = user && user.s_email;
        values.t_created = now;
        values.t_modified = now;
        values.s_created_by = email;
        values.s_modified_by = email;
        values.s_guid = uuidv4();
        values.s_units = selectedUnits.toString();

        const data = values;

        try {
            const response = await axios.post(`${baseApiUrl}/addExternalCompany`, {
                data
            }, {
                headers: {
                    Authorization: `Bearer ${headerAuthCode}`
                }
            });
    
            if (response.status === 200) {
                setExternalCompanies(response.data);
                createSuccessNotification('Company Added');
                setModalAddCompany(false);
            }
        } catch (err) {
            alert(err);
        }
    }

    const editExternalCompany = async (e, values) => {
        e.preventDefault();
        const now = moment().local();
        const email = user && user.s_email;

        values.id = selectedCompany.id;
        values.t_modified = now;
        values.s_modified_by = email;
        values.s_units = selectedUnits.toString();

        const data = values;

        try {
            const response = await axios.put(`${baseApiUrl}/editExternalCompany`, {
                data
            }, {
                headers: {
                    Authorization: `Bearer ${headerAuthCode}`
                }
            });
    
            if (response.status === 200) {
                setExternalCompanies(response.data);
                createSuccessNotification('Company Updated');
                setModalAddCompany(false);
            }
        } catch (err) {
            alert(err);
        }
    }

    const handleEditUser = (user) => {
        setSelectedUser(user);
        set_b_approved(user.b_approved);
        set_company_guid(user.s_company_guid ? user.s_company_guid : '');
        setModalEditUserOpen(true);
    }

    const handleAddCompany = () => {
        setNewCompany(true);
        setModalAddCompany(true);
        setSelectedUnits([]);
    }

    const handleEditCompany = (company) => {
        setSelectedCompany(company);
        setNewCompany(false);
        setModalAddCompany(true);
        const { s_units } = company;
        const unitsArray = s_units && s_units.split(',') || [];
        setSelectedUnits(unitsArray);
    }

    //UseEffects
    useEffect(() => {
        selectExternalUsersAndCompanies();
    }, []);

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md={12}>
                            <Row>
                                <h1>External Users</h1>
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
                                            Users
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
                                            Companies
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent activeTab={activeFirstTab} className='mt-2'>
                                <TabPane tabId="1">
                                    <Users 
                                        externalUsers={externalUsers}
                                        handleEditUser={handleEditUser}
                                    />
                                </TabPane>
                                <TabPane tabId='2'>
                                    <Companies 
                                        externalCompanies={externalCompanies}
                                        handleAddCompany={handleAddCompany}
                                        handleEditCompany={handleEditCompany}
                                    />
                                </TabPane>
                            </TabContent>

                        </Col>
                    </Row>
                </div>
            </div>

            <ModalEditUser 
                open={modalEditUserOpen}
                handleModal={setModalEditUserOpen}
                user={selectedUser}
                updateExternalUser={updateExternalUser}
                externalCompanies={externalCompanies}
                b_approved={b_approved}
                set_b_approved={set_b_approved}
                s_company_guid={s_company_guid}
                set_company_guid={set_company_guid}
            />

            <ModalAddEditCompany 
                open={modalAddCompany}
                toggle={() => setModalAddCompany(!modalAddCompany)}
                newCompany={newCompany}
                addExternalCompany={addExternalCompany}
                editExternalCompany={editExternalCompany}
                selectedCompany={selectedCompany}
                units={units}
                selectedUnits={selectedUnits}
                setSelectedUnits={setSelectedUnits}
            />

            

        </AppLayout>
    );
}

export default withRouter(ExternalUsers);