import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Input,
    Label,
  } from "reactstrap";
import moment from 'moment';

const EditSafetyRecordModal = ({
    open, 
    handleEditSafetyRecordModal, 
    handleInput,
    edit_s_incident_title,
    edit_s_incident_description,
    edit_t_incident,
    edit_s_incident_location,
    edit_s_corrective_disciplinary_action,
    saveSafetyRecordEdits,
    handleDeleteSafetyRecordModal
}) => {

    return (
        <Fragment>
            <Modal isOpen={open} toggle={handleEditSafetyRecordModal}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-header mx-auto">
                    <h5 className="modal-title" id="exampleModalLabel">Edit Safety Record:</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body mx-auto">
                    <div className="row">
                        <div className="col-12">

                            <h4>Incident Title:</h4>
                            <input type="text" value={edit_s_incident_title} id={'edit_s_incident_title'} onChange={(e) => handleInput(e)} style={{width: '405px'}} className="mb-4 form-control"/>
                            
                            <h4>Incident Location:</h4>
                            <input type="text" value={edit_s_incident_location} id={'edit_s_incident_location'} onChange={(e) => handleInput(e)} style={{width: '405px'}} className="mb-4 form-control"/>

                            <h4>Incident Description:</h4>
                            <input type="text" value={edit_s_incident_description} id={'edit_s_incident_description'} onChange={(e) => handleInput(e)} style={{width: '405px'}} className="mb-4 form-control"/>

                            <h4 className='mt-2'>Incident Date</h4>
                            <input 
                                type='date' 
                                className="form-control mb-2" 
                                id={'edit_t_incident'}
                                onChange={(e) => handleInput(e)}
                                value={moment(edit_t_incident).format('YYYY-MM-DD')}
                            >
                            </input>

                            <h4>Corrective/Disciplinary Action:</h4>
                            <input type="text" value={edit_s_corrective_disciplinary_action} id={'edit_s_corrective_disciplinary_action'} onChange={(e) => handleInput(e)} style={{width: '405px'}} className="mb-4 form-control"/>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" onClick={handleDeleteSafetyRecordModal} style={{marginRight: '230px'}}>Delete record</button>
                    <button type="button" className="btn btn-primary" onClick={() => saveSafetyRecordEdits()}>Save</button>
                    <button type="button" className="btn btn-secondary" onClick={handleEditSafetyRecordModal}>Close</button>
                </div>
            </div>
            </Modal>
        </Fragment>
    );
}

export default EditSafetyRecordModal;