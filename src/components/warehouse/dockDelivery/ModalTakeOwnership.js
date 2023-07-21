import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col } from 'reactstrap';
import AwbCard from './AwbCard';
import { Wizard, Steps, Step } from 'react-albus';
import TopNavigation from '../../wizard-hooks/TopNavigation';
import {Tooltip} from 'react-tippy';
import axios from 'axios';
import { asyncHandler } from '../../../utils';
import classnames from 'classnames';
import moment from 'moment';

const WizardModal = ({ 
    modal,
    setModal,
    viewCompany,
    selectCompany,
    user,
    baseApiUrl, 
    headerAuthCode,
    takeDockDeliveryOwnership,
    releaseDockDriver,
    goToAwbs,
    removeDockDoorMobile,
    removeDockOwnership,
    leftEarlyDock,
    selectedType,
    haveAssignment,
    next, 
    previous, 
    push,
    step
}) => {

    console.log(viewCompany);

    // Dock Doors:
    const [dockDoors, setDockDoors] = useState([]);
    const [doorAlreadyAssigned, setDoorAlreadyAssigned] = useState(false);
    const [selectedDoor, setSelectedDoor] = useState('');

    const dockDoorsQuery = asyncHandler(async() => {
        console.log(`baseApiUrl = ${baseApiUrl}; headerAuthCode = ${headerAuthCode}; user = ${user.s_unit}`);
        const res = await axios.post(`${baseApiUrl}/dockDoorsQuery`, {
            data: {
                s_unit: user.s_unit
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });
        console.log(res.data);
        setDockDoors(res.data);
    });

    useEffect(() => {
        if (viewCompany) {
            if (viewCompany.s_dock_door && viewCompany.s_dock_door.length > 0) {
                setDoorAlreadyAssigned(true);
                setSelectedDoor(viewCompany.s_dock_door);
            } else {
                setDoorAlreadyAssigned(false);
                setSelectedDoor(null);
            }
        }
    }, [viewCompany]);

    const toggle = () => setModal(!modal);

    const enableTakeOwnership = (company) => {
        if (!company.s_dock_ownership) {
            return -1;
        } else {
            if (company.s_dock_ownership.toUpperCase() === user.s_email.toUpperCase()) {
                return 1;
            }
            return 0;
        }
    }

    const enableRemoveDoor = (door) => {
        return door.s_dock_door === viewCompany.s_dock_door;
    }

    const resolveEnableNext = () => true;

    const topNavClick = (stepItem, push) => {
        if (resolveEnableNext(stepItem)) {
            push(stepItem.id);
        }
    };

    useEffect(() => {
        step.id === '2' && dockDoorsQuery();
    }, [step]);

    const doorSelection = () => {
        next();
    }

    useEffect(() => {
        push('1');
    }, [modal]);

    const handleSelectDoor = (d) => {
        if (!d.b_in_use && !doorAlreadyAssigned) {
            setSelectedDoor(d.s_dock_door)
        }
    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <div className={'wizard-default'}>
                <ModalHeader className={'pt-2'}>
                    <TopNavigation 
                        className="justify-content-center"
                        disableNav={false}
                        topNavClick={topNavClick}
                    />
                </ModalHeader>
                <ModalBody>
                    <Steps>
                        <Step id={'1'} name={'Ownership'}>
                            <Row className={'mb-1'}>
                                <Col md={12}>
                                    <div className={'float-left'}>
                                        <h6>{viewCompany.s_trucking_company}</h6>
                                        <h6>{viewCompany.s_trucking_driver}</h6>
                                        <h6>Door: {viewCompany.s_dock_door && viewCompany.s_dock_door.length > 0 ? viewCompany.s_dock_door : 'None'}</h6>
                                    </div>
                                    <div className={'float-right'}>
                                        <i class="fas fa-user" style={{ fontSize: '24px' }}></i>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                            {
                                selectedType === 'MIXED' ?
                                    viewCompany && viewCompany.awbs && viewCompany.awbs.map((a, i) => (
                                        <AwbCard 
                                            awb={a}
                                            key={i}
                                            selectAwb={null}
                                        />
                                    )) :
                                    viewCompany && viewCompany.awbs && viewCompany.awbs.map((a, i) => a.s_type === selectedType && (
                                        <AwbCard 
                                            awb={a}
                                            key={i}
                                            selectAwb={null}
                                        />
                                    )) 
                            }
                            </Row>                            
                            <Row>
                                <Col md={12} className={"text-center"}>
                                {
                                    enableTakeOwnership(viewCompany) === 1 ?
                                        <div className={'mx-auto'}>
                                            {
                                                viewCompany.s_dock_door && viewCompany.s_dock_door.length > 0 && selectedDoor ?
                                                    <Button color={'info mb-2 mr-1'} onClick={() => goToAwbs(viewCompany)}>Continue to AWBs</Button> :
                                                    <Button color={'info mb-2 mr-1'} onClick={() => doorSelection()}>Select Door</Button>
                                            }
                                            <Button color="danger mb-2 mr-1" onClick={() => removeDockOwnership(viewCompany)}>Remove Ownership</Button>
                                            <Button color={'warning mb-2 mr-1'} onClick={() => releaseDockDriver(viewCompany)}>Release Driver</Button>
                                        </div> :
                                    enableTakeOwnership(viewCompany) === -1 ?  
                                        <>
                                            {
                                                !haveAssignment && <Button color="primary mr-1" onClick={() => doorSelection()}>Take Ownership</Button> 
                                            }
                                            <Button onClick={() => leftEarlyDock(viewCompany)} color={'warning mr-1'}>Left Early</Button>
                                        </> :
                                        <h6>Already Being Processed by {viewCompany.s_dock_ownership}</h6>
                                }
                                </Col>
                            </Row>
                        </Step>
                        <Step id={'2'} name={'Dock Door'}>
                            <Row>
                            {
                                dockDoors.map((d, i) => 
                                    <div 
                                        // className={`col text-center pt-4 ${resolveBusyDoor(d) === 2 ? 'flashing-yellow' : resolveBusyDoor(d) === 1 ? 'bg-danger' : selectedDoor !== null && selectedDoor === d.s_dock_door ? 'selected-door' : 'available-dock-door'}`} 
                                        className={classnames(
                                            { 'bg-danger': d.b_in_use && selectedDoor !== d.s_dock_door },
                                            { 'flashing-yellow text-dark': doorAlreadyAssigned && selectedDoor === d.s_dock_door },
                                            { 'selected-door': !doorAlreadyAssigned && (selectedDoor === d.s_dock_door) },
                                            { 'available-dock-door': selectedDoor !== d.s_dock_door },
                                            'col text-center pt-4'
                                        )}
                                        key={i} 
                                        style={{border: '4px solid black'}}
                                        onClick={() => handleSelectDoor(d)}
                                    >
                                        {
                                            enableRemoveDoor(d) ?
                                                <Tooltip 
                                                    html={(
                                                        <div style={{backgroundColor:'white'}}>
                                                            <Button onClick={() => removeDockDoorMobile(viewCompany)}>Clear</Button>
                                                        </div>
                                                    )}
                                                    position="top"
                                                    trigger="click"
                                                    theme='light'
                                                    size="big"
                                                    animateFisll={false}
                                                    interactive
                                                >
                                                    <h1>{d.s_dock_door}</h1>
                                                </Tooltip> :
                                                <h1>{d.s_dock_door}</h1>
                                        }
                                    </div>
                                )
                            }
                            </Row>
                            <Row>
                                <Col md={12} className={'text-center mt-2'}>
                                    {
                                        doorAlreadyAssigned ? 
                                            <h6>{viewCompany.s_trucking_company} already assigned to door {selectedDoor}</h6> :
                                        viewCompany && selectedDoor && 
                                            <Button onClick={() => takeDockDeliveryOwnership(viewCompany, selectedDoor)}>Assign {viewCompany.s_trucking_driver} to Door {selectedDoor}</Button>
                                    }
                                </Col>
                            </Row>
                        </Step> 
                    </Steps>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </div>
        </Modal>
    );
}

export default ({
    modal,
    setModal,
    viewCompany,
    selectCompany,
    user,
    baseApiUrl,
    headerAuthCode,
    takeDockDeliveryOwnership,
    releaseDockDriver,
    leftEarlyDock,
    goToAwbs,
    removeDockDoorMobile,
    removeDockOwnership,
    selectedType,
    haveAssignment
}) => {

    return (
        <Wizard render={({ next, previous, push, step }) => (
            <WizardModal 
                modal={modal}
                setModal={setModal}
                viewCompany={viewCompany}
                selectCompany={selectCompany}
                user={user}
                baseApiUrl ={baseApiUrl }
                headerAuthCode={headerAuthCode}
                takeDockDeliveryOwnership={takeDockDeliveryOwnership}
                goToAwbs={goToAwbs}
                removeDockDoorMobile={removeDockDoorMobile}
                removeDockOwnership={removeDockOwnership}
                releaseDockDriver={releaseDockDriver}
                leftEarlyDock={leftEarlyDock}
                selectedType={selectedType}
                haveAssignment={haveAssignment}
                next={next }
                previous ={previous }
                push={push}
                step={step}
            />
        )} />
    );
}