import React from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button } from "reactstrap";

import AddEmployeeTraining from './AddEmployeeTraining';
import EmployeeTrainingRecordsTable from './EmployeeTrainingRecordsTable';
import EditTrainingRecordModal from './EditTrainingRecordModal';
import DeleteTrainingRecordConfirmModal from './DeleteTrainingRecordConfirmModal';

const EmployeeTrainingRecords = ({
    trainingElement1,
    trainingElement2,
    s_training_element,
    d_date_of_training,
    d_next_training_date,
    handleInput,
    checkEnableSavingTrainingRecord,
    createEmployeeTrainingRecord,
    selectedEmloyee,
    editTrainingRecordModal,
    edit_s_training_element,
    edit_d_date_of_training,
    edit_d_next_training_date,
    handleEditTrainingRecordModal,
    editEmployeeTrainingRecord,
    deleteTrainingRecord,
    deleteTrainingRecordModalOpen,
    handleDeleteTrainingRecordModal
}) => {
    return (
        <div className='row'>
            <div className='col-12'>
                <div>
                    <h1>Employee Training Records Review - {selectedEmloyee && selectedEmloyee.s_name}</h1>
                </div>
                <div>
                    <h6>Review the involved employee(s) training which is applicable to this incident.  Identify below if training was required, completed, and/or deficient.</h6>
                </div>
                <EmployeeTrainingRecordsTable 
                    selectedEmloyee={selectedEmloyee}
                    handleEditTrainingRecordModal={handleEditTrainingRecordModal}
                />
                <AddEmployeeTraining 
                    handleInput={handleInput}
                    s_training_element={s_training_element}
                    d_date_of_training={d_date_of_training}
                    d_next_training_date={d_next_training_date}
                    checkEnableSavingTrainingRecord={checkEnableSavingTrainingRecord}
                    createEmployeeTrainingRecord={createEmployeeTrainingRecord}
                    selectedEmloyee={selectedEmloyee}
                />

                <EditTrainingRecordModal 
                    open={editTrainingRecordModal}
                    handleEditTrainingRecordModal={handleEditTrainingRecordModal}
                    handleDeleteTrainingRecordModal={handleDeleteTrainingRecordModal}  
                    handleInput={handleInput}
                    edit_s_training_element={edit_s_training_element}
                    edit_d_date_of_training={edit_d_date_of_training}
                    edit_d_next_training_date={edit_d_next_training_date}
                    editEmployeeTrainingRecord={editEmployeeTrainingRecord}
                    deleteTrainingRecord={deleteTrainingRecord}
                />

                <DeleteTrainingRecordConfirmModal 
                    open={deleteTrainingRecordModalOpen}
                    handleModal={handleDeleteTrainingRecordModal}  
                    handleInput={handleInput}
                    selectedEmloyee={selectedEmloyee}
                    edit_s_training_element={edit_s_training_element}
                    edit_d_date_of_training={edit_d_date_of_training}
                    edit_d_next_training_date={edit_d_next_training_date}
                    editEmployeeTrainingRecord={editEmployeeTrainingRecord}
                    deleteTrainingRecord={deleteTrainingRecord}
                />      
            </div>
        </div>
    );    
}

export default EmployeeTrainingRecords;