import React, { useState } from 'react';
import { Row, Col, Button, Table } from 'reactstrap';
import moment from 'moment';
import { formatMawb, formatCost } from '../../../utils';
import Clipboard from 'react-clipboard.js';
import UploadFiles from './UploadFiles';

const resolveFileName = (name) => {
    if (!name) {
        return 'No Name';
    } else if (name === 'SIGNATURE') {
        return 'PRINT NAME';
    } else {
        return name;
    }
}

export default function ImportData ({ 
    selectedRecord,
    handleViewFile,
    files,
    handleSearchAwb,
    generateImportDeliverySheet,
    user,
    setFiles
}) {

    const [uploadFiles, setUploadFiles] = useState(false);

    return (
        <Row>
            <Col md={4}>
                <Table>
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>MAWB</td>
                            <td>
                                <span 
                                    onClick={() => handleSearchAwb(null, selectedRecord.s_mawb)}
                                    style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline' }}
                                    className={'text-hover'}
                                >
                                    {formatMawb(selectedRecord.s_mawb)}
                                </span>
                                <Clipboard data-clipboard-target={'#copyAwb'} className={'d-inline ml-2 copy-button'}>
                                    <i class="far fa-copy text-success text-medium" data-clipboard-target={'#copyAwb'} style={{ fontSize: '14px' }}></i>
                                </Clipboard>
                            </td>
                        </tr>
                        <tr>
                            <td>HAWB</td>
                            <td>{selectedRecord.s_hawb}</td>
                        </tr>
                        <tr>
                            <td>Pieces Processed</td>
                            <td>{selectedRecord.i_pieces}</td>
                        </tr>
                        <tr>
                            <td>Pieces Delivered</td>
                            <td>{selectedRecord.i_pcs_delivered || 0}</td>
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
                            <td className={'text-right'}>{formatCost(selectedRecord.f_charges_total)}</td>
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
                                        <td>{resolveFileName(f.s_file_type)}</td>
                                        <td>
                                            <Button onClick={() => handleViewFile(f)}>View</Button>
                                        </td>
                                    </tr>
                                ))
                            }
                            {
                                selectedRecord.b_delivered && (
                                    <tr>
                                        <td>PROOF OF DELIVERY</td>
                                        <td>
                                            <Button onClick={() => generateImportDeliverySheet()}>View</Button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </thead>
                    <Button onClick={() => setUploadFiles(true)}>Add File</Button>
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
                            <td>Type</td>
                            <td>{selectedRecord.s_awb_type}</td>
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
            <UploadFiles
                modal={uploadFiles}
                setModal={setUploadFiles}
                s_type={'IMPORT'}
                user={user}
                setFiles={setFiles}
                s_mawb={selectedRecord.s_mawb}
                s_transaction_id={selectedRecord.s_transaction_id}
                s_mawb_id={selectedRecord.s_mawb_id}
            />
        </Row>
    );
}