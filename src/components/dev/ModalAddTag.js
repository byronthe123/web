import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input } from 'reactstrap';

export default ({
    modal,
    setModal,
    tag,
    setTag,
    addTag
}) => {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader>Add New Tag</ModalHeader>
            <ModalBody>
                <Label>Tag Name:</Label>
                <Input value={tag} onChange={(e) => setTag(e.target.value)} type='text' />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => addTag()}>Submit</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}