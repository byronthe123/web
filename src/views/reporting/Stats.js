import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import { Table, Button, Input, Card, CardBody, Breadcrumb, BreadcrumbItem, Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import classnames from "classnames";
import uuidv4 from 'uuid/v4';
import { asyncHandler, api } from '../../utils';
import _ from 'lodash';

import AppLayout from '../../components/AppLayout';

import Tab from '../../components/reporting/stats/Tab';
import ModalManageStat from '../../components/reporting/stats/ModalManageStat';
import Overview from '../../components/reporting/stats/Overview';
import { prependLocalValue } from '../../utils';

const Stats = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, eightyWindow, width, createSuccessNotification
}) => {

    const [activeFirstTab, setActiveFirstTab] = useState('0');
    const types = ['IMPORT', 'EXPORT', 'RAMP', 'MISC'];
    const [stats, setStats] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [airlineOptions, setAirlineOptions] = useState([]);
    const [selectedAirline, setSelectedAirline] = useState({});
    const [startDate, setStartDate] = useState(moment().subtract(30, 'days').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(types[0]);
    const [selectedStat, setSelectedStat] = useState({});
    const [viewOnly, setViewOnly] = useState(false);
    const [enterInLbs, setEnterInLbs] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const [duplicateWarning, setDuplicateWarning] = useState(false);


    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    useEffect(() => {
        const selectStats = asyncHandler(async (s_unit) => {
            const response = await api('get', `/selectStats/${s_unit}?s_email=${user.s_email}`);
            const { data } = response;
            console.log(data);
            setStats(data);
            if (data.length > 0) {
                setStartDate(moment.utc(data[data.length - 1].d_flight).format('YYYY-MM-DD'));
                setEndDate(moment.utc(data[0].d_flight).format('YYYY-MM-DD'));
            }
        });

        if (user.s_unit) {
            selectStats(user.s_unit);
        }
    }, [user.s_unit]);

    useEffect(() => {
        if (user.i_access_level) {
            setIsManager(user.i_access_level >= 4);
        }
    }, [user.i_access_level]);

    useEffect(() => {
        const selectAirlinesForStats = async (s_unit) => {
            const res = await api('get', `selectAirlinesForStats/${s_unit}`);

            const options = [];
            const data = _.get(res, 'data', []);
            data.map(airline => airline.AirlineDatum && options.push({ 
                value: airline.AirlineDatum.s_airline_code,
                label: `${airline.AirlineDatum.s_airline_name} (${airline.AirlineDatum.s_airline_code})`,
                logo: airline.AirlineDatum.s_logo
            }));

            setAirlines(data);
            setAirlineOptions(options);
        }

        if (user.s_unit) {
            selectAirlinesForStats(user.s_unit);
        }
    }, [user.s_unit]);

    const handleSelectAirline = (option) => {
        setSelectedAirline(option); 
    }

    const handleCreateStat = (type) => {
        setSelectedType(type);
        setModalOpen(true);
        setViewOnly(false);
    }

    const handleViewStat = (stat, type) => {
        setSelectedType(type);
        setSelectedStat(stat);
        setViewOnly(type !== 'VALIDATE');
        setModalOpen(true);
    }

    const resolveWeightKgs = (lbs) => {
        return (lbs * 0.45359237).toFixed(2);
    }


    const createValidateStat = asyncHandler(async(values, validate=false) => {
        console.log(values.i_awb);
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const email = user && user.s_email;
        const data = _.cloneDeep(values);

        for (let key in data) {
            if (data[key] === NaN) {
                data[key] = 0;
            }
        }

        data.s_type = selectedType;
        data.t_modified = now;
        data.s_modified_by = email;
        data.s_category = selectedType;
        data.s_unit = user && user.s_unit;
        data.s_airline_code = selectedAirline.value;
        data.s_misc_type = data.s_misc_type === 'OTHER' ? data.s_misc_type_other : data.s_misc_type;

        //fields to set conditionally:
        let endpoint;

        // if (enterInLbs) {
        //     const convertKeys = ['f_transfer_kg' ,'f_courier_kg', 'f_awb_transfer', 'f_flight_kg', 'f_mail_kg', 'f_loose_kg', 'f_bup_kg', 'f_total_kg'];
        //     for (let key in data) {
        //         if (convertKeys.includes(key)) {
        //             data[key] = resolveWeightKgs(data[key]);
        //         }
        //     }
        // }

        if (validate) {
            data.s_guid = selectedStat.s_guid;
            data.s_activity = `${selectedStat.s_activity} ${moment().format('MM/DD/YYYY hh:mm A')} | VALIDATED | BY ${user.displayName}.`;   
            data.b_validated = true; 
            data.s_status = 'VALIDATED';
            data.t_validated = now;
            data.s_validated_by = email;
            endpoint = 'validateStat';
        } else {
            data.t_created = now;
            data.s_created_by = email;    
            data.s_activity = `${moment().format('MM/DD/YYYY hh:mm A')} | CREATED | BY ${user.displayName}.`;
            data.b_validated = false; 
            data.s_status = 'ENTERED';
            data.s_guid = uuidv4();
            endpoint = 'createStat';
        }

        delete data.fc_tsa_lb;
        const response = await api('post', endpoint, { data });

        if (response.status === 200) {
            console.log('done1');
            const { data } = response;
            createSuccessNotification('Success');
            setModalOpen(false);
            
            // data.d_flight = moment(data.d_flight).local().format('YYYY-MM-DD');
            if (validate) {
                const statsCopy = _.cloneDeep(stats);
                const updateIndex = statsCopy.findIndex(s => s.i_id === selectedStat.i_id);
                statsCopy[updateIndex] = data;
                setStats(statsCopy);
            } else {
                setStats(prev => {
                    const updated = [data, ...prev];
                    return updated;
                });
            }
            console.log('done2');
        }

    });

    const checkDuplicateStat = (e, handleChange, values) => {
        handleChange(e);
        let { s_airline_code, s_flight_number, d_flight } = values;
        const { name, value } = e.target;
        console.log( name, value);
        if (name === 's_airline_code') {
            s_airline_code = value;
        } else if (name === 's_flight_number') {
            s_flight_number = value;
        } else {
            d_flight = value;
        }

        console.log(s_airline_code);
        console.log(s_flight_number);
        console.log(d_flight);

        let duplicateWarning = false;
        for (let i = 0; i < stats.length; i++) {
            const current = stats[i];
            if (
                current.s_airline_code === s_airline_code.toUpperCase() && 
                current.s_flight_number === s_flight_number.toUpperCase() && 
                moment(current.d_flight).format('YYYY-MM-DD') === moment(d_flight).format('YYYY-MM-DD')
            ) {
                duplicateWarning = true;
                break;
            }
        }
        console.log(duplicateWarning);
        setDuplicateWarning(duplicateWarning);
    }

    const deleteStat = asyncHandler(async(s_guid) => {
        const res = await api('delete', `deleteStat/${s_guid}`);

        if (res.status === 200) {
            setModalOpen(false);
            createSuccessNotification('Deleted');
            const updatedStats = stats.filter(s => s.s_guid !== s_guid);
            setStats(updatedStats);
        }
    });

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md='12' lg='12'>
                            <Row>
                                <h1 className={'d-inline'}>Stats</h1>
                                <h4 className={'d-inline ml-2 mt-2'}> {startDate} to {endDate}</h4>
                                {/* <h1 className='pl-3 d-inline' style={{position: 'relative', top: '6px'}}>Stats</h1>
                                <Input type='date' value={moment(startDate).format('YYYY-MM-DD')} onChange={(e) =>  setStartDate(e.target.value)} className='d-inline ml-3' style={{ width: '200px' }} />
                                <h4 className='mt-3 ml-3'>to</h4>
                                <Input type='date' value={moment(endDate).format('YYYY-MM-DD')} onChange={(e) =>  setEndDate(e.target.value)} className='d-inline ml-3' style={{ width: '200px' }} /> */}
                            </Row>

                            <Row className='mt-2'>
                                <Col mg='12' lg='12'>
                                    <Nav tabs className="separator-tabs ml-0 mb-2" style={{ fontSize: '18px' }}>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "0",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("0");
                                            }}
                                            >
                                                Overview
                                            </NavLink>
                                        </NavItem>
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
                                                Import
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
                                                Export
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
                                                Ramp
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
                                                Misc
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            location={{}}
                                            to="#"
                                            className={classnames({
                                                active: activeFirstTab === "5",
                                                "nav-link": true
                                            })}
                                            onClick={() => {
                                                toggleTab("5");
                                            }}
                                            >
                                                Validate PowerBi
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent activeTab={activeFirstTab} className='mt-2'>
                                <TabPane tabId={'0'}>
                                    <Overview
                                        stats={stats}
                                        startDate={startDate}
                                        endDate={endDate}
                                    />
                                </TabPane>
                                {
                                    types.map((t, i) => 
                                        <TabPane tabId={(i+1).toString()} key={i}>
                                            <Tab
                                                stats={stats}
                                                type={t}
                                                handleCreateStat={handleCreateStat}
                                                handleViewStat={handleViewStat}                          
                                            />
                                        </TabPane>
                                    )
                                }
                                <TabPane tabId={'5'}>
                                    <Row>
                                        <Col md={12}>
                                            <iframe style={{ width: '100vh', height: '70vh' }} src='https://app.powerbi.com/view?r=eyJrIjoiMDQ1YjFiODUtNGE0Mi00NTBhLTg3NjUtYTFhZDgxOGMzNzM4IiwidCI6IjM2ZjljMDIyLTEyY2YtNDgzYy04OWM4LWI1ZWYxZjgwZGNjZSIsImMiOjF9&pageName=ReportSection4fa3e584fd5d8477d7d1%22' />
                                        </Col>
                                    </Row>
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </div>
            </div>

            <ModalManageStat 
                user={user}
                modal={modalOpen}
                setModal={setModalOpen}
                selectedType={selectedType}
                viewOnly={viewOnly}
                selectedStat={selectedStat}
                airlines={airlines}
                airlineOptions={airlineOptions}
                handleSelectAirline={handleSelectAirline}
                selectedAirline={selectedAirline}
                createValidateStat={createValidateStat}
                enterInLbs={enterInLbs}
                setEnterInLbs={setEnterInLbs}
                isManager={isManager}
                checkDuplicateStat={checkDuplicateStat}
                duplicateWarning={duplicateWarning}
                deleteStat={deleteStat}
            />



        </AppLayout>
    );
}

export default withRouter(Stats);