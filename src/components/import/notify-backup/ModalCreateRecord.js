import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    Button,
    Modal,
  } from "reactstrap";
import moment from 'moment';

const ModalCreateRecord = ({
    open, 
    handleModal,
    handleInput,
    s_name,
    s_email,
    s_phone,
    modalType,
    handleCreateRecord,
    notificationData
}) => {

    const capitalize = (string) => {
        const stringArray = Array.from(string);
        let newString = '';
        for(let i = 0; i < stringArray.length; i++) {
          if(i === 0) {
            stringArray[i] = stringArray[i].toUpperCase();
          }
          newString += stringArray[i];
        }
        return newString;
      } 

    const resolveTitle = () => {
        const type = modalType && modalType;
        if (type && type !== null) {
            return capitalize(type);
        }
        return '';
    }

    const resolveSubtitle = () => {
        const type = modalType && modalType;
        if (type && type !== null) {
            if (type === 'record' || type === 'name') {
                return 'Company Name:';
            } else if (type === 'email') {
                return 'Email Address:'
            } else {
                return 'Phone Number'
            }
        }
        return '';
    }

    const resolveId = () => {
        const type = modalType && modalType;
        if(type && type !== null) {
            if (type === 'record' || type === 'name') {
                return 's_name';
            } else if (type === 'email') {
                return 's_email';
            } else {
                return 's_phone';
            }
        }
        return '';
    }

    const resolveValue = () => {
        const type = modalType && modalType;
        if(type && type !== null) {
            if (type === 'record' || type === 'name') {
                return s_name;
            } else if (type === 'email') {
                return s_email;
            } else {
                return s_phone;
            }
        }
        return '';
    }

    const validateEmail = (email) => {
        const match = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return match.test(String(email).toLowerCase());
    }

    const validatePhone = (phoneNum) => {
        if(phoneNum.length === 10) {
            return true;
        }
    }

    // const checkDuplicateName = () => {
    //     console.log(s_name);
    //     const matchArray = notificationData.companyData.filter(c => c.s_name.toUpperCase() === s_name.toUpperCase());
    //     console.log(matchArray);
    //     return matchArray.length === 0;
    // }

    const getDuplicateNamesArray = () => {
        console.log(s_name);
        const matchArray = notificationData.companyData.filter(c => c.s_name.toUpperCase() === s_name.toUpperCase());
        return matchArray;
    }

    const getDuplicateEmailsArray = () => {
        const matchArray = notificationData.emailData.filter(c => c.s_email.toUpperCase() === s_email.toUpperCase());
        return matchArray;
    }

    const getDuplicatePhonesArray = () => {
        const matchArray = notificationData.phoneData.filter(c => c.s_phone.toUpperCase() === s_phone.toUpperCase());
        return matchArray;
    }

    const checkDuplicateName = () => {
        const duplictesArray = getDuplicateNamesArray();
        return duplictesArray.length === 0;
    }

    const checkDuplicateEmail = () => {
        const duplictesArray = getDuplicateEmailsArray();
        return duplictesArray.length === 0;
    }

    const checkDuplicatePhone = () => {
        const duplicatesArray = getDuplicatePhonesArray();
        return duplicatesArray.length === 0;
    }

    const validateValue = () => {
        const type = modalType && modalType;
        if(type && type !== null) {
            if (type === 'record' || type === 'name') {
                if(s_name.length > 0) {
                    return checkDuplicateName();
                }
            } else if (type === 'email') {
                 if (validateEmail(s_email)) {
                    return checkDuplicateEmail();
                 }
            } else {
                if (validatePhone(s_phone)) {
                    return checkDuplicatePhone();
                }
            }
        }
        return false;
    }

    const resolveType = () => {
        const type = modalType && modalType;
        if(type && type !== null) {
            if (type === 'phone') {
                return 'number';
            } else {
                return 'text';
            }
        }
        return 'text';
    }

    const resolveDuplicatesLabel = () => {
        const type = modalType && modalType;
        let label = '';
        if(type && type !== null) {
            if (type === 'record' || type === 'name') {
                if(s_name.length > 0) {
                    if (!checkDuplicateName()) {
                        const duplicatesArray = getDuplicateNamesArray();
                        label = `Duplicate company exists: ID ${duplicatesArray[0].i_record}, ${duplicatesArray[0].s_name}`;
                    }
                }
            } else if (type === 'email') {
                if (s_email.length > 0) {
                    if (validateEmail(s_email)) {
                        if (!checkDuplicateEmail()) {
                            const duplicatesArray = getDuplicateEmailsArray();
                            label = `Duplicate email exists: ID ${duplicatesArray[0].i_record}, ${duplicatesArray[0].s_email}`;
                        }
                    } else {
                        label = 'Invalid email format';
                    }    
                }
            } else {
                if (s_phone.length === 10) {
                    if (validatePhone(s_phone)) {
                        if (!checkDuplicatePhone()) {
                            const duplicatesArray = getDuplicatePhonesArray();
                            label = `Duplicate phone number exists: ID ${duplicatesArray[0].i_record}, ${duplicatesArray[0].s_phone}`;
                        }
                    } else {
                        label = 'Invalid phone format';
                    }    
                }
            }
        }
        return label;
    }

    return (
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal()}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-header mx-auto pb-3">
                    <h4 className="modal-title" id="exampleModalLabel">Create {resolveTitle()}</h4>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body mx-auto pt-3">
                    <div className='row mx-auto text-center'>
                        <h5 className='mx-auto text-center'>{resolveSubtitle()}</h5>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <input type={resolveType()} value={resolveValue()} id={resolveId()} onChange={(e) => handleInput(e)} className="form-control text-center" style={{width: '550px'}}/>
                        </div>
                        <div className='col-12'>
                            <h6 className='mt-3 mx-auto text-center text-danger'>{resolveDuplicatesLabel()}</h6>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => handleModal()}>Close</button>
                    <button className="btn btn-primary ml-2 py-0" style={{height: '42px'}} type="button" disabled={!validateValue()} onClick={() => handleCreateRecord()}>Submit</button>
                </div>
            </div>
            </Modal>
        </Fragment>
    );
}

export default ModalCreateRecord;