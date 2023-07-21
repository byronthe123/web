import React, { useState, useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../../../context/index';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table, Input, Row, Col } from 'reactstrap';
import { formatCost, formatEmail, formatMawb } from '../../../utils';
import moment from 'moment';
import ReactTooltip from "react-tooltip";
import { 
    IUpdateRefundRequest, 
    IManageRefundRequest, 
    IDeleteRefundRequest,
    RefundStatus, 
    IRefundRequest, 
    IManageRefundRequestData
} from './interfaces';
import { IMap, IPayment } from '../../../globals/interfaces';
import ReactTable from '../../custom/ReactTable';
import _ from 'lodash';
import Clipboard from '../../Clipboard';
import styled from 'styled-components';

const styles = {
    inputPreapprove: {
        display: 'inline-block',
        width: '100px'
    },
    largeIcon: {
        fontSize: '50px'
    }
}

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    selectedItem: IRefundRequest | undefined;
    payments: Array<IPayment>;
    updateRefundRequest: IUpdateRefundRequest;
    manageRefundRequest: IManageRefundRequest;
    deleteRefundRequest: IDeleteRefundRequest;
    filterStatus: RefundStatus; 
}

export default function ModalManage ({
    modal,
    setModal,
    selectedItem,
    payments,
    updateRefundRequest,
    manageRefundRequest,
    deleteRefundRequest,
    filterStatus
}: Props) {

    // console.log(selectedItem);

    const { user, createSuccessNotification, setLoading, searchAwb } = useContext(AppContext);
    const { handleSearchAwb } = searchAwb;

    const [f_amount_approved, set_f_amount_approved] = useState('');
    const [s_notes, set_s_notes] = useState('');

    useEffect(() => {
        set_f_amount_approved('');
        set_s_notes('');
    }, [modal]);

    const toggle = () => setModal(!modal);

    const statusColor = useMemo(() => {
        if (!selectedItem) {
            return '';
        }

        const { s_status } = selectedItem;
        if (s_status === 'APPROVED') {
            return 'success';
        } else if (s_status === 'DENIED') {
            return 'danger';
        } else {
            return 'warning';
        }
    }, [selectedItem]);

    const handleUpdate = async (s_status: RefundStatus) => {

        if (!selectedItem) {
            return;
        }

        setLoading(true);

        const now = new Date(moment().local().format('MM/DD/YYYY HH:mm:ss'));
        const useNotes = `${user.s_email} at ${now} • ${s_notes}`;

        if (filterStatus === 'PREAPPROVED') {
            if (finalApprovers[user.s_email.toLowerCase()]) {
                const data: IManageRefundRequestData = {
                    id: selectedItem.id,
                    s_final_approver: user.s_email,
                    b_approved: s_status === 'APPROVED' ? true : false,
                    s_status,
                    f_amount_approved: Number(f_amount_approved),
                    s_final_approval_notes: useNotes
                }
    
                await manageRefundRequest(data);
            } else {
                alert('You cannot perform this action.')
            }
        } else {
            const data = {
                id: selectedItem.id,
                s_mawb: selectedItem.s_mawb,
                s_hawb: selectedItem.s_hawb,
                s_status,
                f_amount_approved: s_status === 'PREAPPROVED' ? Number(f_amount_approved) : 0,
                s_notes: useNotes,
                s_modified_by: user.s_email,
                t_modified: now,
                b_approved: false,
                s_approver: s_status === 'PREAPPROVED' ? user.s_email : '',
                t_approved: s_status === 'PREAPPROVED' ? now : null,
                s_final_approver: '',
                t_final_approved: null
            }
    
            await updateRefundRequest(data);
        }

        setLoading(false);
        
        createSuccessNotification('Request Updated');
        toggle();
    }

    const handleDeleteRequest = async (id: number, s_mawb: string, s_hawb: string) => {
        await deleteRefundRequest(id, s_mawb, s_hawb);
        createSuccessNotification('Request Deleted');
        toggle();
    }

    const requestLength = useMemo(() => {
        if (!selectedItem) {
            return '';
        }   
        if (selectedItem.s_status === 'OPEN') {
            return `created ${moment().diff(moment(selectedItem.t_created), 'hours')} hours ago.`;
        } else if (selectedItem.s_status === 'PREAPPROVED') {
            return `preapproved ${moment(selectedItem.t_modified).diff(moment(selectedItem.t_created), 'hours')} hours ago.`
        } else {
            return `resolved in ${moment(selectedItem.t_modified).diff(moment(selectedItem.t_created), 'hours')} hours.`
        }
    }, [selectedItem]);

    // const enableApprove = () => (s_notes && s_notes.length > 0) && f_amount_approved > 0 && f_amount_approved <= selectedItem.f_amount;
    const enableApprove = useMemo(() => {
        return (
            (s_notes && s_notes.length > 0) && 
            Number(f_amount_approved) > 0 && 
            (selectedItem && Number(f_amount_approved) <= selectedItem.f_amount)
        );
    }, [f_amount_approved, s_notes, selectedItem]);

    const enableDeny = s_notes && s_notes.length > 0;

    const finalApprovers: IMap<boolean> = {
        'byron@choice.aero': true,
        'mozart@choice.aero': true,
        'screscenti@choice.aero': true,
        'mcasalinho@choice.aero': true,
        'kwang@choice.aero': true
    }

    const actionable = useMemo(() => {
        return selectedItem && 
            ['PREAPPROVED', 'OPEN'].includes(selectedItem.s_status.toUpperCase()) &&
            (_.get(selectedItem, 's_final_approver.length', 0) === 0);
    }, [selectedItem]);

    if (selectedItem) {
        return (
            <Modal isOpen={modal} toggle={toggle} className={'responsive-modal'} data-testid={'modal-manage-refund'}>
                <ReactTooltip />
                <ModalHeader>
                    <span className={'float-left'}>
                        Manage Request: {requestLength}
                    </span>
                    <span style={{ color: 'white', fontSize: '0px' }} id={'copyMawb'}>{selectedItem.s_mawb}</span>
                    <span className={'float-right'}>
                        <div>
                            Status: 
                            <button className={`ml-1 default btn btn-${statusColor}`}>
                                {selectedItem.s_status}
                            </button>
                        </div>
                        <div>
                            Airport: {selectedItem.s_airport}
                        </div>
                    </span>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={4}>
                            <Table>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>MAWB</td>
                                        <td>
                                            <FlexContainer>
                                                <p className={'hyperlink'} onClick={() => handleSearchAwb(null, selectedItem.s_mawb)}>{formatMawb(selectedItem.s_mawb)}</p>
                                                <Clipboard target={'copyMawb'} />
                                            </FlexContainer>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>HAWB</td>
                                        <td>{selectedItem.s_hawb}</td>
                                    </tr>
                                    <tr>
                                        <td>R-record</td>
                                        <td>{selectedItem.s_record}</td>
                                    </tr>
                                    <tr>
                                        <td>Submitted by</td>
                                        <td>{selectedItem.s_email}</td>
                                    </tr>
                                    <tr>
                                        <td>Payment for</td>
                                        <td>{selectedItem.s_type}</td>
                                    </tr>
                                    <tr>
                                        <td>Reason requested</td>
                                        <td>{selectedItem.s_reason}</td>
                                    </tr>
                                    <tr>
                                        <td>Created Date</td>
                                        <td>{moment(selectedItem.t_created).format('MM/DD/YYYY HH:mm:ss')}</td>
                                    </tr>
                                    <tr>
                                        <td>Last Modified</td>
                                        <td>{moment(selectedItem.t_created).format('MM/DD/YYYY HH:mm:ss')} by {formatEmail(selectedItem.s_modified_by)}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={8}>
                            <h6>Payments for this MAWB</h6>
                            <Row>
                                <Col md={12}>
                                    <ReactTable 
                                        data={payments}
                                        mapping={[{
                                            name: 'Created',
                                            value: 't_created',
                                            datetime: true,
                                            utc: true
                                        }, {
                                            name: 'HAWB',
                                            value: 's_hawb'
                                        }, {
                                            name: 'Method',
                                            value: 's_payment_method'
                                        }, {
                                            name: 'Type',
                                            value: 's_payment_type'
                                        }, {
                                            name: 'Amount',
                                            value: 'f_amount',
                                            money: true
                                        }]}
                                        numRows={5}
                                    />
                                </Col>
                            </Row>
                            <Row className={'mt-3'}>
                                <Col md={6}>
                                    <h6>Amount requested: {formatCost(selectedItem.f_amount)}</h6>
                                </Col>
                                <Col md={6} className={'text-right'}>
                                    <h6 className={'d-inline mr-2'}>Pre Approve Amount</h6>
                                    {
                                        selectedItem.s_status === 'OPEN' ? 
                                            <Input style={ styles.inputPreapprove } value={f_amount_approved} onChange={(e: any) => set_f_amount_approved(e.target.value)} /> :
                                            <Input style={ styles.inputPreapprove } value={formatCost(selectedItem.f_amount_approved)} disabled />
                                    }
                                </Col>
                            </Row>
                            <Row className={'mt-3'}>
                                <Col md={3}>
                                    <h6>Reason</h6>
                                </Col>
                                <Col md={9}>
                                    {
                                        selectedItem.s_status === 'OPEN' ? 
                                            <Input type={'textarea'} value={s_notes} onChange={(e: any) => set_s_notes(e.target.value)} /> :
                                            selectedItem.s_notes && selectedItem.s_notes.split('•').map((note, i) => note && (
                                                <p key={i}>{note}</p>
                                            ))
                                    }
                                </Col>
                            </Row>
                            {
                                selectedItem.s_status === 'PREAPPROVED' ?
                                    <>
                                        <Row>
                                            <Col md={12} className={'text-right'}>
                                                <h6 className={'d-inline mr-2'}>Final Approve Amount</h6>
                                                <Input style={ styles.inputPreapprove } value={f_amount_approved} onChange={(e: any) => set_f_amount_approved(e.target.value)} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={3}>
                                                <h6>Notes</h6>
                                            </Col>
                                            <Col md={9}>
                                                <Input type={'textarea'} value={s_notes} onChange={(e: any) => set_s_notes(e.target.value)} />
                                            </Col>
                                        </Row>
                                    </>
                                    : selectedItem.s_status === 'APPROVED' ?
                                    <Row>
                                        <Col md={12} className={'text-right'}>
                                            <h6 className={'d-inline mr-2'}>Final Approve Amount</h6>
                                            <Input style={ styles.inputPreapprove } value={formatCost(selectedItem.f_amount_approved)} disabled />
                                        </Col>
                                    </Row>
                                    : ''
                            }
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter style={{ width: '100%' }}>
                    <Row style={{ width: '100%' }}>
                        {
                            actionable ?
                                <>
                                    <Col md={4} className={'text-left'}>
                                        <i 
                                            className={`fa-solid fa-trash-can`} 
                                            style={styles.largeIcon}
                                            data-tip={'Delete'}
                                            onClick={() => handleDeleteRequest(selectedItem.id, selectedItem.s_mawb, selectedItem.s_hawb)}
                                        />
                                    </Col>
                                    <Col md={4} className={'text-center'} style={styles.largeIcon}>
                                        <i 
                                            className={`fa-solid fa-circle-xmark text-danger ${!enableDeny && 'custom-disabled'}`} 
                                            style={styles.largeIcon}
                                            data-tip={'Deny'}
                                            onClick={() => handleUpdate('DENIED')}
                                        />
                                    </Col>
                                    <Col md={4} className={'text-right'}>
                                        <i 
                                            className={`fa-solid fa-circle-check text-success ${!enableApprove && 'custom-disabled'}`}
                                            style={styles.largeIcon}
                                            data-tip={'Approve'}
                                            onClick={() => handleUpdate(filterStatus === 'PREAPPROVED' ? 'APPROVED' : 'PREAPPROVED')}
                                        />
                                    </Col>
                                </> : 
                                <Col md={12}>
                                    <h6>No further actions can be taken.</h6>
                                </Col>
                        }

                    </Row>
                </ModalFooter>
            </Modal>
        );    
    } else {
        return null;
    }

}

const FlexContainer = styled.div`
    display: flex;
    gap: 20px;
`;