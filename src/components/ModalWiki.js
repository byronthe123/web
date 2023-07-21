import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import WikiComponent from '../components/portal/WikiComponent';

export default ({
    modal,
    setModal,
    user,
    baseApiUrl,
    headerAuthCode,
    wikiTitle
}) => {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} style={{ maxWidth: '1300px', width: '100%' }}>
            <ModalBody>
                <WikiComponent 
                    user={user}
                    baseApiUrl={baseApiUrl}
                    headerAuthCode={headerAuthCode}
                    wikiTitle={wikiTitle}
                    edit={false}
                />
            </ModalBody>
        </Modal>
    );
}