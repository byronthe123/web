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

const ModalConfirmDeleteRecord = ({
    open, 
    handleModal,
    recordToDelete, 
    deleteRecord,
    isCorrective
}) => {

    const displayTitle = () => {
        const title = isCorrective() && isCorrective() ? 'Corrective' : 'Preventative';
        return title;
    }

    const getProperty = () => {
        const property = isCorrective() ? 's_corrective_action' : 's_preventative_action';
        return property;
    }

    return (
        <Fragment>
            <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-body mx-auto">
                    <div className='text-center'>
                        <i className="fas fa-exclamation-triangle" style={{fontSize: '40px'}}></i>
                        <h2>Please confirm you want to delete this {displayTitle()} record:</h2>
                        <h4>{recordToDelete && recordToDelete !== null && recordToDelete[getProperty()]}</h4>
                        <button type="button" className="btn btn-secondary mr-3" onClick={(e) => handleModal(!open)}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={() => deleteRecord()}>Delete Record</button>
                    </div>
                </div>
            </div>
            </Modal>
        </Fragment>
    );
}

export default ModalConfirmDeleteRecord;