import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    Button,
    Modal,
    Table
  } from "reactstrap";
import moment from 'moment';

const ModalTelehponeRecord = ({
    open, 
    handleModal,
    handleInput,
    selectedCompanyPhones,
    selectCalledPhone,
    s_notes,
    s_number_called,
    s_caller,
    callPhone,
    resolveEnableSendEmail
}) => {

    const enableCallPhone = () => {
        return s_notes.length > 0 && s_number_called.length > 0 && s_caller.length > 0;     
    }

    return (
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal()}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-header mx-auto pb-3">
                    <h4 className="modal-title" id="exampleModalLabel">Call Telephone</h4>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body mx-auto pt-3">
                    <div className='row px-4'>
                        <div className="form-group">
                            <label className='mb-0'>Number Called:</label><br></br>
                        </div>
                    </div>

                    <div className='row'>
                        <div className="form-group text-center mx-auto">
                            {
                                selectedCompanyPhones && selectedCompanyPhones.map((p, i) => 
                                    <div className={`btn-group aircraft-type ml-2`} data-toggle="buttons">
                                        <label className="btn btn-info mr-2" style={{backgroundColor: `${s_number_called.toString() === p.s_phone.toString() ? '#118496' : '#19A2B4'}`}}>
                                            <input type="radio" id='s_number_called' value={p.s_phone} onClick={(e) => selectCalledPhone(e)} style={{display: 'none'}} /> {p.s_phone}
                                        </label>
                                    </div> 
                                )
                            } 
                        </div>
                    </div>

                    <div className='row px-4'>
                        <div className="form-group">
                            <label className='mb-0'>Spoke with:</label>
                            <input id={'s_caller'} value={s_caller} onChange={(e) => handleInput(e)} type="text" className="form-control"  style={{width: '520px'}} />
                        </div>
                    </div>
                    <div className='row px-4'>
                        <div className="form-group mb-1">
                            <label className='mb-0'>Notes:</label>
                            <textarea id={'s_notes'} value={s_notes} onChange={(e) => handleInput(e)} className="form-control" style={{width: '520px'}}></textarea>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => handleModal()}>Close</button>
                    <button className="btn btn-primary ml-2 py-0" style={{height: '42px'}} type="button" disabled={!enableCallPhone()} onClick={() => callPhone()}>Submit</button>
                </div>
            </div>
            </Modal>
        </Fragment>
    );
}

export default ModalTelehponeRecord;

