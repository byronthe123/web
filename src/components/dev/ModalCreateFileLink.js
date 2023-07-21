import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import FileBase64 from 'react-file-base64';
import PulseLoader from 'react-spinners/PulseLoader';
import Clipboard from 'react-clipboard.js';

export default ({
    modal,
    setModal,
    setImage,
    imageKey,
    createImageLink,
    createdLink
}) => {

    const toggle = () => setModal(!modal);
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        setCompleted(false);
    }, [modal]);

    const handleCreateLink = async () => {
        setLoading(true);
        await createImageLink();
        setLoading(false);
        setCompleted(true);
    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader>Create File Link</ModalHeader>
            <ModalBody>
                {
                    loading ? 
                        <Row>
                            <Col md={12} className={'text-center'}>
                                <PulseLoader 
                                    size={75}
                                    color={'#51C878'}
                                    loading={true}
                                />
                            </Col>
                        </Row> :
                    completed ?
                        <Row>
                            <Col md={12}>
                                <h6 id={'copyLink'}>
                                    {createdLink}
                                </h6>
                                <Clipboard data-clipboard-target="#copyLink" className={'btn btn-secondary'}>
                                    <i className={'fas fa-copy'} style={{ fontSize: '20px' }} />
                                </Clipboard>
                            </Col>
                        </Row> :
                    <FileBase64 
                        onDone={setImage}
                        key={imageKey}
                    />
                }
            </ModalBody>
            <ModalFooter>
                {
                    !loading && !completed && 
                        <Button color="primary" onClick={() => handleCreateLink()}>Get Link</Button>
                }
                <Button color="secondary" onClick={toggle}>Exit</Button>
            </ModalFooter>
        </Modal>
    );
}