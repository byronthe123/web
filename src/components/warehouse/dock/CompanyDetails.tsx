import React, { useState, useEffect, useMemo } from 'react';
import { Button, Modal, ModalBody, Col, Row, Input } from 'reactstrap';
import _ from 'lodash';
import dayjs from 'dayjs';
import moment from 'moment';

import { IAwbRackDataMap, ICompany, IDockAwb, IDoors, LaunchModalReject } from './interfaces';
import { formatEmail } from '../../../utils';
import { defaultDockAwb } from './defaultValues';
import { IUser, IActiveUser, IActiverUsers } from '../../../globals/interfaces';
import useBreakpoint from '../../../customHooks/useBreakpoint';

const resolveLocationsCount = (awbs: Array<IDockAwb>) => {
    const count = awbs.reduce((total, current) => total += current.s_location !== null ? 1 : 0, 0);
    return count;
}

interface Props {
    modal: boolean,
    setModal: (state: boolean) => void,
    selectedCompany: ICompany,
    rackDataMap: IAwbRackDataMap,
    user: IUser,
    availableDoors: IDoors,
    activeUsers: IActiverUsers,
    selectedDoor: string, 
    setSelectedDoor: (state: string) => void,
    selectedAgent: string,
    setSelectedAgent: (state: string) => void,
    assignDockDoor: (selectedDoor: string, selectedAgent: string) => Promise<void>,
    removeDockDoorOrAgent: (type: 'DOOR' | 'AGENT') => Promise<void>,
    setStep: (step: number) => void,
    launchModalReject: LaunchModalReject
}

