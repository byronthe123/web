import React from 'react';
import moment from 'moment';
import {Row, Col, Table} from 'reactstrap';

const ExportTable = ({
    exportAwbs,
    selectedAwb,
    selectAwb
}) => {
    return (
        <Row className='mt-3 mx-1'>
            <Col lg='12' md='12'>
                <Row>
                    <h4>Accepted AWBs:</h4>
                </Row>
                <Row>
                    <Table style={{tableLayout: 'fixed'}} className='mb-0'>
                        <thead>
                            <tr className='bg-primary'>
                                <th>AWB</th>
                                <td>Status</td>
                                <th>Modified</th>
                                <th>Modified By</th>
                                <th>Pieces</th>
                                <th>Weight</th>
                                <th>Origin</th>
                                <th>Destination</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </Table>
                    <div>
                        <Table style={{tableLayout: 'fixed'}} className='table-row-hover'>
                            <thead>
                                <tr className='bg-primary'>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    exportAwbs && exportAwbs.map((a, i) => 
                                        <tr key={i} onClick={() => selectAwb(a)} className={`${selectedAwb !== null && selectedAwb.i_id === a.i_id ? 'table-row-selected': ''}`}>
                                            <td>{a.s_mawb}</td>
                                            <td>{a.s_status}</td>
                                            <td>{moment(a.t_modified).format('MM/DD/YYYY HH:mm:ss')}</td>
                                            <td>{a.s_modified_by}</td>
                                            <td>{a.i_pieces}</td>
                                            <td>{a.i_weight}</td>
                                            <td>{a.s_origin}</td>
                                            <td>{a.s_destination}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </div>
                </Row>
            </Col>
        </Row>
    );
}

export default ExportTable;