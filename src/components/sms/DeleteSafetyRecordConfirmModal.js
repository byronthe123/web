import React, {Fragment} from 'react';

import {
    Modal,
  } from "reactstrap";
import moment from 'moment';

const DeleteSafetyRecordConfirmModal = ({
    open, 
    handleModal, 
    selectedEmloyee,
    edit_s_incident_title,
    edit_s_incident_description,
    edit_t_incident,
    edit_s_incident_location,
    edit_s_corrective_disciplinary_action,
    deleteSafetyRecord
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
                            <h4>Safety Incident Title: {edit_s_incident_title}</h4>
                            <h4>Description: {edit_s_incident_description}</h4>
                            <h4>Date: {moment(edit_t_incident).format('MM/DD/YYYY')}</h4>
                            <h4>Location: {edit_s_incident_location}</h4>
                            <h4>Disciplinary Action: {edit_s_corrective_disciplinary_action}</h4>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-danger" type="button" onClick={() => deleteSafetyRecord()}>Confirm</button>
                        <button type="button" className="btn btn-secondary" onClick={handleModal}>Close</button>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}

export default DeleteSafetyRecordConfirmModal;