export default function CompanyDetails ({
    modal,
    setModal,
    selectedCompany,
    rackDataMap,
    user,
    availableDoors,
    activeUsers,
    assignDockDoor,
    removeDockDoorOrAgent,
    setStep,
    launchModalReject
}: Props) {

    console.log(rackDataMap);

    const { width } = useBreakpoint();
    const ipadBreakpoint = width < 900;

    const dockPath = '/EOS/Operations/Warehouse/Dock';

    const toggle = () => setModal(!modal);
    const [companyDetails, setCompanyDetails] = useState<IDockAwb>(defaultDockAwb);
    const [totalLocations, setTotalLocations] = useState(0);

    useEffect(() => {
        if (selectedCompany.awbs.length > 0) {
            setCompanyDetails(selectedCompany.awbs[0]);
        }
        setTotalLocations(resolveLocationsCount(selectedCompany.awbs));
    }, [selectedCompany]);

    const assignedDoor = selectedCompany.s_dock_door;

    const assignedAgent = selectedCompany.s_dock_ownership;

    const dockMaster = (user.i_access_level >= 3 || user.s_email === assignedAgent);

    const handleNext = () => {
        setStep(2);
        setModal(false);
    }

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalBody>
                <Row>
                    <Col md={ipadBreakpoint ? 12 : 6}>
                        <Row>
                            <Col md={12}>
                                <i className="fa-solid fa-left mr-2 d-inline text-success" onClick={toggle} style={{ fontSize: '40px' }}></i>
                                <h3 className={'d-inline'}>
                                    {companyDetails.s_trucking_driver.substring(0, 12)} / {companyDetails.s_trucking_company.substring(0, 10)}
                                </h3>
                            </Col>
                        </Row>
                        <img 
                            src={companyDetails.s_driver_photo_link || ''}  
                            style={{ objectFit: 'cover', width: '380px', height: '265px' }} 
                            className={'mb-3'}
                        />
                    </Col>
                    <Col md={ipadBreakpoint ? 12 : 6} className={'text-center'}>
                        <Row>
                            <Col md={6}>
                                <h6 className={'mt-3'}>Customer AWBS ({selectedCompany.awbs.length})</h6>
                            </Col>
                            <Col md={6} className={'text-right'}>
                                {
                                    dockMaster &&
                                    <>
                                        {/* <Button 
                                            color={'danger'} 
                                            className={'text-white mb-2 d-inline'}
                                        >
                                            Remove
                                        </Button>  */}
                                        <Button 
                                            color={'danger'} 
                                            className={'text-white mb-2 d-inline extra-large-button-text'}
                                            onClick={() => launchModalReject('COMPANY')}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                }
                            </Col>
                        </Row>
                        <Row style={{ height: '240px', overflowY: 'scroll' }}>
                            <Col md={12}>
                                {
                                    selectedCompany.awbs.map((awb, i) => (
                                        <div 
                                            style={{
                                                borderRadius: "0.75rem", 
                                                backgroundImage: `url(/assets/img/${awb.s_type === 'EXPORT' ? 'bg-blue-sm.png' : 'bg-green-sm.png'})`, 
                                                backgroundRepeat: 'no-repeat', 
                                                backgroundSize: 'cover',
                                                textAlign: 'center',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}
                                            key={i}
                                        >
                                            <h6>{awb.s_mawb.substring(0, 3)} / {`${_.get(rackDataMap[awb.s_mawb], 'fwbPieces', '')} Pieces`}</h6>
                                            <h6>SHC: {_.get(rackDataMap[awb.s_mawb], 'rackShc', '')}</h6>
                                        </div>
                                    ))
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        {/* @ts-ignore */}
                        <h6>Office Processed: {moment(companyDetails.t_counter_end).utc().format('MM/DD/YYYY HH:mm')} by {formatEmail(companyDetails.s_counter_ownership_agent)}</h6>
                        <h6>
                            {
                                selectedCompany.s_dock_ownership ? 
                                    `Current Processing Time: ${selectedCompany.processingTime}` :
                                    `Current Wait Time: ${selectedCompany.waitTime}`
                            }
                        </h6>
                    </Col>
                </Row>
                <Row className={'mt-2'}>
                    <Col md={ipadBreakpoint ? 12 : 6}>
                        <h6>{assignedDoor ? '' : 'Assign'} Dock Door</h6>
                        {
                            assignedDoor ? 
                                <Input value={assignedDoor} disabled /> : 
                                <Input type={'select'} onChange={(e: any) => assignDockDoor(e.target.value, '')}>
                                    <option value={''}></option>
                                    {
                                        Object.keys(availableDoors).map((key, i) => (
                                            <option value={key} key={i}>{key}</option>
                                        ))
                                    }
                                    <option value={'TEST'}>TEST</option>
                                </Input>
                        }
                        {
                            dockMaster && assignedDoor && 
                            <Button 
                                className={'mt-2 extra-large-button-text'}
                                onClick={() => removeDockDoorOrAgent('DOOR')}
                            >
                                    Remove Dock Door
                            </Button>
                        }                    
                    </Col>
                    <Col md={ipadBreakpoint ? 12 : 6} className={`${ipadBreakpoint && 'mt-2'}`}>
                        <h6>{assignedAgent ? '' : 'Assign'} Agent</h6>
                        {
                            assignedAgent ? 
                                <Input value={assignedAgent} disabled /> : 
                                    <Input type={'select'} onChange={(e: any) => assignDockDoor('', e.target.value)}>
                                        <option value={''}></option>
                                        {
                                            dockMaster ? 
                                                Object.keys(activeUsers).map((key, i) => user.s_email === key && activeUsers[key].path === dockPath && (
                                                    <option value={key} key={i}>{activeUsers[key].displayName}</option>
                                                )) :
                                                <option value={user.s_email}>{user.displayName}</option>
                                        }
                                    </Input>
                        }
                        {
                            dockMaster && assignedAgent &&
                            <Button 
                                className={`mt-2 extra-large-button-text`}
                                onClick={() => removeDockDoorOrAgent('AGENT')}
                            >
                                Remove Ownership
                            </Button>
                        }
                    </Col>
                    {
                        assignedDoor && assignedAgent && 
                        <Col md={12} 
                            className={`${ipadBreakpoint ? 'mt-2 d-flex align-items-end justify-content-end' : 'text-right'}`}
                            onClick={() => handleNext()}
                        >
                            <Button className={'extra-large-button-text'}>Next</Button>
                        </Col>

                    }
                    <Col md={12} className={'mt-2'}>
                        <h6>Last modified by {_.get(companyDetails, 's_modified_by', '')} at {moment(_.get(companyDetails, 't_modified', new Date())).utc().format('MM/DD/YYYY HH:mm')}</h6>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
}