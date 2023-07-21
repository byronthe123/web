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
    Row,
    Form
  } from "reactstrap";
import moment from 'moment';

const ModalEditFlight = ({
    open, 
    handleModal,
    editType,
    setEditType,
    editFlightNo,
    setEditFlightNo,
    editDestination,
    setEditDestination,
    editOrigin,
    setEditOrigin,
    editStatus,
    setEditStatus,
    editGate,
    setEditGate,
    editNotes,
    setEditNotes,
    editTime,
    setEditTime,
    editFidItem
}) => {
    return (
        <Fragment>
            <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
                <div className="modal-content" style={{width: '600px'}}>
                    <div className="modal-body mx-auto">
                        <div className='text-center'>
                            <h1>Edit Flight</h1>
                        </div>
                        <div>
                            <Row className='pt-3'>
                                <Form style={{width: '500px'}}>
                                    <FormGroup>
                                        <h4>Type</h4>
                                        <select value={editType} onChange={(e) => setEditType(e.target.value)}>
                                            <option value={'IMPORT'}>IMPORT</option>
                                            <option value={'EXPORT'}>EXPORT</option>
                                        </select>
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Flight No.</h4>
                                        <Input type="text" value={editFlightNo} onChange={(e) => setEditFlightNo(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Destination</h4>
                                        <Input type="text" value={editDestination} onChange={(e) => setEditDestination(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Origin</h4>
                                        <Input type="text" value={editOrigin} onChange={(e) => setEditOrigin(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Status</h4>
                                        <Input type="text" value={editStatus} onChange={(e) => setEditStatus(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Gate</h4>
                                        <Input type="text" value={editGate} onChange={(e) => setEditGate(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Notes</h4>
                                        <Input type="textarea" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Time</h4>
                                        <Input type="textarea" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Button type='button' onClick={() => editFidItem()} color='primary'>Submit</Button>
                                    </FormGroup>
                                </Form>
                            </Row>
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalEditFlight;