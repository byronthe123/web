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

const ModalConfirmLeftEarly = ({
    open, 
    handleModal,
    selectedCompany,
    markLeftEarly
}) => {

    return (
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal(!open)} className='mx-auto'>
                <div className="modal-content px-0" style={{width: '900px', marginLeft: '-200px'}}>
                    {
                        selectedCompany &&
                        <Fragment>
                            <div className="modal-header mx-auto">
                                <h4 className="modal-title" id="exampleModalLabel">Left Early</h4>
                            </div>
                            <div className="modal-body mx-auto">
                                <div className='text-center'>
                                    <i className="fas fa-exclamation-triangle mb-3" style={{fontSize: '40px'}}></i>
                                    <h4>Do you want to mark {selectedCompany && selectedCompany.s_trucking_company} as left early?</h4>
                                    <button className="btn btn-danger mr-2" onClick={() => markLeftEarly(selectedCompany)}>Yes</button>
                                    <button className="btn btn-secondary" onClick={handleModal}>No</button>
                                </div>
                            </div>
                        </Fragment>
                    }
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalConfirmLeftEarly;