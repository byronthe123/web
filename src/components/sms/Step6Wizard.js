import React from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button } from "reactstrap";
import { Wizard, WithWizard, Steps, Step } from 'react-albus';

import EmployeeSafetyHistory from './EmployeeSafetyHistory';

const Step6Wizard = ({
    saveReportWithNotification,
    s_training_element,
    handleInput,
    selectedEmloyee,
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
    deleteSafetyRecord,
    baseReportEmployeesInfo,
    handleSelectEmployeeWithId
}) => {
    return (
        <WithWizard render={({ next }) => (
            <div className="wizard-basic-step">
                <Form>
                    <div className='text-center'>
                    <h3 className='mb-0 pb-0'>Incident Investigation Report: Employee Safety History</h3>
                        <hr></hr>
                    </div>
                    <FormGroup style={{height: '480px', overflowY: 'scroll', overflowX: 'hidden'}}>
                        <div className="form-group position-relative align-left mb-0">
                            <div className='row'>
                                <div className='col-12'>
                                    <FormGroup className='py-0 mb-0'>
                                        <div className='row'>
                                            <div className='col-2'>
                                                <h4>Select Employee:</h4>
                                            </div>
                                            <div className='col-6'>
                                                <select id={'s_employee_name'} onChange={(e) => handleSelectEmployeeWithId(e.target.value)} style={{width: '280px', height: '25px'}}>
                                                    {baseReportEmployeesInfo && baseReportEmployeesInfo.map((r, i) => <option value={r.id} key={i}>{r.s_name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </FormGroup> 
                                    <EmployeeSafetyHistory 
                                        handleInput={handleInput}
                                        selectedEmloyee={selectedEmloyee}
                                        s_training_element={s_training_element}
                                        add_s_incident_title={add_s_incident_title}
                                        add_s_incident_description={add_s_incident_description}
                                        add_t_incident={add_t_incident}
                                        add_s_incident_location={add_s_incident_location}
                                        add_s_corrective_disciplinary_action={add_s_corrective_disciplinary_action}
                                        add_s_modified_by={add_s_modified_by}
                                        add_t_modified={add_t_modified} 
                                        createSafetyRecord={createSafetyRecord}   
                                        editSafetyRecordModalOpen={editSafetyRecordModalOpen}
                                        handleEditSafetyRecordModal={handleEditSafetyRecordModal}
                                        edit_s_incident_title={edit_s_incident_title}
                                        edit_s_incident_description={edit_s_incident_description}
                                        edit_t_incident={edit_t_incident}
                                        edit_s_incident_location={edit_s_incident_location}
                                        edit_s_corrective_disciplinary_action={edit_s_corrective_disciplinary_action}                                    
                                        saveSafetyRecordEdits={saveSafetyRecordEdits}
                                        deleteSafetyRecordModalOpen={deleteSafetyRecordModalOpen}
                                        handleDeleteSafetyRecordModal={handleDeleteSafetyRecordModal}
                                        deleteSafetyRecord={deleteSafetyRecord}    
                                    />
                                </div>
                            </div>
                        </div>
                    </FormGroup>
                </Form>
                {/* <Button color="success" onClick={() => saveReportWithNotification()} style={{position: 'absolute', right: '40%'}}>
                    Save
                </Button> */}
            </div>
        )} />
    );    
}

export default Step6Wizard;