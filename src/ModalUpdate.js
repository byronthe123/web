import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col } from 'reactstrap'; 
import PulseLoader from 'react-spinners/PulseLoader';

export default ({
    modal
}) => {

    return (
        <div>
            <Modal isOpen={modal} className='mt-5'>
                <ModalBody>
                    <Row>
                        <Col md={12} className='text-center'>
                            <h1>Updating</h1>
                            <PulseLoader 
                                size={75}
                                color={"#51C878"}
                                loading={true}
                            />
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </div>
    );
}