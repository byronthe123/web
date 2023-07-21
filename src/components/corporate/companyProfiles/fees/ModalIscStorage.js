import React from 'react';
import { Modal, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

export default ({
    open,
    handleModal,
    s_unit,
    s_airline_code,
    f_isc,
    set_f_isc,
    f_kg,
    set_f_kg,
    f_min,
    set_f_min,
    createUpdateIscAndMinStorage
}) => {

    const enableSubmit = () => {
        const checkArray = [s_unit, s_airline_code, f_isc, f_kg, f_min];
        for (let i = 0; i < checkArray.length; i++) {
            if (checkArray[i] && checkArray[i].length < 1) {
                return false;
            }
        }
        return true;
    }

    return (
        <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-body mx-auto" style={{width: '600px'}}>
                    <div className='text-center'>
                        <h1>Update ISC and Storage Charges</h1>
                    </div>
                    <div>
                        <Row className='pt-3'>
                            <Col md={12} className='mx-auto'>
                                <Form>
                                    <FormGroup>
                                        <Label className='mr-2'>Unit</Label>
                                        <Input value={s_unit} disabled />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label className='mr-2'>Airline Name</Label>
                                        <Input value={s_airline_code} disabled />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label className='mr-2'>ISC</Label>
                                        <Input value={f_isc} onChange={(e) => set_f_isc(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label className='mr-2'>Mininum KG</Label>
                                        <Input value={f_kg} onChange={(e) => set_f_kg(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label className='mr-2'>Mininum Daily Charge</Label>
                                        <Input value={f_min} onChange={(e) => set_f_min(e.target.value)} />
                                    </FormGroup>
                                    <Button onClick={() => createUpdateIscAndMinStorage()} disabled={!enableSubmit()}>
                                        Submit
                                    </Button>
                                </Form>                          
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </Modal>
    );
}