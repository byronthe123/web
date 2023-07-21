import React, { useState, useEffect, useMemo } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import CompanyCardDetails from './CompanyCardDetails';
import Select from 'react-select';
import { ICompany, ProcessingAgentsMap, SelectedTypeOptions, IExtendedSelectOption } from './interfaces';
import { IActiverUsers, IQueue, ISelectOption, IUser, IMap } from '../../../globals/interfaces';
import { defaultSelectOption } from '../../../globals/defaults';
import { renderActiveQueueUser } from './utils';

const styles = {
    dot: {
        height: 10,
        width: 10,
        borderRadius: '50%'
    }
}

interface Props {
    modal: boolean;
    setModal: (modal: boolean) => void;
    selectedCompany: ICompany;
    selectedType: SelectedTypeOptions;
    isMyAssignment: (awb: IQueue) => boolean;
    myAssignmentCompany: ICompany;
    takeOwnership: (
        selectedCompany: ICompany,
        selectedType: SelectedTypeOptions,
        useEmail: string,
    ) => Promise<void>;
    removeCompanyOwnership: () => Promise<void>;
    checkIsWaiting: (company: ICompany, selectedType: SelectedTypeOptions) => boolean;
    user: IUser;
    activeUsers: IActiverUsers;
    processingAgentsMap: ProcessingAgentsMap;
    handleReject: (awb: IQueue) => void;
    handleSearchAwb: (e: any, overrideSearchAwb: string) => Promise<void>
}

export default function ModalViewCompany ({
    modal,
    setModal,
    selectedCompany,
    selectedType,
    isMyAssignment,
    myAssignmentCompany,
    takeOwnership,
    removeCompanyOwnership,
    user,
    activeUsers,
    processingAgentsMap,
    handleReject,
    handleSearchAwb
}: Props) {

    const [selectedOption, setSelectedOption] = useState<ISelectOption>(defaultSelectOption);
    const [assignOptions, setAssignOptions] = useState<Array<ISelectOption>>([]);

    useEffect(() => {
        const mainOption: IExtendedSelectOption = {
            value: user.s_email,
            label: `${user.displayName} (myself)`,
            busy: processingAgentsMap[user.s_email] 
        }

        if (user.i_access_level < 3) {
            setSelectedOption(mainOption);
            setAssignOptions([mainOption]);
        } else {
            const options = [mainOption];
            Object.keys(activeUsers).map((key) => activeUsers[key].s_email !== user.s_email && renderActiveQueueUser(activeUsers[key], user.s_unit) && options.push({
                value: key,
                label: activeUsers[key].displayName,
                busy: processingAgentsMap[activeUsers[key].s_email] 
            }));
            setAssignOptions(options);
        }
    }, [user.s_email, user.s_unit, activeUsers, user.displayName, user.i_access_level, processingAgentsMap]);

    const toggle = () => setModal(!modal);

    const status = selectedCompany.s_status === 'WAITING' ?
        selectedCompany.s_status : 
        `Being Processed by ${selectedCompany.s_counter_ownership_agent}`;

    const resolveEnableAssign = useMemo(() => {
        if (!selectedOption || !selectedOption.value) {
            return false;
        } else if (selectedOption.value === user.s_email) {
            return myAssignmentCompany.awbs.length === 0;
        } else {
            return !processingAgentsMap[selectedOption.value];
        }
    }, [selectedOption, user.s_email, myAssignmentCompany.awbs.length, processingAgentsMap]);

    const formatOptionLabel = (option: IExtendedSelectOption) => {
        const { label, busy } = option
        return (
            <div>
                {
                    option.label &&
                    <span style={styles.dot} className={`float-left mr-3 mt-1 ${busy ? 'bg-danger' : 'bg-success'}`}></span>
                }
                <span>{label}</span>
            </div>
        );
    };

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} data-testid={'modal-company'} className={'step-2'} style={{ maxWidth: '100%', width: '600px' }}>
                <ModalHeader>
                    <p 
                        data-testid={'modal-company-name'}
                    >
                        {selectedCompany.s_trucking_company} ({selectedCompany.s_trucking_driver})
                    </p>
                    <p 
                        className='mb-0 mt-1' 
                        style={{ fontSize: '14px' }}
                        data-testid={'modal-company-status'}
                    >
                        Status: {status}
                    </p>
                </ModalHeader>
                <ModalBody style={{ maxHeight: '500px', overflowY: 'scroll' }}>
                    {

                        selectedCompany.awbs.map((awb, i) => awb.s_transaction_id === selectedCompany.s_transaction_id &&
                            <CompanyCardDetails 
                                user={user}
                                awb={awb} 
                                isMyAssignment={isMyAssignment} 
                                selectedType={selectedType}
                                handleReject={handleReject}
                                handleSearchAwb={handleSearchAwb}
                                key={awb.s_mawb_id}
                            /> 
                        )
                    }
                </ModalBody>
                <ModalFooter style={{ width: '100%' }} className={'pl-0 '}>
                    <Row style={{ width: '100%' }}>
                        <Col md={12}>
                            {
                                selectedCompany.s_status === 'WAITING' && 
                                <Row>
                                    <Col md={1}>
                                        <p className={'mt-2'}>Assign</p>
                                    </Col>
                                    <Col md={6}>
                                        <Select 
                                            value={selectedOption}
                                            options={assignOptions}
                                            onChange={(selectedOption: IExtendedSelectOption) => setSelectedOption(selectedOption)}
                                            formatOptionLabel={(option: IExtendedSelectOption) => formatOptionLabel(option)}
                                        />
                                    </Col>
                                    <Col md={2} className={'mt-2'}>
                                        {
                                            (!selectedOption || !selectedOption.value) ? 
                                            '' :
                                            resolveEnableAssign ?
                                                <h6 className={'text-success'}>Free</h6> : 
                                                <h6 className={'text-danger'}>Busy</h6>
                                        }
                                    </Col>
                                    <Col md={3}>
                                        <Button 
                                            color="primary" 
                                            onClick={() => takeOwnership(selectedCompany, selectedType, String(selectedOption.value))}
                                            data-testid={'btn-take-ownership'}
                                            disabled={!resolveEnableAssign}
                                            className={'float-right'}
                                        >
                                            Confirm
                                        </Button>
                                    </Col>
                                </Row>
                            }
                            <Row className={'mt-3 text-right'}>
                                <Col md={12}>
                                    {/* {
                                        selectedCompany.s_status === 'WAITING' && 
                                        <Button 
                                            color='danger' 
                                            onClick={() => markLeftEarly(selectedCompany)}
                                            data-testid={'btn-left-early'}
                                            className={'mr-2 float-left'}
                                        >
                                            Left Early
                                        </Button>
                                    } */}
                                    {
                                        (user.i_access_level >= 3 && selectedCompany.s_status === 'DOCUMENTING') && 
                                        <Button color='warning' onClick={() => removeCompanyOwnership()}>Remove Ownership</Button>
                                    }
                                    <Button color="secondary" onClick={toggle}>Close</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </ModalFooter>
            </Modal>
        </div>
    );
}

