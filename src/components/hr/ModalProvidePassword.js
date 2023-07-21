import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';

export default ({
    modal,
    setModal,
    employee
}) => {

    const toggle = () => setModal(!modal);

    return (
        <div>
            {
                employee.s_email && 
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader>Temporary Password for {employee.s_email}</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md={12} className='text-center'>
                                <h4>{employee.tempPassword}</h4>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>Exit</Button>
                    </ModalFooter>
                </Modal>
            }

        </div>
    );
}