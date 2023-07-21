import React, {useState, useEffect} from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button } from "reactstrap";
import { Wizard, WithWizard, Steps, Step } from 'react-albus';

import EmployeeTrainingRecords from './EmployeeTrainingRecords';

const Step5Wizard = ({
    baseReportEmployeesInfo,
    saveReportWithNotification,
    s_employee_name,
    s_training_element,
    d_date_of_training,
    d_next_training_date,
    checkEnableSavingTrainingRecord,
    createEmployeeTrainingRecord,
    handleInput,
    selectedEmloyee,
    editTrainingRecordModal,
    edit_s_training_element,
    edit_d_date_of_training,
    edit_d_next_training_date,
    handleEditTrainingRecordModal,
    editEmployeeTrainingRecord,
    deleteTrainingRecord,
    deleteTrainingRecordModalOpen,
    handleDeleteTrainingRecordModal,
    handleSelectEmployee,
    handleSelectEmployeeWithId
}) => {

    useEffect(() => {
        baseReportEmployeesInfo && baseReportEmployeesInfo.length > 0 && handleSelectEmployeeWithId(baseReportEmployeesInfo[0].id);
    }, []);

    return (
        <WithWizard render={({ next }) => (
            <div className="wizard-basic-step" style={{height: '540px'}}>
                <Form>
                    <div className='text-center'>
                    <h3 className='mb-0 pb-0'>Incident Investigation Report: Employee Training History</h3>
                        <hr></hr>
                    </div>
                    <FormGroup style={{height: '440px', overflowY: 'scroll', overflowX: 'hidden'}}>
                        <div className="form-group position-relative align-left mb-0">
                            <div className='row'>
                                <div className='col-12'>
                                    <FormGroup className='py-0 mb-0'>
                                        <select id={'s_employee_name'} onChange={(e) => handleSelectEmployeeWithId(e.target.value)} style={{width: '280px', height: '25px'}}>
                                            {baseReportEmployeesInfo && baseReportEmployeesInfo.map((r, i) => <option value={r.id} key={i}>{r.s_name}</option>)}
                                        </select>
                                    </FormGroup>  
                                    <EmployeeTrainingRecords 
                                        s_training_element={s_training_element}
                                        d_date_of_training={d_date_of_training}
                                        d_next_training_date={d_next_training_date}
                                        checkEnableSavingTrainingRecord={checkEnableSavingTrainingRecord}
                                        createEmployeeTrainingRecord={createEmployeeTrainingRecord}
                                        handleInput={handleInput}
                                        selectedEmloyee={selectedEmloyee}
                                        editTrainingRecordModal={editTrainingRecordModal}
                                        edit_s_training_element={edit_s_training_element}
                                        edit_d_date_of_training={edit_d_date_of_training}
                                        edit_d_next_training_date={edit_d_next_training_date}
                                        handleEditTrainingRecordModal={handleEditTrainingRecordModal}
                                        editEmployeeTrainingRecord={editEmployeeTrainingRecord}
                                        deleteTrainingRecord={deleteTrainingRecord}
                                        deleteTrainingRecordModalOpen={deleteTrainingRecordModalOpen}
                                        handleDeleteTrainingRecordModal={handleDeleteTrainingRecordModal}
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

export default Step5Wizard;