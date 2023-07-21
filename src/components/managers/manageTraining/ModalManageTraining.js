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
    Form,
    Table
  } from "reactstrap";
import moment from 'moment';

const ModalManageTraining = ({
    open, 
    handleModal,
    editingUser,
    userTrainingRecords,
    removeTrainingAssigned
}) => {
    return (
        <Fragment>
            <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
                <div className="modal-content" style={{width: '1000px', position: 'absolute', right: '-55%'}}>
                    <div className="modal-body mx-auto">
                        <div className='text-center'>
                            <h1>{editingUser}'s Training Records:</h1>
                        </div>
                        <div>
                            <Row className='pt-3'>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Module ID</th>
                                            <th>Module Name</th>
                                            <th>Access Type</th>
                                            <th>Valid Until</th>
                                            <th>Assigned By</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        userTrainingRecords.map((t, i) =>
                                            <tr key={i}>
                                                <td>{t.i_training_id}</td>
                                                <td>{t.s_module_name}</td>
                                                <td>{t.s_access_type}</td>
                                                <td>{t.t_expiration}</td>
                                                <td>{t.s_assignor}</td>
                                                <td>
                                                    <i onClick={() => removeTrainingAssigned(t.id)} className="fas fa-trash-alt"></i>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </Table>
                            </Row>
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalManageTraining;