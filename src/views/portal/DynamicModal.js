import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';

export default ({
    modal,
    setModal
}) => {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={true} toggle={toggle} style={{ maxWidth: '80%' }}>
            <ModalHeader>Add Container</ModalHeader>
            <ModalBody>
                
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}