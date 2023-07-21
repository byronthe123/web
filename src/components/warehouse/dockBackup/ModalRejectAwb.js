import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-tippy/dist/tippy.css'
import {Tooltip} from 'react-tippy';

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Input,
    Label,
    Row,
    Form,
    Col,
    Table
  } from "reactstrap";
import moment from 'moment';

const ModalRejectAwb = ({
    open, 
    handleModal,
    selectedCompany,
    s_dock_reject_reason,
    set_s_dock_reject_reason,
    handleReject
}) => {

    return (
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal(!open)} className='mx-auto'>
                <div className="modal-content px-0" style={{width: '900px', marginLeft: '-200px'}}>
                    {
                        selectedCompany &&
                        <Fragment>
                            <div className="modal-header mx-auto">
                                <h4 className="modal-title" id="exampleModalLabel">Confirm Rejection for AWB: {selectedCompany && selectedCompany !== null && selectedCompany.s_mawb}</h4>
                            </div>
                            <div className="modal-body mx-auto">
                                <div className='text-center'>
                                    <i className="fas fa-exclamation-triangle" style={{fontSize: '40px'}}></i>
                                    <h4>Enter the reason for rejection:</h4>
                                </div>
                                <div className="input-group mb-3">
                                    <textarea type="text" value={s_dock_reject_reason} onChange={(e) => set_s_dock_reject_reason(e.target.value)} className="form-control" style={{width: '400px', height: '100px'}}></textarea>
                                    {/* <textarea type="text" id='s_counter_reject_reason' value={s_counter_reject_reason} onChange={(e) => handleInput(e)} className="form-control" style={{width: '400px'}} placeholder="To reject shipment, type reason here."></textarea> */}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" type="button" disabled={!(s_dock_reject_reason.length > 0)} onClick={() => handleReject()}>Confirm</button>
                                <button type="button" className="btn btn-secondary" onClick={() => handleModal(!open)}>Close</button>
                            </div>
                        </Fragment>
                    }
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalRejectAwb;