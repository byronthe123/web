import React from 'react';
import { Table, Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button } from "reactstrap";
import moment from 'moment';

const EmployeeTrainingRecordsTable = ({
    selectedEmloyee, 
    handleEditTrainingRecordModal
}) => {
    return (
        <Table striped>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Training Element</th>
                    <th>Date of Training</th>
                    <th>Date of Next Due</th>
                    <th>Last Modified</th>
                    <th>Last Modified By</th>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                {selectedEmloyee && selectedEmloyee !== null && selectedEmloyee.trainingRecords && selectedEmloyee.trainingRecords.map((r, i) => 
                    r.s_training_element !== null && r.d_date_of_training !== null && r.d_next_training_date !== null &&
                    <tr key={i}>
                        <th scope="row">{i+1}</th>
                        <td>{r.s_training_element}</td> 
                        <td>{moment(r.d_date_of_training).format('MM/DD/YYYY')}</td>
                        <td>{moment(r.d_next_training_date).format('MM/DD/YYYY')}</td>
                        <td>{moment(r.t_modified).format('MM/DD/YYYY hh:mm A')}</td>
                        <td>{r.s_modified_by}</td>
                        <td>
                            <i className="fas fa-edit" onClick={() => handleEditTrainingRecordModal(r)}></i>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}

export default EmployeeTrainingRecordsTable;

