import React, { useState } from 'react';
import { FormGroup } from 'reactstrap';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input } from 'reactstrap';
import CustomSwitch from '../../custom/CustomSwitch';

export default function ModalNotification ({
    modal,
    setModal,
    handleCreateNotification
}) {

    const toggle = () => setModal(!modal);
    const [message, setMessage] = useState('');
    const [update, setUpdate] = useState(false);

    return (
        <div>
            <Modal isOpen={modal}>
                <ModalHeader>Notification</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Message</Label>
                        <Input type='textarea' value={message} onChange={(e) => setMessage(e.target.value)} className='mb-2' />
                    </FormGroup>
                    <FormGroup className={'ml-4'}>
                        <Input type='checkbox' value={update} onClick={() => setUpdate(prev => !prev)} className='mb-2' />
                        <Label check>Update</Label>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" disabled={message.length < 1} onClick={() => handleCreateNotification(message, update)}>Create</Button>
                    <Button color="secondary" onClick={toggle}>Exit</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}