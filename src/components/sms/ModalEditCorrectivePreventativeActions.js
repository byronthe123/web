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

const ModalEditCorrectivePreventativeActions = ({
    open, 
    handleModal, 
    editType,
    editAction,
    setEditAction,
    editOwner,
    setEditOwner,
    editDate,
    setEditDate,
    editStatus,
    setEditStatus,
    updateRecord,
    setDeleteId,
    editRecordId
}) => {

    const displayTitle = () => {
        const title = editType && editType !== null && editType.toLowerCase() === 'corrective' ? 'Corrective' : 'Preventative';
        return title;
    }

    return (
        <Fragment>
            <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-header mx-auto">
                    <h5 className="modal-title" id="exampleModalLabel">Edit {displayTitle()} Action Record</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body mx-auto">
                    <div className="row">
                        <div className="col-12">

                            <h4>{displayTitle()} Action:</h4>
                            <input type="text" value={editAction} onChange={(e) => setEditAction(e.target.value)} style={{width: '405px'}} className="mb-4 form-control"/>

                            <h4>Owner:</h4>
                            <input className="form-control mb-4" value={editOwner} onChange={(e) => setEditOwner(e.target.value)}  type="text" style={{width: '405px'}}/>

                            <h4>Target Date:</h4>
                            <input className="form-control mb-4" type='date' value={editDate} onChange={(e) => setEditDate(e.target.value)} style={{width: '405px'}}/>

                            <h4>Status/Remarks:</h4>
                            <input className="form-control mb-4" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}  type="text" style={{width: '405px'}}/>
                                                    
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" style={{position: 'relative', right: '260px'}} onClick={() => setDeleteId(editRecordId)}>Delete Record</button>
                    <button type="button" className="btn btn-secondary" onClick={(e) => handleModal(!open)}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={() => updateRecord()}>Save</button>
                </div>
            </div>
            </Modal>
        </Fragment>
    );
}

export default ModalEditCorrectivePreventativeActions;