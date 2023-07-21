import React, {Fragment} from 'react';
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

const ModalFeedback = ({
    open, 
    handleModal,
    name,
    s_feedback,
    set_s_feedback,
    provideFeedback
}) => {

    return (
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal(!open)} className='mx-auto'>
                <div className="modal-content px-0" style={{width: '900px', marginLeft: '-200px'}}>
                    <Fragment>
                        <div className="modal-header mx-auto">
                            <h4 className="modal-title" id="exampleModalLabel">Please Provide Your Feeback:</h4>
                        </div>
                        <div className="modal-body mx-auto">
                            <div className='text-center'>
                                <h4>What was wrong or what could we do better to improve this page?</h4>
                                <textarea style={{width: '100%'}} value={s_feedback} onChange={(e) => set_s_feedback(e.target.value)}></textarea>
                                <button className="btn btn-success mt-2" onClick={() => provideFeedback()}>Submit</button>
                            </div>
                        </div>
                    </Fragment>
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalFeedback;