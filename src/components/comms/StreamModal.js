import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import StreamMedia from './StreamMedia';

export default ({
    modal,
    setModal,
    selectedStream
}) => {

    console.log(selectedStream);

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} style={{ width: '1400px', height: '700px', maxWidth: '100%' }}>
            <ModalBody>
                {
                    selectedStream && 
                    <StreamMedia 
                        key={'test'}
                        id={selectedStream.id}
                        stream={selectedStream.stream}
                        remoteParticipant={selectedStream.participant}
                        modal={true}
                    />
                }
            </ModalBody>
        </Modal>
    );
}