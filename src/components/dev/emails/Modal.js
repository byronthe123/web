import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';

export default ({
    modal,
    setModal,
    email
}) => {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader>View Email: {email.subject} from {email.sender && email.sender.emailAddress && email.sender.emailAddress.address}</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md={12} style={{ overflowY: 'scroll' }}>
                        <span style={{whiteSpace: "pre-line"}}>
                            {
                                email.bodyPreview
                            }
                        </span>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Exit</Button>
            </ModalFooter>
        </Modal>
    );
}