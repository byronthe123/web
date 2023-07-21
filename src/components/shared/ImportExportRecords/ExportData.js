import React, { useState } from 'react';
import { Row, Col, Button, Table } from 'reactstrap';
import moment from 'moment';
import Clipboard from 'react-clipboard.js';

import { formatMawb } from '../../../utils';
import UploadFiles from './UploadFiles';

export default function ExportData({
    selectedRecord,
    handleViewFile,
    files,
    handleSearchAwb,
    user,
    setFiles
}) {
    const resolveBoolean = (value) => (value ? 'YES' : 'NO');
    const [uploadFiles, setUploadFiles] = useState(false);

    return (
        <Row>
            <Col md={4}>
                <Table>
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>Priority</td>
                            <td>{selectedRecord.s_priority}</td>
                        </tr>
                        <tr>
                            <td>AWB</td>
                            <td>
                                <span
                                    onClick={() =>
                                        handleSearchAwb(
                                            null,
                                            selectedRecord.s_mawb
                                        )
                                    }
                                    style={{
                                        color: 'blue',
                                        fontWeight: 'bold',
                                        textDecoration: 'underline',
                                    }}
                                    className={'text-hover'}
                                >
                                    {formatMawb(selectedRecord.s_mawb)}
                                </span>
                                <Clipboard
                                    data-clipboard-target={'#copyAwb'}
                                    className={'d-inline ml-2 copy-button'}
                                >
                                    <i
                                        class="far fa-copy text-success text-medium"
                                        data-clipboard-target={'#copyAwb'}
                                        style={{ fontSize: '14px' }}
                                    ></i>
                                </Clipboard>
                            </td>
                        </tr>
                        <tr>
                            <td>Pieces</td>
                            <td>{selectedRecord.i_pieces}</td>
                        </tr>
                        <tr>
                            <td>Weight</td>
                            <td>{selectedRecord.i_weight}</td>
                        </tr>
                        <tr>
                            <td>Commodity</td>
                            <td>{selectedRecord.s_commodity}</td>
                        </tr>
                        <tr>
                            <td>SHC</td>
                            <td>
                                {selectedRecord.s_shc1}, {selectedRecord.s_shc2}
                                , {selectedRecord.s_shc3},{' '}
                                {selectedRecord.s_shc4}, {selectedRecord.s_shc5}
                            </td>
                        </tr>
                        <tr>
                            <td>Dangerous Good</td>
                            <td>{resolveBoolean(selectedRecord.b_dg)}</td>
                        </tr>
                        <tr>
                            <td>Screened</td>
                            <td>{resolveBoolean(selectedRecord.b_screened)}</td>
                        </tr>
                        <tr></tr>
                        <tr>
                            <td>Origin</td>
                            <td>{selectedRecord.s_origin}</td>
                        </tr>
                        <tr>
                            <td>Port of Loading</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Port of Unlading</td>
                            <td>{selectedRecord.s_port_of_unlading}</td>
                        </tr>
                        <tr>
                            <td>Destination</td>
                            <td>{selectedRecord.s_destination}</td>
                        </tr>
                        <tr></tr>
                        <tr>
                            <td>Airline Code</td>
                            <td>{selectedRecord.s_airline_code}</td>
                        </tr>
                        <tr>
                            <td>Flight Number</td>
                            <td>{selectedRecord.s_flight_number}</td>
                        </tr>
                        <tr>
                            <td>Aircraft Type</td>
                            <td>{selectedRecord.s_transport_type}</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            <Col md={4}>
                <Table>
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>ID 1 Presented</td>
                            <td>{selectedRecord.s_company_driver_id_type_1}</td>
                        </tr>
                        <tr>
                            <td>ID 1 Expiration</td>
                            <td>
                                {moment
                                    .utc(
                                        selectedRecord.d_company_driver_id_expiration_1
                                    )
                                    .format('MM/DD/YYYY')}
                            </td>
                        </tr>
                        <tr>
                            <td>ID 1 Number</td>
                            <td>{selectedRecord.s_company_driver_id_num_1}</td>
                        </tr>
                        <tr>
                            <td>ID 1 Photo Match</td>
                            <td>
                                {selectedRecord.b_company_driver_photo_match_1}
                            </td>
                        </tr>
                        <tr>
                            <td>ID 2 Presented</td>
                            <td>{selectedRecord.s_company_driver_id_type_2}</td>
                        </tr>
                        <tr>
                            <td>ID 2 Expiration</td>
                            <td>
                                {moment
                                    .utc(
                                        selectedRecord.d_company_driver_id_expiration_2
                                    )
                                    .format('MM/DD/YYYY')}
                            </td>
                        </tr>
                        <tr>
                            <td>ID 2 Number</td>
                            <td>{selectedRecord.s_company_driver_id_num_2}</td>
                        </tr>
                        <tr>
                            <td>ID 2 Photo Match</td>
                            <td>
                                {selectedRecord.b_company_driver_photo_match_2}
                            </td>
                        </tr>
                        <tr></tr>
                        <tr>
                            <td>IAC</td>
                            <td>{selectedRecord.s_iac}</td>
                        </tr>
                        <tr>
                            <td>CCSF</td>
                            <td>{selectedRecord.s_ccsf}</td>
                        </tr>
                        <tr>
                            <td>Known Shipper</td>
                            <td>{selectedRecord.s_non_iac}</td>
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
                            {files.map((f, i) => (
                                <tr key={i}>
                                    <td>{f.s_file_type || 'No Name'}</td>
                                    <td>
                                        <Button
                                            onClick={() => handleViewFile(f)}
                                        >
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </thead>
                    <Button onClick={() => setUploadFiles(true)}>Add File</Button>
                </Table>
            </Col>
            <Col md={4}>
                <Table>
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>Company</td>
                            <td>{selectedRecord.s_company}</td>
                        </tr>
                        <tr>
                            <td>Customer Name</td>
                            <td>{selectedRecord.s_company_driver_name}</td>
                        </tr>
                        <tr>
                            <td>Cell Phone</td>
                            <td>{selectedRecord.s_trucking_cell}</td>
                        </tr>
                        <tr>
                            <td>SMS Enabled</td>
                            <td>
                                {resolveBoolean(selectedRecord.b_sms_enabled)}
                            </td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>{selectedRecord.s_trucking_email}</td>
                        </tr>
                        <tr>
                            <td>Language</td>
                            <td>{selectedRecord.s_language}</td>
                        </tr>
                        <tr></tr>
                        <tr>
                            <td>Transaction ID</td>
                            <td>{selectedRecord.s_transaction_id}</td>
                        </tr>
                        <tr>
                            <td>Record ID</td>
                            <td>{selectedRecord.i_id}</td>
                        </tr>
                        <tr>
                            <td>Station</td>
                            <td>{selectedRecord.s_unit}</td>
                        </tr>
                        <tr>
                            <td>Accepted</td>
                            <td>
                                {selectedRecord.b_dock_reject ||
                                selectedRecord.b_counter_reject
                                    ? 'NO'
                                    : 'YES'}
                            </td>
                        </tr>
                        {(selectedRecord.b_dock_reject ||
                            selectedRecord.b_counter_reject) && (
                            <tr>
                                <td>Reject Reason</td>
                                <td>
                                    {selectedRecord.s_counter_reject_reason}
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td>Notes</td>
                            <td>{selectedRecord.s_notes}</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            <UploadFiles
                modal={uploadFiles}
                setModal={setUploadFiles}
                s_type={'EXPORT'}
                user={user}
                setFiles={setFiles}
                s_mawb={selectedRecord.s_mawb}
                s_transaction_id={selectedRecord.s_transaction_id}
                s_mawb_id={selectedRecord.s_mawb_id}
            />
        </Row>
    );
}
