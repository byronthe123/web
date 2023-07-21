import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import PulseLoader from 'react-spinners/PulseLoader';

export default ({
    modal,
    setModal
}) => {

    return (
        <>
            <Modal isOpen={modal} className={'no-modal'}>

            </Modal>
            <div className={`pulse-loading${modal ? '' : 'disabled'} mx-auto`} style={{ height: '200px'  }}></div>
        </>
    );
}