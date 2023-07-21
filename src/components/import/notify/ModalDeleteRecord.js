import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    Button,
    Modal,
  } from "reactstrap";
import moment from 'moment';

export default ({
    open, 
    handleModal,
    updateType,
    updateValue,
    handleUpdateRecord
}) => {

    const resolveUpdateTypeTitle = () => {
        if (updateType) {
            const stringArray = Array.from(updateType);
            stringArray[0] = stringArray[0].toUpperCase();
            return stringArray.toString().replace(/,/g, '');
        }
    }

    return (
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal('modalDeleteRecordOpen')}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-header mx-auto pb-3">
                    <h4 className="modal-title" id="exampleModalLabel">Delete {resolveUpdateTypeTitle()}</h4>
                </div>
                <div className="modal-body mx-auto pt-3">
                    <div className='row mx-auto text-center'>
                        <div className='col-12'>
                            <h5>Are you sure you want to delete the following {resolveUpdateTypeTitle()}:</h5>
                        </div>
                        <div className='col-12'>
                            {updateValue}
                        </div>
                    </div>
                </div>
                <div className="modal-footer mx-auto ">
                    <button type="button" className="btn btn-danger" onClick={() => handleUpdateRecord()}>Confirm</button>
                    <button type="button" className="btn btn-secondary" onClick={() => handleModal('modalDeleteRecordOpen')}>Cancel</button>
                </div>
            </div>
            </Modal>
        </Fragment>
    );
}
