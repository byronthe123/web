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
  } from "reactstrap";
import moment from 'moment';

const EditUserModal = ({
    open, 
    handleEditUserModal, 
    launchModalCreateUser,
    handleInput, 
    handleDateOfHire,
    enableCreateUser,  
    handleUpdateUser, 
    handleDeleteUser,
    selectedEmloyee,
    s_name, 
    s_job_title, 
    s_department, 
    d_date_of_hire
}) => {

    return (
        <Fragment>
            <Modal isOpen={open} toggle={handleEditUserModal}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-header mx-auto">
                    <h5 className="modal-title" id="exampleModalLabel">Edit User:</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body mx-auto">
                    <div className="row">
                        <div className="col-12">

                            <h4>Name:</h4>
                            <input type="text" value={s_name} id={'s_name'} onChange={(e) => handleInput(e)} style={{width: '405px'}} className="mb-4 form-control"/>

                            <h4>Job Title:</h4>
                            <input className="form-control mb-4" value={s_job_title} id={'s_job_title'} onChange={(e) => handleInput(e)}  type="text" style={{width: '405px'}}/>

                            <h4>Department:</h4>
                            <input className="form-control mb-4" value={s_department} id={'s_department'} onChange={(e) => handleInput(e)}  type="text" style={{width: '405px'}}/>
                            
                            <h4 className='mt-2'>Date of Hire:</h4>
                            <input 
                                type='date' 
                                className="form-control" 
                                onChange={(e) => handleDateOfHire(e)}
                                defaultValue={moment(d_date_of_hire).format('YYYY-MM-DD')}
                                //min={moment().format('YYYY-MM-DD')}
                            >
                            </input>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-success" style={{position: 'relative', right: '110px'}} onClick={launchModalCreateUser}>Create New User</button>
                    <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>Delete this user</button>
                    <button type="button" className="btn btn-primary" disabled={!enableCreateUser()} onClick={() => handleUpdateUser(selectedEmloyee.id)}>Save</button>
                    <button type="button" className="btn btn-secondary" onClick={handleEditUserModal}>Close</button>
                </div>
            </div>
            </Modal>
        </Fragment>
    );
}

export default EditUserModal;