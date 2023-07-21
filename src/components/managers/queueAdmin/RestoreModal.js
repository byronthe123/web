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
import { throwStatement } from '@babel/types';

const LeftEarlyModal = ({open, handleModal, companyToRestore, s_restored_reason, handleRestoredReason, restoreTruckingCompany}) => {

    const dock = companyToRestore && companyToRestore.s_status === 'LEFT DOCK';

    return (
        <Fragment>
            <Modal isOpen={open} toggle={handleModal}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-header mx-auto">
                    <h5 className="modal-title" id="exampleModalLabel">Restore Trucking Company to the Dock</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body mx-auto">
                    <div className='text-center'>
                        <i className="fas fa-exclamation-triangle mb-3" style={{fontSize: '40px'}}></i>
                        <h4>Do you want to restore {companyToRestore && companyToRestore.s_trucking_company}?</h4>
                        <h4>Enter the reason for restoring:</h4>
                        <input type="text" value={s_restored_reason} onChange={handleRestoredReason} style={{width: '400px', height: '100px'}} className="mb-4 form-control"/>
                        <button className="btn btn-success mr-2" disabled={s_restored_reason.length > 0 ? false : true} onClick={() => restoreTruckingCompany(dock)}>Confirm</button>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleModal}>Close</button>
                </div>
            </div>
            </Modal>
        </Fragment>
    );
}

export default LeftEarlyModal;