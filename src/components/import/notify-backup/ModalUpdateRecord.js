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

const ModalUpdateRecord = ({
    open, 
    handleModal,
    handleInput,
    updateRecordInitialValue,
    updateType,
    updateValue,
    handleUpdateRecord,
    handleModalLaunchDeleteRecord
}) => {

    const resolveUpdateTypeTitle = () => {
        if (updateType !== null) {
            const stringArray = Array.from(updateType);
            stringArray[0] = stringArray[0].toUpperCase();
            return stringArray.toString().replace(/,/g, '');
        }
    }

    const enableUpdateRecord = () => {
        if (updateType === 'phone') {
            return updateRecordInitialValue !== updateValue && updateValue.length === 10;
        } 
        return updateRecordInitialValue !== updateValue;
    }

    return (
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal('modalUpdateRecordOpen')}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-header mx-auto pb-3">
                    <h4 className="modal-title" id="exampleModalLabel">Update {resolveUpdateTypeTitle()}</h4>
                </div>
                <div className="modal-body mx-auto pt-3">
                    <div className='row mx-auto text-center'>
                        <input type='text' value={updateValue} id={'updateValue'} onChange={(e) => handleInput(e)} style={{width: '500px', textAlign: 'center'}} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" onClick={() => handleModalLaunchDeleteRecord()} style={{marginRight: '220px'}}>Delete {resolveUpdateTypeTitle()}</button>
                    <button type="button" className="btn btn-secondary" onClick={() => handleModal('modalUpdateRecordOpen')}>Close</button>
                    <button className="btn btn-primary ml-2 py-0" style={{height: '42px'}} type="button" disabled={!enableUpdateRecord()} onClick={() => handleUpdateRecord()}>Submit</button>
                </div>
            </div>
            </Modal>
        </Fragment>
    );
}

export default ModalUpdateRecord;