import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-tippy/dist/tippy.css'
import {Tooltip} from 'react-tippy';

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Input,
    Label,
    Row,
    Form,
    Col,
    Table
  } from "reactstrap";
import moment from 'moment';

const ModalAssign = ({
    open, 
    handleModal,
    availableAgents,
    doors,
    dockDoorsData,
    selectedAgent,
    setSelectedAgent,
    selectedDoor,
    handleSetSelectedDoor,
    assignDockDoor,
    handleClearDoor,
    doorAlreadyAssigned,
    selectedCompany,
    agentAlreadyAssigned
}) => {

    console.log(doors);

    const getDoorArray = () => {
        const array = [];
        for (let i = 0; i < doors.length; i++) {
            array.push(doors[i].s_dock_door)
        }
        console.log(array);
        return array;
    }

    const resolveBusyDoor = (number) => {
        const found = dockDoorsData.filter(d => d.s_dock_door === number.toString() && d.s_status === 'BUSY');
        if (found.length > 0 && number === doorAlreadyAssigned) {
            return 2;
        } else if (found.length > 0) {
            return 1;
        } else {
            return 0;
        }
        //problem with this logic: what if the busy door is old and there is a new dock door record which is OPEN?
    }


    const enableAssign = () => {
        return selectedAgent !== null || selectedDoor !== null;
    }

    const assignNewAgent = () => doorAlreadyAssigned !== null && doorAlreadyAssigned.length > 0;
        //more logic to check selected company status?

    const assignNewDockDoor = () => {
        console.log(agentAlreadyAssigned);
        console.log(agentAlreadyAssigned && agentAlreadyAssigned !== null && agentAlreadyAssigned.s_employee_email.length > 0);
        return agentAlreadyAssigned && agentAlreadyAssigned !== null && agentAlreadyAssigned.s_employee_email.length > 0;
    }

    return (
        <Modal isOpen={open} toggle={() => handleModal(!open)} className='mx-auto'>
            <div className="modal-content px-5" style={{width: '900px', marginLeft: '-200px'}}>
                <div className="modal-body mx-auto">
                    <div className='text-center'>
                        <h1>Assign Agent</h1>
                    </div>
                    <div>
                        <Row>
                            <Col md={6} className='pr-5'>
                                <Row>
                                    <h4>Available Agents: {assignNewDockDoor()}</h4>
                                </Row>
                                <Row>
                                    <Table className='table-row-hover'>
                                        <thead></thead>
                                        <tbody>
                                        {
                                            availableAgents.map((a, i) => a.s_status === 'READY' &&
                                                <tr onClick={() => !assignNewDockDoor() && setSelectedAgent(a)} className={selectedAgent && selectedAgent !== null && selectedAgent.id === a.id ? 'table-row-selected' : ''} key={i}>
                                                    <td>{a.sc_employee_username}</td>
                                                </tr>
                                            )
                                        }
                                        </tbody>
                                    </Table>
                                </Row>
                                <Row>
                                    <h4 className='text-danger'>Not Available:</h4>
                                </Row>
                                <Row>
                                    <Table striped>
                                        <thead></thead>
                                        <tbody>
                                        {
                                            availableAgents.map((a, i) => a.s_status !== 'READY' &&
                                                <tr key={i}>
                                                    <td>{a.sc_employee_username}</td>
                                                </tr>
                                            )
                                        }
                                        </tbody>
                                    </Table>
                                </Row>
                                {
                                    assignNewDockDoor() && 
                                    <h4>Already Assigned to {selectedCompany.s_trucking_company}: {selectedCompany.s_dock_ownership}</h4>
                                }
                            </Col>
                            <Col md={6}>
                                <Row>
                                    <h4>Assign Door:</h4>
                                </Row>
                                <Row>
                                    {
                                        getDoorArray().map((d, i) => 
                                        <div onClick={() => !assignNewAgent() && handleSetSelectedDoor(d)} className={`col text-center pt-4 ${resolveBusyDoor(d) === 2 ? 'flashing-yellow' : resolveBusyDoor(d) === 1 ? 'bg-danger' : selectedDoor !== null && selectedDoor === d ? 'selected-door' : 'available-dock-door'}`} key={i} style={{border: '4px solid black'}}>
                                                {
                                                    resolveBusyDoor(d) ?
                                                    <Tooltip 
                                                        html={(
                                                            <div style={{backgroundColor:'white'}}>
                                                                <Button onClick={() => handleClearDoor(d)}>Clear</Button>
                                                            </div>
                                                        )}
                                                        position="top"
                                                        trigger="click"
                                                        theme='light'
                                                        size="big"
                                                        animateFill={false}
                                                        interactive
                                                        // onShow={() => setFormatSelected(true)}
                                                        // onHide={() => setFormatSelected(false)}
                                                    >
                                                    <h1>{d}</h1>
                                                    </Tooltip> :
                                                    <h1>{d}</h1>
                                                }
                                            </div>
                                        )
                                    }
                                </Row>
                                <Row className='mt-3'>
                                    <Col md='12 text-right'>
                                        {
                                            selectedAgent !== null && selectedDoor !== null &&  
                                            <h4 className='mt-2' style={{float: 'left'}}>Assign {selectedAgent.sc_employee_username} to Door {selectedDoor}</h4> 
                                        }
                                        <Button style={{float: 'right'}} color='primary' disabled={!enableAssign()} onClick={() => assignDockDoor(assignNewAgent(), assignNewDockDoor())}>Finalize</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ModalAssign;