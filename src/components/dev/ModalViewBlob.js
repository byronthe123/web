import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, Form, FormGroup, Input, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default ({
    modal, 
    setModal,
    accessLink
}) => {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} style={{ maxWidth: '100%', width: '1000px' }}>
            <ModalHeader>View Image File</ModalHeader>
            <ModalBody className='text-center'>
                <img src={`${accessLink}`} style={{ maxWidth: '950px' }} />
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Close</Button>
            </ModalFooter>
        </Modal>
    );
}

