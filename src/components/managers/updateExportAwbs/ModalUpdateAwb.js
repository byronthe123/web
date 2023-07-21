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
    Col,
    Form
  } from "reactstrap";
import moment from 'moment';

const ModalUpdateAwb = ({
    open, 
    handleModal,
    selectedAwb,
    i_pieces,
    set_i_pieces,
    i_weight,
    set_i_weight,
    s_destination,
    set_s_destination,
    t_depart_date,
    set_t_depart_date,
    s_transport_type,
    set_s_transport_type,
    s_flight_number,
    set_s_flight_number,
    submit,
    enableSubmit
}) => {
    return (
        selectedAwb && 
        <Fragment>
            <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
                <div className="modal-content" style={{width: '600px'}}>
                    <div className="modal-body mx-auto">
                        <div className='text-center'>
                            <h4>Update AWB {selectedAwb.s_mawb}</h4>
                        </div>
                        <div>
                            <Row className='pt-3'>
                                <Form style={{width: '500px'}}>
                                    <FormGroup>
                                        <h4>Pieces</h4>
                                        <Input type="text" value={i_pieces} onChange={(e) => set_i_pieces(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Weight</h4>
                                        <Input type="text" value={i_weight} onChange={(e) => set_i_weight(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Destination</h4>
                                        <Input type="text" value={s_destination} onChange={(e) => set_s_destination(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Flight Date</h4>
                                        <Input type="date" value={t_depart_date} onChange={(e) => set_t_depart_date(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Flight Type</h4>
                                        <Input type="text" value={s_transport_type} onChange={(e) => set_s_transport_type(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <h4>Flight Number</h4>
                                        <Input type="text" value={s_flight_number} onChange={(e) => set_s_flight_number(e.target.value)} />
                                    </FormGroup>
                                    {/* <FormGroup>
                                        <Button type='button' disabled={!enableSubmit()} onClick={() => submit()} color='primary'>Submit</Button>
                                    </FormGroup> */}
                                </Form>
                            </Row>
                        </div>
                    </div>
                    <div className={'modal-footer'} style={{ width: '100%' }}>
                        <Row style={{ width: '100%' }}>
                            <Col md={12}>
                                <div className={'float-left'}>
                                    <h6>Modified: {moment.utc(selectedAwb.t_modified).format('MM/DD/YYYY HH:mm:ss')}</h6>
                                    <h6>Modified by: {selectedAwb.s_modified_by}</h6>
                                </div>
                                <Button className={'float-right'} type='button' disabled={!enableSubmit()} onClick={() => submit()} color='primary'>Submit</Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalUpdateAwb;