import React, {Fragment, useRef} from 'react';

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

import Quiz from './Quiz';

const ModalPowerpoint = ({
    open, 
    handleModal,
    i_quiz_id,
    baseApiUrl,
    headerAuthCode,
    selectedContent,
    i_training_id,
    createTrainingRecord,
    user,
    assignorName
}) => {

    const modalRef = useRef();

    return (
        i_quiz_id && 
        <Modal isOpen={open}>
            <div className="modal-content" ref={modalRef} style={{width: '1200px', height: '900px', position: 'absolute', right: '-80%', overflowY: 'scroll'}}>
                <div className="modal-body px-5">
                    <Row>
                        <Col md={12} className='text-right'>
                            <i style={{fontSize: '20px'}} onClick={() => handleModal(false)} className="far fa-times-circle"></i>
                        </Col>
                    </Row>
                    <Row className='pt-3 mx-auto'>
                        <Quiz 
                            i_quiz_id={i_quiz_id}
                            baseApiUrl={baseApiUrl}
                            headerAuthCode={headerAuthCode}
                            i_training_id={i_training_id}
                            selectedContent={selectedContent}
                            createTrainingRecord={createTrainingRecord}
                            user={user}
                            modalRef={modalRef}
                            assignorName={assignorName}
                        />
                    </Row>
                </div>
            </div>
        </Modal>
    );
}

export default ModalPowerpoint;