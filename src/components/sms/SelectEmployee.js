import React, {Fragment} from 'react';
import moment from 'moment';

import {FormGroup, Input, Button} from 'reactstrap';

const SelectEmployee = ({
    index,
    employees,
    handleSelectEmployee,
    selectedEmloyee,
    handleEditUserModal,
    handleInput,
    s_employee_shift_start,
    i_employee_hours_on_duty,
    i_employee_hours_worked_in_72,
    s_employee_regular_days_off,
    updateBaseReportEmployeesInfo,
    removeReportEmployee
}) => {
    return (
        <div className='col-4'>
            <h5 style={{fontWeight: 'bolder', float: 'left'}} className='ml-3 mb-0'>Employee Information</h5>
            <Button color='danger' onClick={() => removeReportEmployee(selectedEmloyee.id)} style={{float: 'right'}} className='text-right'>Delete</Button>
            <table style={{borderSpacing: '15px', borderCollapse: 'separate'}}>
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td>
                            <div className='row'>
                                <div className='col-10'>
                                    <FormGroup className='py-0 mb-0'>
                                        <select id={'s_employee_name'} value={selectedEmloyee.id} onChange={(e) => handleSelectEmployee(e, selectedEmloyee.id, index)} style={{width: '280px', height: '25px'}}>
                                            {selectedEmloyee && employees.map((e, i) => <option value={e.id} key={i}>{e.s_name}</option>)}
                                        </select>
                                    </FormGroup>  
                                </div>
                                <div className='col-2'>
                                    {/* <i className="fas fa-user-plus ml-1" style={{position: 'absolute'}} onClick={() => handleNewUserModal()}></i> */}
                                    <i className="fas fa-users-cog" onClick={() => handleEditUserModal(selectedEmloyee)} style={{position: 'absolute', left: '20px'}}></i> 
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Job Title</td>
                        <td><p>{selectedEmloyee && selectedEmloyee.s_job_title}</p></td>
                            {/* <td><Input value={selectedEmloyee && selectedEmloyee.s_job_title} id={'s_job_title'} onChange={(e) => updateBaseReportEmployeesInfo(e, selectedEmloyee.id)} type='text' style={{height: '25px'}}></Input></td> */}
                            {/* <td><Input value={s_employee_job_title} id={'s_employee_job_title'} onChange={(e) => handleInput(e)} type='text' style={{height: '25px'}}></Input></td> */}
                    </tr>
                    <tr>
                        <td>Department</td>
                        <td><p>{selectedEmloyee && selectedEmloyee.s_department}</p></td>
                        {/* <td><Input value={selectedEmloyee && selectedEmloyee.s_department} id={'s_employee_department'} onChange={(e) => handleInput(e)} type='text' style={{height: '25px'}}></Input></td> */}
                        {/* <td><Input value={s_employee_department} id={'s_employee_department'} onChange={(e) => handleInput(e)} type='text' style={{height: '25px'}}></Input></td> */}
                    </tr>
                    <tr>
                        <td>
                            Date of Hire
                        </td>
                        <td>
                            <p>{selectedEmloyee && moment.utc(selectedEmloyee.d_date_of_hire).format('YYYY-MM-DD')}</p>
                            {/* <input 
                                type='date' 
                                className="form-control py-0" 
                                value={selectedEmloyee && moment.utc(selectedEmloyee.d_date_of_hire).format('YYYY-MM-DD')}
                                id={'d_employee_employment_date'}
                                onChange={(e) => handleInput(e)}
                                // defaultValue={moment(d_company_driver_id_expiration_1).format('YYYY-MM-DD')}
                            /> */}
                        </td>
                    </tr>
                    <tr>
                        <td>Shift Start</td>
                        <td><Input value={s_employee_shift_start} id={'s_employee_shift_start'} onChange={(e) => handleInput(e)} type='text' style={{height: '25px'}}></Input></td>
                    </tr>
                    <tr>
                        <td>Hours on Duty</td>
                        <td><Input value={i_employee_hours_on_duty} id={'i_employee_hours_on_duty'} onChange={(e) => handleInput(e)} type='number' style={{height: '25px'}}></Input></td>
                    </tr>
                    <tr>
                        <td>Hours worked in Previous 72</td>
                        <td><Input value={i_employee_hours_worked_in_72} id={'i_employee_hours_worked_in_72'} onChange={(e) => handleInput(e)} type='number' style={{height: '25px'}}></Input></td>
                    </tr>
                    <tr>
                        <td>Regular Days Off</td>
                        <td><Input value={s_employee_regular_days_off} id={'s_employee_regular_days_off'} onChange={(e) => handleInput(e)} type='text' style={{height: '25px'}}></Input></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default SelectEmployee;