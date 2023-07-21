import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import uuidv4 from 'uuid/v4';

import {Button, Row, Col, Table, Card, CardBody, CardTitle, CardText} from 'reactstrap';

import AppLayout from '../../components/AppLayout';


import TabCard from '../../components/warehouse/dock/TabCard';
import ModalAssign from '../../components/warehouse/dock/ModalAssign';
import ModalLocations from '../../components/warehouse/dock/ModalLocations';
import ModalReportDamage from '../../components/warehouse/dock/ModalReportDamage';
import ModalRejectAwb from '../../components/warehouse/dock/ModalRejectAwb';
import ModalAcceptPcs from '../../components/warehouse/dock/ModalAcceptPcs';
import ModalConfirmLeftEarly from '../../components/warehouse/dock/ModalConfirmLeftEarly';

const Dock = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, createSuccessNotification, eightyWindow, width
}) => {

    const s_unit = user && user.s_unit;
    const email = user && user.s_email;
    const [dockData, setDockData] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [modalAssignOpen, setModalAssignOpen] = useState(false);
    const [modalLocationsOpen, setModalLocationsOpen] = useState(false);
    const [modalReportDamageOpen, setModalReportDamageOpen] = useState(false);
    const [availableAgents, setAvailableAgents] = useState([]);
    const [dockDoorsData, setDockDoorsData] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [selectedDoor, setSelectedDoor] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedAwbs, setSelectedAwbs] = useState([]);
    const [doorAlreadyAssigned, setDoorAlreadyAssigned] = useState(null);
    const [agentAlreadyAssigned, setAgentAlreadyAssigned] = useState(null);
    const [forceRefreshIndex, setForceRefreshIndex] = useState(0);
    const [refreshCompanyIndex, setRefreshCompanyIndex] = useState(0);
    const [modalAcceptExportPcsOpen, setModalAcceptExportPcsOpen] = useState(false);
    const [acceptExportPcsIndex, setAcceptExportPcsIndex] = useState(0);
    const [exportAcceptancePcs, setExportAcceptancePcs] = useState('');
    const [modalRejectOpen, setModalRejectOpen] = useState(false);
    const [s_dock_reject_reason, set_s_dock_reject_reason] = useState('');
    const [modalConfirmLeftEarlyOpen, setModalConfirmLeftEarlyOpen] = useState(false);
    const [doors, setDoors] = useState([]);

    const dockQuery = () => {
        const s_unit = user && user.s_unit;
        s_unit && 
        axios.post(`${baseApiUrl}/dockDriversQuery`, {
            s_unit
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            const { drivers, doors } = response.data;
            setDockData(drivers);
            setDoors(doors);
        }).catch(error => {
            alert(error);
        });
    }

    useEffect(() => {
        if (user && user.s_unit) {
            dockQuery();
        }
    }, [user]);

    useEffect(() =>{
        let interval = setInterval(() => dockQuery(), (10000))
        return () => clearInterval(interval)
    })

    const initializeCount = (company) => {
        company.exportCount = 0;
        company.importCount = 0;
        if (company.s_type.toUpperCase() === 'EXPORT') {
            company.exportCount++;
        } else {
            company.importCount++;
        }
        return company;
    }

    const sortCompanies = () => {
        let companies = [];

        for (let i = 0; i < dockData.length; i++) {
            if (companies.filter(c => c.s_transaction_id === dockData[i].s_transaction_id).length === 0) {
                companies.push(initializeCount(dockData[i]));
            } else {
                for (let j = 0; j < companies.length; j++) {
                    if (companies[j].s_transaction_id === dockData[i].s_transaction_id) {
                        if (dockData[i].s_type.toUpperCase() === 'EXPORT') {
                            companies[j].exportCount++;
                        } else {
                            companies[j].importCount++;
                        }
                        //could change the time for the company here also       
                    }
                }
            }
        }

        setCompanies(companies);
    }

    useEffect(() => {
        sortCompanies();
    }, [dockData]);

    const availableAgentsDoorsQuery = () => {
        const s_unit = user && user.s_unit;
        axios.post(`${baseApiUrl}/availableDockAgentsDoorsQuery`, {
            s_unit
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setAvailableAgents(response.data.agents);
            setDockDoorsData(response.data.dockDoors);
            setForceRefreshIndex(forceRefreshIndex + 1);
            console.log(response.data.agents);
        }).catch(error => {

        });
    }

    useEffect(() => {
        
        if (selectedCompany !== null) {
            if (selectedCompany.s_dock_door !== null && selectedCompany.s_dock_door.length > 0) {
                setDoorAlreadyAssigned(selectedCompany.s_dock_door);
                setSelectedDoor(selectedCompany.s_dock_door);
            } else {
                setDoorAlreadyAssigned(null);
                setSelectedDoor(null);
            }
        
            if (selectedCompany.s_dock_ownership && selectedCompany.s_dock_ownership !== null && selectedCompany.s_dock_ownership.length > 0) {
                // alert('working');
                console.log(resolveAgent(selectedCompany));
                setAgentAlreadyAssigned(resolveAgent(selectedCompany));
                setSelectedAgent(resolveAgent(selectedCompany));
            } else {
                setAgentAlreadyAssigned(null);
                setSelectedAgent(null);
            }
    
            setModalAssignOpen(true);
    
        }

    }, [forceRefreshIndex]);

    const handleAssign = (company) => {
        setSelectedCompany(company);
        setRefreshCompanyIndex(refreshCompanyIndex + 1);
    }

    useEffect(() => {
        if (selectedCompany !== null) {
            availableAgentsDoorsQuery();
        }
    }, [refreshCompanyIndex]);

    const handleSetSelectedDoor = (door) => {
        if (selectedDoor !== door) {
            setSelectedDoor(door);
        } else {
            setSelectedDoor(null);
        }
    }


    const resolveAgent = (company) => {
        const agent = availableAgents.filter(a => a.s_guid === company.s_warehouse_productivity_guid)[0];
        console.log(availableAgents);
        console.log(company);
        console.log(agent);
        return agent;
    }

    const assignDockDoor = (assignNewAgent, assignNewDoor) => {

        const s_unit = user && user.s_unit;
        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        const email = user && user.s_email;
        const dockGuid =  uuidv4();
        const warehouseGuid =  uuidv4();

        let dockDoor;
        let warehouseProductivity;

        if (assignNewAgent) {
            dockDoor = {
                s_modified_by: email,
                t_modified: now,
                s_previous_dock_door_guid: selectedCompany.s_dock_door_guid,
                s_dock_door_guid: dockGuid,
                s_assignor: email,
                s_assignee: selectedAgent.s_employee_email,
                t_assignor: now,
                s_unit
            }
        } else {
            dockDoor = {
                s_created_by: email,
                t_created: now,
                s_modified_by: email,
                t_modified: now,
                s_status: "BUSY",
                s_dock_door: selectedDoor,
                s_unit,
                s_guid: dockGuid,
                s_company: selectedCompany.s_trucking_company,
                s_driver: selectedCompany.s_trucking_driver,
                s_assignor: email,
                s_assignee: selectedAgent !== null ? selectedAgent.s_employee_email : null,
                t_assignor: now,
                b_in_use: true,
                s_status: 'BUSY',
                i_priority: 1
            }
        }

        if (assignNewDoor) {

            dockDoor.s_assignee = agentAlreadyAssigned.s_employee_email;

            warehouseProductivity = {
                s_status: 'NOT READY',
                t_modified: now,
                s_modified_by: email,
                id: agentAlreadyAssigned.id,
                s_guid: warehouseGuid
            }
        } else {
            warehouseProductivity = {
                s_status: 'NOT READY',
                t_modified: now,
                s_modified_by: email,
                id: selectedAgent === null ? null : selectedAgent.id,
                s_guid: warehouseGuid
            }
        }

        const data = {
            queue: {
                s_transaction_id: selectedCompany.s_transaction_id,
                t_modified: now,
                s_modified_by: email,
                s_dock_ownership: selectedAgent === null ? null :selectedAgent.s_employee_email,
                t_dock_ownership: now,
                s_status: 'DOCKING',
                s_dock_door: selectedDoor,
                t_dock_door: now,
                s_dock_door_assigned: email,
                s_dock_door_guid: dockGuid,
                s_warehouse_productivity_guid: warehouseGuid
            },
            dockDoor,
            warehouseProductivity,
            twilio: {
                s_trucking_company: selectedCompany.s_trucking_company,
                s_trucking_driver: selectedCompany.s_trucking_driver,
                s_trucking_cell: selectedCompany.s_trucking_cell,
                b_trucking_sms: selectedCompany.b_trucking_sms,
                s_dock_door: selectedDoor,
                s_dock_ownership: selectedAgent !== null ?selectedAgent.s_employee_email.toUpperCase().replace('@CHOICE.AERO', '') : null
            }
            //need to update the selectedAgent's status to busy for the selected shift.
            //for multiple shifts, there needs to be a way to mark a closed shift as 'CLOSED'
            //that way I won't read those shifts when searching for available/busy agents.
            //when an agent is selected - only a single ready shift item is selected.

        }

        const url = assignNewAgent ? 'assignNewAgent' : 'assignDockDoor';

        axios.post(`${baseApiUrl}/${url}`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setDockData(response.data);
            setModalAssignOpen(false);
            createSuccessNotification(`${selectedAgent.sc_employee_username} assigned to door ${selectedDoor}`);
            setSelectedAgent(null);
            setSelectedDoor(null);
        }).catch(error => {

        });
    }

    const handleSetSelectedAwbs = (awb) => {

        console.log(dockData);
        console.log(awb);
        let awbs;

        awbs = dockData.filter(d => d.s_mawb_id === awb.s_mawb_id);

        console.log(awbs);

        setSelectedAwbs(awbs);
    }

    const deliverDock = async (rack_id) => {
        const res = await axios.post(`${baseApiUrl}/deliverDock`, {
            data: {
                id: rack_id,
                t_modified: moment().local().format('MM/DD/YYYY HH:mm:ss'),
                s_modified_by: user.s_email,
                s_unit: user.s_unit
            }
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        });

        setModalLocationsOpen(false);
        setDockData(res.data);
    }

    const updateProcedure = (data, queueAwb, leftEarly=false) => {
        axios.post(`${baseApiUrl}/finishDocking`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setModalAssignOpen(false);
            setModalConfirmLeftEarlyOpen(false);
            setDockData(response.data);
            createSuccessNotification(`${leftEarly ? 'Marked as Left Early' : `${queueAwb.s_trucking_company} docking finished.`}`);
        }).catch(error => {

        });
    }

    const finishDocking = (queueAwb) => {

        const s_unit = user && user.s_unit;
        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        const email = user && user.s_email;

        const data = {
            t_modified: now,
            s_modified_by: email,
            s_dock_status: 'OPEN',
            i_priority: 1,
            b_in_use: 0,
            s_dock_guid: queueAwb.s_dock_door_guid,
            s_warehouse_status: 'READY',
            s_warehouse_productivity_guid: queueAwb.s_warehouse_productivity_guid,
            s_unit,
            s_queue_status: 'DOCKED',
            s_transaction_id: queueAwb.s_transaction_id
        }

        updateProcedure(data, queueAwb);

    }

    const markLeftEarly = (queueAwb) => {

        const s_unit = user && user.s_unit;
        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        const email = user && user.s_email;

        const data = {
            t_modified: now,
            s_modified_by: email,
            s_dock_status: 'OPEN',
            i_priority: 1,
            b_in_use: 0,
            s_dock_guid: queueAwb.s_dock_door_guid,
            s_warehouse_status: 'READY',
            s_warehouse_productivity_guid: queueAwb.s_warehouse_productivity_guid,
            s_unit,
            s_queue_status: 'LEFT DOCK',
            s_transaction_id: queueAwb.s_transaction_id
        }

        updateProcedure(data, queueAwb, true);

    }

    const sortCompaniesByCreated = (a, b) => b.t_created - a.t_created;

    const handleClearDoor = (dockDoorNumber) => {
        const companies = dockDoorsData.filter(d => d.s_dock_door !== null && d.s_dock_door.toString() === dockDoorNumber.toString());
        const sortedCompanies = companies.sort(sortCompaniesByCreated);
        const dockCompany = sortedCompanies[0];

        console.log(dockCompany);
        console.log(dockData);

        const queueAwb = dockData.filter(d => d.s_dock_door_guid !== null && d.s_dock_door_guid === dockCompany.s_guid)[0];

        console.log(queueAwb);

        const s_unit = user && user.s_unit;
        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        const email = user && user.s_email;

        const data = {
            t_modified: now,
            s_modified_by: email,
            s_dock_status: 'OPEN',
            i_priority: 1,
            b_in_use: 0,
            s_dock_guid: queueAwb.s_dock_door_guid,
            s_warehouse_status: 'READY',
            s_warehouse_productivity_guid: queueAwb.s_warehouse_productivity_guid,
            s_unit
        }

        updateProcedure(data);
    }

    const removeDockDoorAgent = (s_warehouse_productivity_guid, s_dock_door_guid) => {

        const now = moment().local().format('MM/DD/YYYY hh:mm A');

        const data = {
            t_modified: now,
            s_modified_by: email,
            s_warehouse_productivity_guid,
            s_warehouse_status: 'READY',
            s_queue_status: 'DOCKING',
            s_dock_door_guid,
            s_unit
        }

        axios.post(`${baseApiUrl}/removeDockDoorAgent`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            createSuccessNotification('Agent Unassigned');
            setDockData(response.data);
        }).catch(error => {

        });
    }

    const removeDockDoor = (s_dock_door_guid) => {

        const now = moment().local().format('MM/DD/YYYY hh:mm A');

        const data = {
            t_modified: now,
            s_modified_by: email,
            b_in_use: false,
            s_dock_door_guid,
            s_dock_door_status: 'OPEN',
            s_queue_status: 'DOCKING',
            s_unit
        }

        axios.post(`${baseApiUrl}/removeDockDoor`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            createSuccessNotification('Door Unassigned');
            setDockData(response.data);
        }).catch(error => {

        });
    }

    useEffect(() => {
        if (selectedAwbs.length > 0) {
            setModalLocationsOpen(true);
        }
    }, [selectedAwbs]);

    const handleExportAcceptPcs = (company) => {
        setSelectedCompany(company);
        setAcceptExportPcsIndex(acceptExportPcsIndex+1);
    }

    useEffect(() => {
        if (selectedCompany && selectedCompany !== null) {
            setModalAcceptExportPcsOpen(true);
        }
    }, [acceptExportPcsIndex]);

    const updateExportAcceptancePcs = () => {

        const data = {
            i_dock_accepted_pieces: exportAcceptancePcs,
            t_modified: moment().local().format('MM/DD/YYYY hh:mm A'),
            s_modified_by: email,
            s_mawb_id: selectedCompany.s_mawb_id
        }

        axios.post(`${baseApiUrl}/updateExportAcceptancePcs`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setModalAcceptExportPcsOpen(false);
            createSuccessNotification('Acceptance Pieces Updated');
        }).catch(error => {

        });
    }

    const handleReject = () => {

        const data = {
            b_dock_reject: true,
            s_dock_reject_reason,
            s_mawb_id: selectedCompany.s_mawb_id,
            s_status: 'REJECTED',
            s_modified_by: email,
            t_modified: moment().local().format('MM/DD/YYYY hh:mm A'),
            s_unit
        }

        axios.post(`${baseApiUrl}/rejectDockAwb`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setDockData(response.data);
            setModalRejectOpen(false);
            createSuccessNotification('AWB Rejected');
        }).catch(error => {

        });
    }

    const handleModalReject = (company) => {
        setSelectedCompany(company);
        setModalRejectOpen(true);
    }

    const handleModalConfirmLeftEarly = (company) => {
        setSelectedCompany(company);
        setModalConfirmLeftEarlyOpen(true);
    }

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <div className='col-12'>
                            <h1>Dock</h1>
                        </div>
                        {/* <div className={`${eightyWindow() ? 'col-12' : 'col-12'}`}> */}
                        <div className={`col-12`}>
                            {/* <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                                <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                                    <Row>
                                        <h4>Make a Selection:</h4>
                                    </Row>
                                    <Row>
                                        <h4>Date</h4>
                                        <input type='date' style={{display: 'inline'}} />
                                    </Row>
                                </CardBody>
                            </Card> */}
                            <TabCard 
                                dockData={dockData}
                                companies={companies}
                                eightyWindow={eightyWindow}
                                width={width}
                                handleAssign={handleAssign}
                                handleSetSelectedAwbs={handleSetSelectedAwbs}
                                finishDocking={finishDocking}
                                removeDockDoorAgent={removeDockDoorAgent}
                                removeDockDoor={removeDockDoor}
                                handleExportAcceptPcs={handleExportAcceptPcs}
                                handleModalReject={handleModalReject}
                                markLeftEarly={markLeftEarly}
                                handleModalConfirmLeftEarly={handleModalConfirmLeftEarly}
                            />
                        </div>
                    </Row>
                </div>
            </div>

            <ModalAssign 
                open={modalAssignOpen}
                handleModal={setModalAssignOpen}
                availableAgents={availableAgents}
                doors={doors}
                dockDoorsData={dockDoorsData}
                selectedAgent={selectedAgent}
                setSelectedAgent={setSelectedAgent}
                selectedDoor={selectedDoor}
                handleSetSelectedDoor={handleSetSelectedDoor}
                assignDockDoor={assignDockDoor}
                handleClearDoor={handleClearDoor}
                doorAlreadyAssigned={doorAlreadyAssigned}
                selectedCompany={selectedCompany}
                agentAlreadyAssigned={agentAlreadyAssigned}
            />

            <ModalLocations 
                open={modalLocationsOpen}
                handleModal={setModalLocationsOpen}
                selectedAwbs={selectedAwbs}
                setModalReportDamageOpen={setModalReportDamageOpen}
                deliverDock={deliverDock}
            />

            <ModalReportDamage 
                open={modalReportDamageOpen}
                handleModal={setModalReportDamageOpen}
                _user={user}
                selectedAwbs={selectedAwbs}
                createSuccessNotification={createSuccessNotification}
            />

            <ModalAcceptPcs 
                open={modalAcceptExportPcsOpen}
                handleModal={setModalAcceptExportPcsOpen}
                selectedCompany={selectedCompany}
                updateExportAcceptancePcs={updateExportAcceptancePcs}
                exportAcceptancePcs={exportAcceptancePcs}
                setExportAcceptancePcs={setExportAcceptancePcs}
            />

            <ModalRejectAwb 
                open={modalRejectOpen}
                handleModal={setModalRejectOpen}
                selectedCompany={selectedCompany}
                s_dock_reject_reason={s_dock_reject_reason}
                set_s_dock_reject_reason={set_s_dock_reject_reason}
                handleReject={handleReject}
            />

            <ModalConfirmLeftEarly 
                open={modalConfirmLeftEarlyOpen}
                handleModal={setModalConfirmLeftEarlyOpen}
                selectedCompany={selectedCompany}
                markLeftEarly={markLeftEarly}
            />



        </AppLayout>
    );
}

export default withRouter(Dock);