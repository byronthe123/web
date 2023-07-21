import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomSwitch from '../../custom/CustomSwitch';

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
    Col
  } from "reactstrap";
import moment from 'moment';

const ModalEditUser = ({
    open, 
    handleModal,
    user,
    updateExternalUser,
    externalCompanies,
    b_approved, 
    set_b_approved,
    s_company_guid, 
    set_company_guid
}) => {

    return (
        <Fragment>
            <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
                <div className="modal-content" style={{width: '800px'}}>
                    <div className="modal-body">
                        <div className='text-center'>
                            <h1>Approve User</h1>
                        </div>
                        <div>
                            {
                                user &&
                                <Row>
                                    <Col md={6}>
                                        <h4>User Info:</h4>
                                        <h6>Email: {user.s_email}</h6>
                                        <h6>Created: {moment(user.t_created).format('MM/DD/YYYY HH:mm:ss')}</h6>
                                        <h6>Approved: {user.b_approved ? 'Yes' : 'No'}</h6>
                                        <h6>Company: {user.s_company} </h6>
                                        <h6>Modified: {moment(user.t_modified).format('MM/DD/YYYY HH:mm:ss')}</h6>
                                        <h6>Modified By: {user.s_modified_by}</h6>
                                    </Col>
                                    <Col md={6} className='px-5'>
                                        <Row>
                                            <h4>Update Company:</h4>
                                            <select value={s_company_guid} onChange={(e) => set_company_guid(e.target.value)}>
                                            {
                                                externalCompanies.map((c, i) =>
                                                    <option value={c.s_guid} key={i}>{c.s_company}</option>
                                                )
                                            }
                                            </select>
                                        </Row>
                                        <Row className='mt-3'>
                                            <Col md={3} className='mt-1 pl-0'>
                                                <h6>Approved</h6>
                                            </Col>
                                            <Col md={4}>
                                                <Switch
                                                    className="custom-switch custom-switch-primary"
                                                    checked={b_approved}
                                                    onClick={() => set_b_approved(!b_approved)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className='mt-4'>
                                            <Button color='success' className='mr-2' onClick={() => updateExternalUser()}>Save</Button>
                                            <Button color='danger' onClick={() => handleModal(false)}>Cancel</Button>
                                        </Row>
                                    </Col>
                                </Row>

                            }
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalEditUser;