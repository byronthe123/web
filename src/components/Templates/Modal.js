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
import FileBase64 from 'react-file-base64';

const ModalNotListed = ({
    open, 
    handleModal,
    s_pou,
    eightyWindow,
    s_flight_id,
    d_arrival_date,
    selectedFlight,
    s_uld,
    set_s_uld,
    s_notes,
    set_s_notes,
    enableSubmitUld,
    submitUld
}) => {
    return (
        <Fragment>
            <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
                <div className="modal-content" style={{width: '600px'}}>
                    <div className="modal-body mx-auto">
                        <div className='text-center'>
                            <h1>Create Not Listed ULD</h1>
                        </div>
                        <div>
                            <Row>
                                <h4 className='pr-3'>Flight Selected: {s_flight_id}</h4>
                            </Row>
                            <Row className='pt-3'>
                                <Form style={{width: '500px'}}>
                                    <FormGroup>
                                        <h4>ULD</h4>
                                        <Input type="text" value={s_uld} onChange={(e) => set_s_uld(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Arrival Date</h4>
                                        <Input type="text" value={d_arrival_date} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Origin</h4>
                                        <Input type="text" value={selectedFlight !== null ? selectedFlight.s_pol : ''} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Destination</h4>
                                        <Input type="text" value={s_pou} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Port of Loading</h4>
                                        <Input type="text" value={selectedFlight !== null ? selectedFlight.s_pol : ''} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Port of Unloading</h4>
                                        <Input type="text" value={s_pou} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Notes</h4>
                                        <Input type="textarea" value={s_notes} onChange={(e) => set_s_notes(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Button type='button' disabled={!enableSubmitUld()} onClick={() => submitUld()} color='primary'>Submit</Button>
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

export default ModalNotListed;