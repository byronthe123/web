import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';

export default ({
    modal,
    setModal,
    selectedFile
}) => {

    const toggle = () => setModal(!modal);

    return (
        <div>
            {
                selectedFile && 
                <Modal isOpen={modal} toggle={toggle} style={{ maxWidth: '1300px', width: '100%' }}>
                    <ModalHeader>View File: {selectedFile.fileType}</ModalHeader>
                    <ModalBody className={'text-center'}>
                        <img src={selectedFile.base64} style={{ maxWidth: '1000px', height: 'auto' }} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            }
        </div>
    );
}