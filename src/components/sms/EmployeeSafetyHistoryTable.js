import React from 'react';
import {Table} from 'reactstrap';
import moment from 'moment';

const EmployeeSafetyHistoryTable = ({
    selectedEmloyee,
    handleEditSafetyRecordModal
}) => {
    return (
        <div>
            <Table striped>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Incident Title</th>
                        <th>Incident Location</th>
                        <th>Incident Description</th>
                        <th>Incident Date</th>
                        <th>Corrective/Disciplinary Action</th>
                        <th>Last Modified</th>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {selectedEmloyee && selectedEmloyee !== null && selectedEmloyee.safetyHistory && selectedEmloyee.safetyHistory.map((s, i) => 
                        <tr key={i}>
                            <th scope="row">{i+1}</th>
                            <td>{s.s_incident_title}</td>
                            <td>{s.s_incident_location}</td>
                            <td>{s.s_incident_description}</td>
                            <td>{moment(s.t_incident).format('MM/DD/YYYY')}</td>
                            <td>{s.s_corrective_disciplinary_action}</td>
                            <td>{moment(s.t_modified).format('MM/DD/YYYY hh:mm A')}</td>
                            <td>
                                <i className="fas fa-edit" id={s.id} onClick={(e) => handleEditSafetyRecordModal(e)} ></i>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}

export default EmployeeSafetyHistoryTable;