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

const ModalPreviewEmail = ({
    open, 
    handleModal,
    handleInput,
    selectedMawb,
    autoIscCost,
    flightPieces,
    flightWeight,
    totalPieces,
    totalWeight,
    goDate,
    manual_s_airline_code,
    resolveReplyEmail,
    composeEmailBody
}) => {

    return (
        selectedMawb && selectedMawb !== null && 
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal('modalPreviewEmailOpen')}>
                <div className="modal-content" style={{width: '700px'}}>
                    <div dangerouslySetInnerHTML={{ __html: `${composeEmailBody()}` }}>
                    </div>
                </div>
                {/* <Button color='success'>send email</Button> */}
            </Modal>
        </Fragment>
    );
}

export default ModalPreviewEmail;