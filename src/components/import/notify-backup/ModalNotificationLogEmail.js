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

const ModalNotificationLogEmail = ({
    open, 
    handleModal,
    selectedNotificationRecord,
    forwardEmail
}) => {

    return (
        selectedNotificationRecord && selectedNotificationRecord !== null && 
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal('modalNotificationLogEmailOpen')}>
                <div className="modal-content" style={{width: '700px'}}>
                    <p onClick={() => forwardEmail()} style={{textAlign: 'right', fontSize: '24px', color: 'blue'}} className='mr-2 pb-0 mb-0 pt-1'>
                        <i className='fas fa-envelope'></i>
                    </p>
                    {
                        selectedNotificationRecord && selectedNotificationRecord !== null && 
                        <div dangerouslySetInnerHTML={{ __html: selectedNotificationRecord.s_email_message}}>
                        </div>
                    }
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalNotificationLogEmail;