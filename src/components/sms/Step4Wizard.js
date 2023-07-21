import React from "react";
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button } from "reactstrap";
import { Wizard, WithWizard, Steps, Step } from 'react-albus';
import moment from 'moment';

import NewUserModal from './NewUserModal';
import EditUserModal from './EditUserModal';
import SelectEmployee from './SelectEmployee';

const Step4Wizard = ({
    employees,
    baseReportEmployeesInfo,
    handleSelectEmployee,
    selectedEmloyee,
    handleInput,
    saveReport,
    saveReportWithNotification,
    s_incident_station,
    s_station,
    s_employee_shift_start,
    i_employee_hours_on_duty,
    i_employee_hours_worked_in_72,
    s_employee_regular_days_off,
    s_name,
    s_job_title,
    s_department,
    d_date_of_hire,
    newUserModal,
    handleNewUserModal,
    editUserModal,
    handleEditUserModal,
    launchModalCreateUser,
    handleDateOfHire,
    enableCreateUser,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    addReportEmployee,
    removeReportEmployee,
    updateBaseReportEmployeesInfo
}) => {

    return(
        <WithWizard render={({ next }) => (
            <div className="wizard-basic-step">
                <Form>
                    <div className='text-center'>
                        <h3 className='mb-0 pb-0'>Incident Investigation Report: Employees Details</h3>
                        <hr></hr>
                    </div>
                    <FormGroup>
                        <div className="form-group position-relative align-left mb-0" style={{height: '440px', overflowY: 'scroll', overflowX: 'hidden'}}>
                            <div className='row'>
                                {
                                    baseReportEmployeesInfo && console.log(baseReportEmployeesInfo)
                                }
                                {baseReportEmployeesInfo && baseReportEmployeesInfo.map((e, i) => 
                                    <SelectEmployee 
                                        key={i}
                                        index={i}
                                        employees={employees}
                                        handleSelectEmployee={handleSelectEmployee}
                                        selectedEmloyee={e}
                                        handleEditUserModal={handleEditUserModal}
                                        handleInput={handleInput}
                                        s_employee_shift_start={s_employee_shift_start}
                                        i_employee_hours_on_duty={i_employee_hours_on_duty}
                                        i_employee_hours_worked_in_72={i_employee_hours_worked_in_72}
                                        s_employee_regular_days_off={s_employee_regular_days_off} 
                                        addReportEmployee={false}
                                        removeReportEmployee={removeReportEmployee}
                                        updateBaseReportEmployeesInfo={updateBaseReportEmployeesInfo}                                       
                                    />
                                )}
                                <div className='col-4 text-center add-incident-employee'>
                                    <h4>Add an Employee involved in the incident:</h4>
                                    <i className="fas fa-plus-circle" style={{fontSize: '40px'}} onClick={() => addReportEmployee()}></i>
                                </div>
                            </div>
                        </div>
                    </FormGroup>
                </Form>

                <NewUserModal 
                    open={newUserModal}
                    handleNewUserModal={handleNewUserModal}
                    s_name={s_name}
                    s_job_title={s_job_title}
                    s_department={s_department}
                    d_date_of_hire={d_date_of_hire}
                    handleInput={handleInput}
                    handleDateOfHire={handleDateOfHire}
                    enableCreateUser={enableCreateUser}
                    handleCreateUser={handleCreateUser}
                />

                <EditUserModal 
                    open={editUserModal}
                    handleEditUserModal={handleEditUserModal}
                    launchModalCreateUser={launchModalCreateUser}
                    s_name={s_name}
                    s_job_title={s_job_title}
                    s_department={s_department}
                    d_date_of_hire={d_date_of_hire}
                    handleInput={handleInput}
                    handleDateOfHire={handleDateOfHire}
                    enableCreateUser={enableCreateUser}
                    handleCreateUser={handleCreateUser}
                    handleUpdateUser={handleUpdateUser}
                    handleDeleteUser={handleDeleteUser}
                    selectedEmloyee={selectedEmloyee}
                />
                {/* <Button onClick={() => saveReportWithNotification()} color="success" style={{position: 'relative', top: '42px', left: '950px'}}>
                    Save
                </Button> */}
            </div>
        )} />
    );
}

export default Step4Wizard;