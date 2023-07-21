import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    Button,
    Modal,
    Table,
    ButtonGroup
  } from "reactstrap";
import moment from 'moment';

export default ({
    open, 
    handleModal,
    selectedCompanyPhones,
    s_notes,
    set_s_notes,
    s_number_called,
    set_s_number_called,
    s_caller,
    set_s_caller,
    createCallPhoneRecord
}) => {

    const enableCallPhone = () => s_notes.length > 0 && s_number_called.length >= 10 && s_caller.length > 0;

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
                            <label className='mb-0'>
                                {
                                    selectedCompanyPhones && selectedCompanyPhones.length > 0 ?
                                        <label className='mb-0'>Number Called:</label> :
                                        <label className='mb-0'>No Phone Numbers Found</label>
                                }
                            </label>
                            <br></br>
                        </div>
                    </div>

                    <div className='row'>
                        <div className="form-group text-center mx-auto">
                            <ButtonGroup>
                            {
                                selectedCompanyPhones && selectedCompanyPhones.map((p, i) => 
                                    <Button key={i} active={s_number_called === p} onClick={() => set_s_number_called(p)}>{p}</Button>
                                )
                            }
                            </ButtonGroup>
                        </div>
                    </div>

                    <div className='row px-4'>
                        <div className="form-group">
                            <label className='mb-0'>Spoke with:</label>
                            <input value={s_caller} onChange={(e) => set_s_caller(e.target.value)} type="text" className="form-control"  style={{width: '520px'}} />
                        </div>
                    </div>
                    <div className='row px-4'>
                        <div className="form-group mb-1">
                            <label className='mb-0'>Notes:</label>
                            <textarea value={s_notes} onChange={(e) => set_s_notes(e.target.value)} className="form-control" style={{width: '520px'}}></textarea>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => handleModal()}>Close</button>
                    <button className="btn btn-primary ml-2 py-0" style={{height: '42px'}} type="button" disabled={!enableCallPhone()} onClick={() => createCallPhoneRecord()}>Submit</button>
                </div>
            </div>
            </Modal>
        </Fragment>
    );
}

