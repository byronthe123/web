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

const EditTrainingRecordModal = ({
    open, 
    handleEditTrainingRecordModal, 
    handleInput,
    edit_s_training_element,
    edit_d_date_of_training,
    edit_d_next_training_date,
    editEmployeeTrainingRecord,
    handleDeleteTrainingRecordModal,
    deleteTrainingRecord,
    enableSaveEdits,  
    handleUpdateTrainingRecord, 
    selectedRecord,
}) => {

    return (
        <Fragment>
            <Modal isOpen={open} toggle={handleEditTrainingRecordModal}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-header mx-auto">
                    <h5 className="modal-title" id="exampleModalLabel">Edit Training Record:</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body mx-auto">
                    <div className="row">
                        <div className="col-12">

                            <h4>Training Element:</h4>
                            <input type="text" value={edit_s_training_element} id={'edit_s_training_element'} onChange={(e) => handleInput(e)} style={{width: '405px'}} className="mb-4 form-control"/>
                            
                            <h4 className='mt-2'>Date of Training</h4>
                            <input 
                                type='date' 
                                className="form-control" 
                                id={'edit_d_date_of_training'}
                                onChange={(e) => handleInput(e)}
                                value={moment(edit_d_date_of_training).format('YYYY-MM-DD')}
                            >
                            </input>

                            <h4 className='mt-2'>Date of Next Due</h4>
                            <input 
                                type='date' 
                                className="form-control" 
                                id={'edit_d_next_training_date'}
                                onChange={(e) => handleInput(e)}
                                value={moment(edit_d_next_training_date).format('YYYY-MM-DD')}
                            >
                            </input>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" onClick={handleDeleteTrainingRecordModal} style={{marginRight: '230px'}}>Delete record</button>
                    <button type="button" className="btn btn-primary" onClick={() => editEmployeeTrainingRecord()}>Save</button>
                    <button type="button" className="btn btn-secondary" onClick={handleEditTrainingRecordModal}>Close</button>
                </div>
            </div>
            </Modal>
        </Fragment>
    );
}

export default EditTrainingRecordModal;