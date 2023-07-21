import React from 'react';
import { Label, FormGroup, Input, Modal, ModalBody, Form, Row, Col } from 'reactstrap';

export default function ModalViewLogEmail ({
    open, 
    handleModal,
    s_email_message,
    forwardEmail,
    resendNotificationEmail,
    selectedNotificationRecord
}) {

    const { s_emails_to, s_notification_type, s_caller, s_number_called, s_notes, s_mawb } = selectedNotificationRecord && selectedNotificationRecord;

    return (
        <Modal isOpen={open} toggle={() => handleModal(!open)} size={'lg'}>
            {
                s_notification_type === 'EMAIL' ?
                <ModalBody>
                    <Row className={'mx-2'} style={{ wordWrap: 'break-word' }}>
                        <Col md={10}>
                            <p>Emailed to: {s_emails_to}</p>
                        </Col>
                        <Col md={1}>
                            <p onClick={() => forwardEmail()} style={{textAlign: 'right', fontSize: '24px', color: '#0198E1'}} className='mr-2 pb-0 mb-0 pt-1'>
                                <i className='fas fa-envelope'></i>
                            </p>
                        </Col>
                        <Col md={1}>
                            <p onClick={() => resendNotificationEmail()} style={{textAlign: 'right', fontSize: '24px', color: '#0198E1'}} className='mr-2 pb-0 mb-0 pt-1'>
                                <i className='fa-solid fa-share-all'></i>
                            </p>
                        </Col>
                        <Col md={12} style={{ overflowX: 'scroll' }} >
                            <div dangerouslySetInnerHTML={{ __html: s_email_message }}>
                            </div>
                        </Col>
                    </Row>
                    
                </ModalBody> : 
                <ModalBody className="modal-content" style={{width: '600px', height: '500px'}}>
                    <Form style={{ width: '400px' }} className='mx-auto my-auto'>
                        <FormGroup>
                            <h4>Phone Notification Record</h4>
                            <h4>AWB: {s_mawb}</h4>
                        </FormGroup>
                        <FormGroup>
                            <Label>Caller</Label>
                            <Input type='text' value={s_caller} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Number Called</Label>
                            <Input type='text' value={s_number_called} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Number Called</Label>
                            <Input type='textarea' value={s_notes} style={{ height: '200px'}} />
                        </FormGroup>
                    </Form>
                </ModalBody>
            }
        </Modal>
    );
}
