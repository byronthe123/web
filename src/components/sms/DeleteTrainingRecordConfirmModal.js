import React, {Fragment} from 'react';

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

const DeleteTrainingRecordConfirmModal = ({
    open, 
    handleModal, 
    selectedEmloyee,
    edit_s_training_element,
    edit_d_date_of_training,
    edit_d_next_training_date,
    deleteTrainingRecord
}) => {

    return (
        <Fragment>
            <Modal isOpen={open} toggle={handleModal}>
                <div className="modal-content" style={{width: '600px'}}>
                    <div className="modal-header mx-auto">
                        <h5 className="modal-title" id="exampleModalLabel">Confirm Delete Training Record</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body mx-auto">
                        <div className='text-center'>
                            <i className="fas fa-exclamation-triangle mb-3" style={{fontSize: '40px'}}></i>
                            <h4>Employee: {selectedEmloyee && selectedEmloyee.s_name}</h4>
                            <h4>Training Element: {edit_s_training_element}</h4>
                            <h4>Date of Training: {moment(edit_d_date_of_training).format('MM/DD/YYYY')}</h4>
                            <h4>Date of Next Training: {moment(edit_d_next_training_date).format('MM/DD/YYYY')}</h4>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-danger" type="button" onClick={() => deleteTrainingRecord()}>Confirm</button>
                        <button type="button" className="btn btn-secondary" onClick={handleModal}>Close</button>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}

export default DeleteTrainingRecordConfirmModal;