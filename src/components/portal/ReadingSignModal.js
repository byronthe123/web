import moment from 'moment';
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';

export default ({
    modal,
    setModal,
    selectedReadingSign,
    user,
    acknowledgeReadingSign
}) => {

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'} className={'responsive-modal'}>
        {
            selectedReadingSign && selectedReadingSign.readingSignId  &&
            <>
                <ModalHeader>Read and Sign: {selectedReadingSign.readingSignId.title}</ModalHeader>
                <ModalBody>
                    <div dangerouslySetInnerHTML={{__html: selectedReadingSign.readingSignId.content}}></div>
                </ModalBody>
                {
                    !selectedReadingSign.acknowledged && 
                    <ModalFooter style={{ width: '100%' }}>
                        <Row style={{ width: '100%' }}>
                            <Col md={12}>
                                <div className={'float-left'}>
                                    <h4>I, {user.displayName}, acknowledge this update, {selectedReadingSign.readingSignId.title} at {moment().format('MM/DD/YYYY HH:mm:ss')}.</h4>
                                </div>
                                <div className={'float-right'}>
                                    <Button color="secondary" className={'mr-1'} onClick={() => acknowledgeReadingSign()}>Acknowledge</Button>
                                    <Button color="secondary" color={'danger'} onClick={toggle}>Exit</Button>
                                </div>
                            </Col>
                        </Row>
                    </ModalFooter>
                }
            </>
        }
        </Modal>
    );
}