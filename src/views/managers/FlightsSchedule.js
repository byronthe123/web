import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import { Form, FormGroup, Table, Button, Input, Card, CardBody, Breadcrumb, BreadcrumbItem, Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import classnames from "classnames";
import DayPicker, { DateUtils } from 'react-day-picker';

import AppLayout from '../../components/AppLayout';

import ModalEditFlights from '../../components/managers/flightsSchedule/ModalEditFlights';
import EditFlights from '../../components/managers/flightsSchedule/EditFlights';
import CalendarView from '../../components/managers/flightsSchedule/CalendarView';
import { tableMapping } from '../../components/managers/flightsSchedule/tableMapping';
import { addLocalValue, addLocalValues, updateLocalValue, deleteLocalValue } from '../../utils';

const FlightsSchedule = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, eightyWindow, width, createSuccessNotification, manager
}) => {

    const [activeFirstTab, setActiveFirstTab] = useState('1');
    const [scheduleData, setScheduleData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [createNew, setCreateNew] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [selectedFilterId, setSelectedFilterId] = useState(1);
    const [filterDate, setFilterDate] = useState(moment().local().format('YYYY-MM-DD'));
    const [selectedDateFilterId, setSelectedDateFilterId] = useState(1);
    const [selectedStatusFilterId, setSelectedStatusFilterId] = useState(12);
    const [selectedTypeFilterId, setSelectedTypeFilterId] = useState(15);
    const [selectedAirlineCodeFilter, setSelectedAirlineCodeFilter] = useState('ALL');
    const [airlineCodes, setAirlineCodes] = useState([]);

    useEffect(() => {
        const selectedStatusFilter = filterTypes.find(t => t.id === selectedStatusFilterId);
        const useData = selectedStatusFilter.function();

        let filtered;
        if (selectedAirlineCodeFilter === 'ALL') {
            filtered = useData;
        } else {
            filtered = useData.filter(d => d.s_airline_code === selectedAirlineCodeFilter);
        }
        setDisplayData(filtered);

    }, [selectedAirlineCodeFilter]);
    
    useEffect(() => {
        if (selectedDateFilterId >= 6 && selectedDateFilterId <= 7) {
            if (moment(filterDate).isValid()) {
                const filterBy = selectedDateFilterId === 6 ? 't_estimated_departure' : 't_estimated_arrival';
                const filteredData = scheduleData.filter(d => moment(d[filterBy]).format('MM/DD/YYYY') === moment(filterDate).format('MM/DD/YYYY'));
                setDisplayData(filteredData);
            }
        }
        //  else {
        //     setDisplayData(scheduleData);
        // }
    }, [selectedDateFilterId, filterDate]);

    const filterByStatus = (status) => {
        const selectedTypeFilter = filterTypes.find(t => t.id === selectedTypeFilterId);
        const useData = selectedTypeFilter.function();
        // const useData = displayData;


        let filtered;
        if (status === 'ALL') {
            filtered = useData.filter(d => d.s_status === 'PLANNED' || d.s_status === 'CANCELLED');
        } else {
            filtered = useData.filter(d => d.s_status === status);
        }
        setDisplayData(filtered);
        return filtered;
    }

    const filterByType = (type) => {
        const selectedDateFilter = filterTypes.find(t => t.id === selectedDateFilterId);
        const useData = selectedDateFilter.function(false);
        let filtered;
        if (type === 'ALL') {
            filtered = useData.filter(d => d.s_flight_type === 'IMPORT' || d.s_flight_type === 'EXPORT');
        } else {
            filtered = useData.filter(d => d.s_flight_type === type);
        }
        setDisplayData(filtered);
        return filtered;
    }

    const handleTypeSelection = (object, reset) => {
        if (object.type === 'date') {
            setSelectedDateFilterId(object.id);
            if (reset) {
                setSelectedStatusFilterId(12);
                setSelectedTypeFilterId(15);
            }
        } else if (object.type === 'status') {
            setSelectedStatusFilterId(object.id);
        } else {
            setSelectedTypeFilterId(object.id);
        }
    }

    const filterTypes = [
        {
            id: 1,
            name: 'All',
            function(reset=true) {
                setDisplayData(scheduleData);
                handleTypeSelection(this, reset);
                return scheduleData;
            },
            type: 'date'
        },
        {
            id: 2,
            name: 'Past Dept.',
            function (reset=true) {
                const previousData = scheduleData.filter(d => moment(
                    moment(d.t_estimated_departure).format('MM/DD/YYYY')
                ).isSameOrBefore(moment().format('MM/DD/YYYY')));

                setDisplayData(previousData);
                handleTypeSelection(this, reset);
                return previousData;
            },
            type: 'date'
        },
        {
            id: 3,
            name: 'Future Dept.',
            function (reset=true) {
                const futureData = scheduleData.filter(d => moment(moment(d.t_estimated_departure).format('MM/DD/YYYY')).isSameOrAfter(moment().format('MM/DD/YYYY')));
                setDisplayData(futureData);
                handleTypeSelection(this, reset);
                return futureData;
            },
            type: 'date'
        },
        {
            id: 4,
            name: 'Past Arrival',
            function (reset=true) {
                const previousData = scheduleData.filter(d => moment(moment(d.t_estimated_arrival).format('MM/DD/YYYY')).isSameOrBefore(moment().format('MM/DD/YYYY')));
                setDisplayData(previousData);
                handleTypeSelection(this, reset);
                return previousData;
            },
            type: 'date'
        },
        {
            id: 5,
            name: 'Future Arrival',
            function (reset=true) {
                const futureData = scheduleData.filter(d => moment(moment(d.t_estimated_arrival).format('MM/DD/YYYY')).isSameOrAfter(moment().format('MM/DD/YYYY')));
                setDisplayData(futureData);
                handleTypeSelection(this, reset);
                return futureData;
            },
            type: 'date'
        },
        {
            // Changes based on useEffect:
            id: 6,
            name: 'Dept. Date',
            function (reset=true) {
                handleTypeSelection(this, reset);
                let toReturn = [];
                if (moment(filterDate).isValid()) {
                    const filterBy = selectedDateFilterId === 6 ? 't_estimated_departure' : 't_estimated_arrival';
                    const filteredData = scheduleData.filter(d => moment(d[filterBy]).format('MM/DD/YYYY') === moment(filterDate).format('MM/DD/YYYY'));
                    toReturn = filteredData;
                } 
                return toReturn;
            },
            type: 'date'
        },
        {
            // Changes based on useEffect:
            id: 7,
            name: 'Arrival Date',
            function (reset=true) {
                handleTypeSelection(this, reset);
                let toReturn = [];
                if (moment(filterDate).isValid()) {
                    const filterBy = selectedDateFilterId === 6 ? 't_estimated_departure' : 't_estimated_arrival';
                    const filteredData = scheduleData.filter(d => moment(d[filterBy]).format('MM/DD/YYYY') === moment(filterDate).format('MM/DD/YYYY'));
                    toReturn = filteredData;
                } 
                return toReturn;
            },
            type: 'date'
        },
        {
            id: 8,
            name: 'Dept. Asc',
            function (reset=true) {
                handleTypeSelection(this, reset);
                const toReturn = scheduleData.sort((a, b) => new Date(a.t_estimated_departure) - new Date(b.t_estimated_departure));
                setDisplayData(toReturn);
                return toReturn;
            },
            type: 'date'
        },
        {
            id: 9,
            name: 'Dept. Desc',
            function (reset=true) {
                handleTypeSelection(this, reset);
                const toReturn = scheduleData.sort((a, b) => new Date(b.t_estimated_departure) - new Date(a.t_estimated_departure));
                setDisplayData(toReturn);
                return toReturn;            
            },
            type: 'date'
        },
        {
            id: 10,
            name: 'Arrival Asc',
            function (reset) {
                handleTypeSelection(this, reset);
                const toReturn = scheduleData.sort((a, b) => new Date(a.t_estimated_arrival) - new Date(b.t_estimated_arrival));
                setDisplayData(toReturn);
                return toReturn;
            },
            type: 'date'
        },
        {
            id: 11,
            name: 'Arrival Desc',
            function (reset) {
                handleTypeSelection(this, reset);
                const toReturn = scheduleData.sort((a, b) => new Date(b.t_estimated_arrival) - new Date(a.t_estimated_arrival));
                setDisplayData(toReturn);
                return toReturn;
            },
            type: 'date'
        },
        {
            id: 12,
            name: 'ALL',
            function () {
                handleTypeSelection(this, false);
                const filtered = filterByStatus('ALL');
                return filtered;

            },
            type: 'status'
        },
        {
            id: 13,
            name: 'PLANNED',
            function () {
                handleTypeSelection(this, false);
                const filtered = filterByStatus('PLANNED');
                return filtered;
            },
            type: 'status'
        },
        {
            id: 14,
            name: 'CANCELLED',
            function () {
                handleTypeSelection(this, false);
                const filtered = filterByStatus('CANCELLED');
                return filtered;
            },
            type: 'status'
        },
        {
            id: 15,
            name: 'ALL',
            function () {
                const filtered = filterByType('ALL');
                handleTypeSelection(this, false);
                return filtered;
            },
            type: 'type'
        },
        {
            id: 16,
            name: 'IMPORT',
            function () {
                const filtered = filterByType('IMPORT');
                handleTypeSelection(this, false);
                return filtered;
            },
            type: 'type'
        },
        {
            id: 17,
            name: 'EXPORT',
            function () {
                const filtered = filterByType('EXPORT');
                handleTypeSelection(this, false);
                return filtered;
            },
            type: 'type'
        }
    ];  

    const toggleTab = (tab) => {
        if (activeFirstTab !== tab) {
            setActiveFirstTab(tab);
        }   
    }

    const resolveAirlineCodes = (data) => {
        const codes = [];
        codes.push('ALL');
        data.map(d => codes.indexOf(d.s_airline_code) === -1 && codes.push(d.s_airline_code));
        return codes;
    }

    const selectFlightsSchedule = () => {
        user && user.s_unit && 
        axios.get(`${baseApiUrl}/selectFlightsSchedule/${user.s_unit}`, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setScheduleData(response.data);
            setDisplayData(response.data);
            setAirlineCodes(resolveAirlineCodes(response.data));
        });
    }

    useEffect(() => {
        user.s_unit &&
        selectFlightsSchedule();
    }, [user.s_unit]);

    const handleDayClick = (day, { selected }) => {
        const _selectedDays = Object.assign([], selectedDays);
        if (selected) {
          const selectedIndex = _selectedDays.findIndex(selectedDay =>
            DateUtils.isSameDay(selectedDay, day)
          );
          _selectedDays.splice(selectedIndex, 1);
        } else {
            _selectedDays.push(day);
        }
        setSelectedDays(_selectedDays);
    }

    const addFlightsSchedule = (values) => {
        const { s_email } = user && user;
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');

        const data = {
            dates: selectedDays,
            main: values
        }
        
        data.main.s_created_by = s_email;
        data.main.t_created = now;
        data.main.s_modified_by = s_email;
        data.main.t_modified = now;

        const url = createNew ? 'addFlightsSchedule' : 'editFlightSchedule';

        axios.post(`${baseApiUrl}/${url}`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            const { data } = response;
            if (createNew) {
                addLocalValues(scheduleData, setScheduleData, data);
                addLocalValues(displayData, setDisplayData, data);
            } else {
                updateLocalValue(scheduleData, setScheduleData, values.id, data);
                updateLocalValue(displayData, setDisplayData, values.id, data);
            }

            setModalOpen(false);
            createSuccessNotification(`Flight ${createNew ? 'Added' : 'Updated'}`);
        });

    }

    const deleteFlightSchedule = () => {
        const { id } = selectedItem;
        axios.post(`${baseApiUrl}/deleteFlightSchedule`, {
            id
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            deleteLocalValue(scheduleData, setScheduleData, id);
            deleteLocalValue(displayData, setDisplayData, id);
            setModalOpen(false);
            createSuccessNotification(`Flight Deleted`);
        });
    }

    
    const handleEdit = (item) => {
        setSelectedItem(item);
        setCreateNew(false);
        setModalOpen(true);
    }

    const handleCreateNewItem = () => {
        setCreateNew(true);
        setModalOpen(true);
    }


    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md='12' lg='12'>
                            <Row>
                                <h1 className='pl-3' style={{position: 'relative', top: '6px'}}>Flights Schedule</h1>
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
                                            Edit
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
                                            View
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>

                            <TabContent activeTab={activeFirstTab} className='mt-2'>
                                <TabPane tabId="1">
                                    <EditFlights 
                                        user={user}
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        eightyWindow={eightyWindow}
                                        createSuccessNotification={createSuccessNotification}                            
                                        scheduleData={scheduleData}
                                        setScheduleData={setScheduleData}
                                        selectFlightsSchedule={selectFlightsSchedule}
                                        selectedItem={selectedItem} 
                                        setSelectedItem={setSelectedItem}
                                        modalOpen={modalOpen}
                                        setModalOpen={setModalOpen}
                                        createNew={createNew}
                                        setCreateNew={setCreateNew}
                                        selectedDays={selectedDays}
                                        setSelectedDays={setSelectedDays}
                                        handleEdit={handleEdit}
                                        handleCreateNewItem={handleCreateNewItem}
                                        handleDayClick={handleDayClick}
                                        addFlightsSchedule={addFlightsSchedule}
                                        deleteFlightSchedule={deleteFlightSchedule}                                   
                                        manager={manager}
                                        displayData={displayData}
                                        setDisplayData={setDisplayData}
                                        filterTypes={filterTypes}
                                        selectedFilterId={selectedFilterId}
                                        filterDate={filterDate}
                                        setFilterDate={setFilterDate}
                                        selectedDateFilterId={selectedDateFilterId}
                                        selectedStatusFilterId={selectedStatusFilterId}
                                        selectedTypeFilterId={selectedTypeFilterId}
                                        selectedAirlineCodeFilter={selectedAirlineCodeFilter} 
                                        setSelectedAirlineCodeFilter={setSelectedAirlineCodeFilter}
                                        airlineCodes={airlineCodes}
                                    />
                                </TabPane>
                                <TabPane tabId="2">
                                    <CalendarView 
                                        user={user}
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        eightyWindow={eightyWindow}
                                        createSuccessNotification={createSuccessNotification}                            
                                        scheduleData={scheduleData}
                                        setScheduleData={setScheduleData}
                                        selectFlightsSchedule={selectFlightsSchedule}
                                        selectedItem={selectedItem} 
                                        setSelectedItem={setSelectedItem}
                                        modalOpen={modalOpen}
                                        setModalOpen={setModalOpen}
                                        createNew={createNew}
                                        setCreateNew={setCreateNew}
                                        selectedDays={selectedDays}
                                        setSelectedDays={setSelectedDays}
                                        handleEdit={handleEdit}
                                        handleCreateNewItem={handleCreateNewItem}
                                        handleDayClick={handleDayClick}
                                        addFlightsSchedule={addFlightsSchedule}
                                        deleteFlightSchedule={deleteFlightSchedule}                                   
                                    />
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </div>
            </div>

            <ModalEditFlights 
                open={modalOpen}
                user={user}
                handleModal={setModalOpen}
                createNew={createNew}
                selectedItem={selectedItem}
                tableMapping={tableMapping}
                selectedDays={selectedDays}
                handleDayClick={handleDayClick}
                addFlightsSchedule={addFlightsSchedule}
                deleteFlightSchedule={deleteFlightSchedule}
                manager={manager}
            />

        </AppLayout>
    );
}

export default withRouter(FlightsSchedule);