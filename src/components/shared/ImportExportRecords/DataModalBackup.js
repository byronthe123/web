import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Table } from 'reactstrap';
import moment from 'moment';
import { formatMawb, formatCost } from '../../../utils';

export default ({
    modal,
    setModal,
    selectedRecord,
    handleViewFile,
    files
}) => {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} style={{ maxWidth: '1200px', width: '100%' }}>
            <ModalHeader>
                <span className={'float-left'}>
                    Delivery Details for MAWB {formatMawb(selectedRecord.s_mawb)} and HAWB {selectedRecord.s_hawb}
                </span>
                <span className={'float-right'}>
                    Last Known Status: <button className={`default btn btn-${selectedRecord.b_delivered ? 'success' : selectedRecord.b_counter_reject ? 'danger' : 'warning'}`}>{selectedRecord.s_status}</button>
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
                                    <td>{formatMawb(selectedRecord.s_mawb)}</td>
                                </tr>
                                <tr>
                                    <td>HAWB</td>
                                    <td>{selectedRecord.h_mawb}</td>
                                </tr>
                                <tr>
                                    <td>Pieces</td>
                                    <td>{selectedRecord.i_pieces}</td>
                                </tr>
                                <tr>
                                    <td>Weight</td>
                                    <td>{selectedRecord.f_weight} KG</td>
                                </tr>
                                <tr>
                                    <td>Last Arrival Date</td>
                                    <td>{moment.utc(selectedRecord.d_last_arrival_date).format('MM/DD/YYYY')}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>ISC Charged</td>
                                    <td className={'text-right'}>{formatCost(selectedRecord.f_charge_isc)}</td>
                                </tr>
                                <tr>
                                    <td>Storage Charged</td>
                                    <td className={'text-right'}>{formatCost(selectedRecord.f_charge_storage)}</td>
                                </tr>
                                <tr>
                                    <td>Other Charged</td>
                                    <td className={'text-right'}>{formatCost(selectedRecord.f_charge_others)}</td>
                                </tr>
                                <tr>
                                    <td>Total Charges</td>
                                    <td className={'text-right'}>{formatCost(selectedRecord.f_charge_total)}</td>
                                </tr>
                                <tr>
                                    <td>Online Payment</td>
                                    <td className={'text-right'}>{formatCost(selectedRecord.f_paid_online)}</td>
                                </tr>
                                <tr>
                                    <td>Cash Payment</td>
                                    <td className={'text-right'}>{formatCost(selectedRecord.f_paid_cash)}</td>
                                </tr>
                                <tr>
                                    <td>Check Payment</td>
                                    <td className={'text-right'}>{formatCost(selectedRecord.f_paid_check)}</td>
                                </tr>
                                <tr>
                                    <td>Total Payment</td>
                                    <td className={'text-right'}>{formatCost(selectedRecord.f_paid_total)}</td>
                                </tr>
                                <tr>
                                    <td>Override</td>
                                    <td className={'text-right'}>{formatCost(selectedRecord.f_balance_offset)}</td>
                                </tr>                               
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={4}>
                        <Table>
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td>Company</td>
                                    <td>{selectedRecord.s_driver_company}</td>
                                </tr>
                                <tr>
                                    <td>Customer Name:</td>
                                    <td>{selectedRecord.s_driver_name}</td>
                                </tr>
                                <tr>
                                    <td>ID Presented:</td>
                                    <td>{selectedRecord.s_driver_id_type}</td>
                                </tr>
                                <tr>
                                    <td>ID Expiration:</td>
                                    <td>{selectedRecord.t_driver_id_expiration && moment.utc(selectedRecord.t_driver_id_expiration).format('MM/DD/YYYY')}</td>
                                </tr>
                                <tr>
                                    <td>ID Number:</td>
                                    <td>{selectedRecord.s_driver_id_number}</td>
                                </tr>
                                <tr>
                                    <td>ID Photo Match:</td>
                                    <td>{selectedRecord.b_driver_id_match_photo ? 'YES' : 'NO'}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Files</th>
                                    <th>Action</th>
                                </tr>
                                <tbody>
                                    {
                                        files.map((f, i) => (
                                            <tr key={i}>
                                                <td>{f.s_file_type || 'No Name'}</td>
                                                <td>
                                                    <Button onClick={() => handleViewFile(f)}>View</Button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </thead>
                        </Table>
                        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                            <Table className={'mb-0'}>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>Customs Clearance</td>
                                        <td>{selectedRecord.s_customs_release}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                    <Col md={4}>
                        <Table>
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td>Transaction ID</td>
                                    <td>{selectedRecord.s_transaction_id}</td>
                                </tr>
                                <tr>
                                    <td>Record ID</td>
                                    <td>{selectedRecord.i_id}</td>
                                </tr>
                                <tr>
                                    <td>Processed at Station</td>
                                    <td>{selectedRecord.s_unit}</td>
                                </tr>
                                <tr>
                                    <td>Delivered</td>
                                    <td>{selectedRecord.b_delivered ? 'Yes' : 'No'}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Kiosk Time</td>
                                    <td>{moment.utc(selectedRecord.t_kiosk_submittedtime).format('MM/DD/YYYY HH:mm:ss')}</td>
                                </tr>
                                <tr>
                                    <td>Wait Time</td>
                                    <td>{moment.utc(selectedRecord.t_counter_start_time).diff(moment.utc(selectedRecord.t_kiosk_submittedtime), 'minute')} minutes</td>
                                </tr>
                                <tr>
                                    <td>Processed by</td>
                                    <td>{selectedRecord.s_counter_assigned_agent}</td>
                                </tr>
                                <tr>
                                    <td>Process Start</td>
                                    <td>{moment.utc(selectedRecord.t_counter_start_time).format('MM/DD/YYYY HH:mm:ss')}</td>
                                </tr>
                                <tr>
                                    <td>Process End</td>
                                    <td>{moment.utc(selectedRecord.t_counter_endtime).format('MM/DD/YYYY HH:mm:ss')}</td>
                                </tr>
                                <tr>
                                    <td>Process Length</td>
                                    <td>{selectedRecord.i_counter_length} minutes</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                </tr>
                                {
                                    selectedRecord.b_counter_reject ? 
                                    <>
                                        <tr style={{ backgroundColor: '#dc3545', color: 'white' }}>
                                            <td>Rejected</td>
                                            <td>{selectedRecord.b_counter_reject ? 'Yes' : 'No'}</td>
                                        </tr>
                                        <tr style={{ backgroundColor: '#dc3545', color: 'white' }}>
                                            <td>Rejected by</td>
                                            <td>{selectedRecord.s_counter_reject_agent}</td>
                                        </tr>
                                        <tr style={{ backgroundColor: '#dc3545', color: 'white' }}>
                                            <td>Rejected Time</td>
                                            <td>{selectedRecord.t_counter_reject_time ? moment.utc(selectedRecord.t_counter_reject_time).format('MM/DD/YYYY HH:mm:ss') : ''}</td>
                                        </tr>
                                        <tr style={{ backgroundColor: '#dc3545', color: 'white' }}>
                                            <td>Reject Reason</td>
                                            <td>{selectedRecord.s_counter_reject_reason}</td>
                                        </tr>
                                    </> : 
                                    <tr>
                                        <td>Rejected</td>
                                        <td>{selectedRecord.b_counter_reject ? 'Yes' : 'No'}</td>
                                    </tr>
                                }
                                
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Row style={{ width: '100%' }}>
                    <Col md={12}>
                        <div className={'float-left'}>
                            <p>Created by: {selectedRecord.s_created_by} at {moment.utc(selectedRecord.t_created).format('MM/DD/YYYY HH:mm:ss')}</p>
                            <p>Modified by: {selectedRecord.s_modified_by} at {moment.utc(selectedRecord.t_modified).format('MM/DD/YYYY HH:mm:ss')}</p>
                        </div>
                        <Button className={'float-right'} color="secondary" onClick={toggle}>Close</Button>
                    </Col>
                </Row>
            </ModalFooter>
        </Modal>
    );
}