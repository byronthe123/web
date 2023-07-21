import React from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button } from "reactstrap";
import { AuthenticationHandlerOptions } from '@microsoft/microsoft-graph-client';

const AddEmployeeTraining = ({
    handleInput,
    checkEnableSavingTrainingRecord,
    createEmployeeTrainingRecord,
    s_training_element,
    d_date_of_training,
    d_next_training_date
}) => {
    return (
        <div>
            <div className='row'>
                <div className='col-5'>
                    <h6>Training Element:</h6>
                    <Input type='text' value={s_training_element} id={'s_training_element'} onChange={(e) => handleInput(e)}></Input>
                </div>
                <div className='col-3'>
                    <h6>Date of Training:</h6>
                    <input 
                        type='date' 
                        className="form-control" 
                        onChange={(e) => handleInput(e)}
                        id={'d_date_of_training'}
                        value={d_date_of_training}
                        // defaultValue={moment(d_company_driver_id_expiration_1).format('YYYY-MM-DD')}
                    />                    
                </div>
                <div className='col-3'>
                    <h6>Date of Next Due:</h6>
                    <input 
                        type='date' 
                        className="form-control" 
                        onChange={(e) => handleInput(e)}
                        id={'d_next_training_date'}
                        value={d_next_training_date}
                        // defaultValue={moment(d_company_driver_id_expiration_1).format('YYYY-MM-DD')}
                    />                    
                </div>
                <div className='col-1 mt-4'>
                    <button onClick={() => createEmployeeTrainingRecord()} type="button" disabled={!checkEnableSavingTrainingRecord()} className={`btn ${checkEnableSavingTrainingRecord() ? 'btn-success' : 'btn-danger'}`}>
                        <span style={{position: 'relative', top: '-3px', fontWeight: 'bold'}}>Add</span><i className={`ml-2 ${checkEnableSavingTrainingRecord() ? 'far fa-check-circle' : 'fas fa-times-circle'}`}  style={{fontSize: '20px'}}></i>
                    </button>
                    {/* <button type="button" disabled={!checkEnableSavingTrainingRecord()} className={`btn ${checkEnableSavingTrainingRecord() ? 'btn-success far fa-check-circle' : 'btn-danger fas fa-times-circle'}`}><i className=''></i></button> */}
                </div>
            </div>
        </div>
    );
}

export default AddEmployeeTraining;
