import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';

export default function ModalViewDriverPhoto ({
    modal,
    setModal,
    myAssignmentCompany
}) {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader>{myAssignmentCompany.s_trucking_company} - {myAssignmentCompany.s_trucking_driver}</ModalHeader>
            <ModalBody className={'text-center'}>
                <img src={`${myAssignmentCompany.s_driver_photo_link || 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms='}`} style={{ maxWidth: '750px', height: 'auto'}} />
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Close</Button>
            </ModalFooter>
        </Modal>
    );
}