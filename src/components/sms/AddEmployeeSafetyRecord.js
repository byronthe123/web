import React from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button } from "reactstrap";
import { AuthenticationHandlerOptions } from '@microsoft/microsoft-graph-client';

const AddEmployeeSafetyRecord = ({
    handleInput,
    add_s_incident_title,
    add_s_incident_description,
    add_t_incident,
    add_s_incident_location,
    add_s_corrective_disciplinary_action,
    add_s_modified_by,
    add_t_modified,
    createSafetyRecord
}) => {

    const checkEnableSavingTrainingRecord = () => {
        const checkArray = [
            add_s_incident_title,
            add_s_incident_description,
            add_t_incident,
            add_s_incident_location,
            add_s_corrective_disciplinary_action
        ];

        for(let i = 0; i < checkArray.length; i++) {
            if(checkArray[i].length < 1 || checkArray[i] === null) {
                return false;
            }
        }

        return true;
    }

    return (
        <div>
            <div className='row'>
                <div className='col-2'>
                    <h6>Incident Title:</h6>
                    <Input type='text' value={add_s_incident_title} id={'add_s_incident_title'} onChange={(e) => handleInput(e)}></Input>
                </div>
                <div className='col-1'>
                    <h6>Location:</h6>
                    <Input type='text' value={add_s_incident_location} id={'add_s_incident_location'} onChange={(e) => handleInput(e)}></Input>
                </div>
                <div className='col-4'>
                    <h6>Incident Description:</h6>
                    <Input type='text' value={add_s_incident_description} id={'add_s_incident_description'} onChange={(e) => handleInput(e)}></Input>
                </div>
                <div className='col-2'>
                    <h6>Incident Date:</h6>
                    <Input type='date' value={add_t_incident} id={'add_t_incident'} onChange={(e) => handleInput(e)}></Input>
                </div>
                <div className='col-2'>
                    <h6>Corrective/Disc. Action:</h6>
                    <Input type='text' value={add_s_corrective_disciplinary_action} id={'add_s_corrective_disciplinary_action'} onChange={(e) => handleInput(e)}></Input>
                </div>
                <div className='col-1 mt-4'>
                    <button onClick={() => createSafetyRecord()} type="button" disabled={!checkEnableSavingTrainingRecord()} className={`btn ${checkEnableSavingTrainingRecord() ? 'btn-success' : 'btn-danger'}`}>
                        <span style={{position: 'relative', top: '-3px', fontWeight: 'bold'}}>Add</span><i className={`ml-2 ${checkEnableSavingTrainingRecord() ? 'far fa-check-circle' : 'fas fa-times-circle'}`}  style={{fontSize: '20px'}}></i>
                    </button>
                    {/* <button type="button" disabled={!checkEnableSavingTrainingRecord()} className={`btn ${checkEnableSavingTrainingRecord() ? 'btn-success far fa-check-circle' : 'btn-danger fas fa-times-circle'}`}><i className=''></i></button> */}
                </div>
            </div>
        </div>
    );
}

export default AddEmployeeSafetyRecord;
