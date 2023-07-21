import React from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button } from "reactstrap";

import EmployeeSafetyHistoryTable from './EmployeeSafetyHistoryTable';
import AddEmployeeSafetyRecord from './AddEmployeeSafetyRecord';

import EditSafetyRecordModal from './EditSafetyRecordModal';
import DeleteSafetyRecordConfirmModal from './DeleteSafetyRecordConfirmModal';

const EmployeeSafetyHistory = ({
    handleInput,
    selectedEmloyee,
    handleEditTrainingRecordModal,
    add_s_incident_title,
    add_s_incident_description,
    add_t_incident,
    add_s_incident_location,
    add_s_corrective_disciplinary_action,
    add_s_modified_by,
    add_t_modified,
    createSafetyRecord,
    editSafetyRecordModalOpen,
    handleEditSafetyRecordModal,
    edit_s_incident_title,
    edit_s_incident_description,
    edit_t_incident,
    edit_s_incident_location,
    edit_s_corrective_disciplinary_action,
    saveSafetyRecordEdits,
    deleteSafetyRecordModalOpen,
    handleDeleteSafetyRecordModal,
    deleteSafetyRecord
}) => {
    return (
        <div className='row'>
            <div className='col-12'>
                <div>
                    <h1>Employee Safety History Review - {selectedEmloyee && selectedEmloyee.s_name}</h1>
                </div>
                <div>
                    <h6>Review the involved employee's safety history and indicate whether the employee was involved in previous safety incidents.</h6>
                </div>

                <EmployeeSafetyHistoryTable 
                    selectedEmloyee={selectedEmloyee}
                    handleEditSafetyRecordModal={handleEditSafetyRecordModal}
                />

                <AddEmployeeSafetyRecord 
                    handleInput={handleInput}
                    add_s_incident_title={add_s_incident_title}
                    add_s_incident_description={add_s_incident_description}
                    add_t_incident={add_t_incident}
                    add_s_incident_location={add_s_incident_location}
                    add_s_corrective_disciplinary_action={add_s_corrective_disciplinary_action}
                    add_s_modified_by={add_s_modified_by}
                    add_t_modified={add_t_modified}
                    createSafetyRecord={createSafetyRecord}
                />

                <EditSafetyRecordModal                     
                    selectedEmloyee={selectedEmloyee}
                    open={editSafetyRecordModalOpen}
                    handleInput={handleInput}
                    handleEditSafetyRecordModal={handleEditSafetyRecordModal}
                    handleDeleteSafetyRecordModal={handleDeleteSafetyRecordModal}
                    edit_s_incident_title={edit_s_incident_title}
                    edit_s_incident_description={edit_s_incident_description}
                    edit_t_incident={edit_t_incident}
                    edit_s_incident_location={edit_s_incident_location}
                    edit_s_corrective_disciplinary_action={edit_s_corrective_disciplinary_action}                
                    saveSafetyRecordEdits={saveSafetyRecordEdits}
                />

                <DeleteSafetyRecordConfirmModal 
                    selectedEmloyee={selectedEmloyee}
                    open={deleteSafetyRecordModalOpen}
                    handleModal={handleDeleteSafetyRecordModal}
                    edit_s_incident_title={edit_s_incident_title}
                    edit_s_incident_description={edit_s_incident_description}
                    edit_t_incident={edit_t_incident}
                    edit_s_incident_location={edit_s_incident_location}
                    edit_s_corrective_disciplinary_action={edit_s_corrective_disciplinary_action}
                    deleteSafetyRecordModalOpen={deleteSafetyRecordModalOpen}
                    deleteSafetyRecord={deleteSafetyRecord}
                />

                {/* <AddEmployeeTraining 
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
                />       */}
            </div>
        </div>
    );    
}

export default EmployeeSafetyHistory;