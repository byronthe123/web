import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Table } from 'reactstrap';
import moment from 'moment';
import { api, formatMawb } from '../../../utils';
import ExportData from './ExportData';
import RejectionNotice from '../../counter/import/RejectionNotice';
import PaymentReceipt from '../../counter/import/PaymentReceipt';
import { renderToString } from 'react-dom/server';
import ImportData from './ImportData';
import { Charge } from '../../counter/import/ChargeClass';
import _ from 'lodash';

export default function DataModal ({
    modal,
    setModal,
    selectedRecord,
    s_type,
    handleViewFile,
    files,
    user,
    stationInfo,
    handleSearchAwb,
    generateImportDeliverySheet,
    setFiles
}) {

    const toggle = () => setModal(!modal);

    const [statusColor, setStatusColor] = useState('');

    useEffect(() => {
        if (s_type === 'IMPORT') {
            setStatusColor(selectedRecord.b_delivered ? 'success' : selectedRecord.b_counter_reject ? 'danger' : 'warning');
        } else {
            setStatusColor(selectedRecord.s_status === 'DELIVERED' ? 'success' : selectedRecord.b_counter_reject ? 'danger' : 'warning');
        }
    }, [s_type, selectedRecord]);

    const printPaymentReceipt = async() => {
        const res = await api('post', 'selectCargoSprintPayments', { s_awb: selectedRecord.s_mawb });
        const allPayments = res.data || [];
        const payments = allPayments.filter(p => (p.s_payment_method !== 'OVERRIDE') || (p.s_payment_method === 'OVERRIDE' && p.b_override_approved));
        const hmPayment = allPayments.find(p => p.s_payment_type === 'H&M');
        const hmCharge = new Charge(_.get(hmPayment, 'f_amount', 0));

        const sheet = renderToString(
            <PaymentReceipt 
                selectedAwb={selectedRecord}
                user={user}
                isc={selectedRecord.f_charge_isc}
                totalStorage={selectedRecord.f_charge_storage}
                storageDescription={'Storage'}
                totalCharges={selectedRecord.f_paid_total}
                credits={selectedRecord.f_balance_offset}
                totalPaid={selectedRecord.f_paid_total}
                balanceDue={selectedRecord.f_balance_total}
                payments={payments}
                stationInfo={stationInfo}
                hmCharge={hmCharge}
            />
        );
        
        const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
        myWindow.document.body.innerHTML = null;
        myWindow.document.write(sheet);
    }

    const printRejectionNotice = () => {
        const rejectionNotice = renderToString(
            <RejectionNotice 
                selectedAwb={selectedRecord}
                user={user}
                s_driver_company={selectedRecord.s_driver_company}
                s_driver_name={selectedRecord.s_driver_name}
                t_kiosk_submittedtime={selectedRecord.t_kiosk_submittedtime}
                t_counter_start_time={selectedRecord.t_counter_start_time}
                s_counter_assigned_agent={selectedRecord.s_counter_assigned_agent}
                t_counter_reject_time={selectedRecord.t_counter_reject_time}
                s_counter_reject_reason={selectedRecord.s_counter_reject_reason}
                f_charge_isc={selectedRecord.f_charge_isc}
                f_charge_storage={selectedRecord.f_charge_storage}
                f_charge_others={selectedRecord.f_charge_others}
                f_charges_total={selectedRecord.f_charges_total}
                f_paid_online={selectedRecord.f_paid_online}
                f_paid_cash={selectedRecord.f_paid_cash}
                f_paid_check={selectedRecord.f_paid_check}
                f_paid_total={selectedRecord.f_paid_total}
                f_balance_offset={selectedRecord.f_balance_offset}
                i_pieces={selectedRecord.i_pieces}
                f_weight={selectedRecord.f_weight}
                d_last_arrival_date={selectedRecord.d_last_arrival_date}
                stationInfo={stationInfo}
                s_notes={selectedRecord.s_notes}
            />
        )
        const myWindow = window.open('', 'MsgWindow', 'width=1920,height=1080');
        myWindow.document.body.innerHTML = null;
        myWindow.document.write(rejectionNotice);
    }

    return (
        <Modal isOpen={modal} toggle={toggle} style={{ maxWidth: '1200px', width: '100%' }}>
            <ModalHeader>
                <span className={'float-left'}>
                    {s_type === 'IMPORT' ? 'Delivery' : 'Acceptance'} Details for MAWB {formatMawb(selectedRecord.s_mawb)} and HAWB {selectedRecord.s_hawb}
                </span>
                <span className={'float-right'}>
                    Last Known Status: <button className={`default btn btn-${statusColor}`}>{selectedRecord.s_status}</button>
                </span>
            </ModalHeader>
            <ModalBody>
                {
                    s_type === 'IMPORT' ? 
                        <ImportData 
                            selectedRecord={selectedRecord}
                            handleViewFile={handleViewFile}
                            files={files}
                            handleSearchAwb={handleSearchAwb}
                            generateImportDeliverySheet={generateImportDeliverySheet}
                            user={user}
                            setFiles={setFiles}
                        /> :
                        <ExportData 
                            selectedRecord={selectedRecord}
                            handleViewFile={handleViewFile}
                            files={files}
                            handleSearchAwb={handleSearchAwb}
                            user={user}
                            setFiles={setFiles}
                        />
                }
            </ModalBody>
            <ModalFooter>
                <Row style={{ width: '100%' }}>
                    <Col md={12}>
                        <div className={'float-left'}>
                            <p>Created by: {selectedRecord.s_created_by} at {moment.utc(selectedRecord.t_created).format('MM/DD/YYYY HH:mm:ss')}</p>
                            <p>Modified by: {selectedRecord.s_modified_by} at {moment.utc(selectedRecord.t_modified).format('MM/DD/YYYY HH:mm:ss')}</p>
                        </div>
                        <div className={'float-right'}>
                            <Button 
                                className={'d-inline mr-2'}
                                color={'info'}
                                onClick={() => printPaymentReceipt()}
                            >
                                Print Payment Receipt
                            </Button>
                            {
                                s_type === 'IMPORT' && selectedRecord.s_status === 'REJECTED' && 
                                <Button 
                                    className={'d-inline mr-2'}
                                    color={'primary'}
                                    onClick={() => printRejectionNotice()}
                                >
                                    Print Rejection Notice
                                </Button>
                            }
                            <Button 
                                className={'d-inline'}
                                onClick={() => toggle()}
                            >
                                Close
                            </Button>
                        </div>
                    </Col>
                </Row>
            </ModalFooter>
        </Modal>
    );
}