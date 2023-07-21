import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';

export default ({
    modal,
    setModal,
    selectedFile
}) => {

    const toggle = () => setModal(!modal);

    const printFile = () => {
        const printDoc = `
            <!DOCTYPE html>
            <html>
                <head>
                    <link rel="stylesheet" type="text/css" media="print" href="print.css" />
                </head>
                <body>
                    <img src=${selectedFile.accessLink} />
                </body>
                <script>
                    setTimeout(() => {
                        window.print();
                    }, 1000);
                </script>
            </html>
        `;

        const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
        myWindow.document.write(printDoc);
    }

    return (
        <Modal isOpen={modal} toggle={toggle} style={{ maxWidth: '1000px', width: '100%' }}>
            <ModalHeader>
                <span className={'float-left'}>View File: {selectedFile.s_file_type}</span>
                <Button className={'float-right'} onClick={() => printFile()}>Print</Button>
            </ModalHeader>
            <ModalBody className={''}>
                {
                    selectedFile.accessLink ? 
                        <Row>
                            <Col md={12} className={'text-center'}>
                                <img src={selectedFile.accessLink} style={{ maxWidth: '900px', height: 'auto'}} />
                            </Col>
                        </Row> :
                        <h4>No File Found</h4>
                }
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Close</Button>
            </ModalFooter>
        </Modal>
    );
}