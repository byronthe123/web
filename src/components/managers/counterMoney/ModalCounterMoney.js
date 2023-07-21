import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, Row, Col, FormGroup, Input, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Formik, Field } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import statusOptions from './statusOptions';

export default ({
    modal,
    setModal,
    item,
    updateCounterMoney
}) => {

    const toggle = () => setModal(!modal);

    const validationSchema = yup.object().shape({
        s_type: yup.string().required(),
        s_payment_reference: yup.string().notRequired(),
        f_amount: yup.number().required()
    });

    const [initValues, setInitValues] = useState({});

    useEffect(() => {
        const values = {};
        const mapping = ['s_type', 's_payment_reference', 'f_amount', 's_notes'];
        for (let i = 0; i < mapping.length; i++) {
            const key = mapping[i];
            values[key] = item[key] || '';
        }
        console.log(values);
        setInitValues(values);
        resolveDropDownButton();
    }, [modal]);

    const [statusButtons, setStatusButtons] = useState([]);
    const [dropdownOpen, setOpen] = useState(false);

    const resolveDropDownButton = () => {
        const buttons = [];
        const currentStatus = item && item.s_status && item.s_status.toUpperCase();
        buttons.push(currentStatus);
        statusOptions.map(o => o !== currentStatus && buttons.push(o));
        setStatusButtons(buttons);
    }

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle}>
                <Formik
                    validateOnMount={true}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    initialValues={initValues}
                >
                    {({ values, setFieldValue, isValid }) => (
                        <>
                            <ModalHeader>View Record</ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Payment ID</Label>
                                            <Input value={item.i_id} disabled />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Created</Label>
                                            <Input value={moment(item.t_created).format('MM/DD/YYYY HH:mm:ss')} disabled />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Processed By</Label>
                                            <Input value={item.s_created_by.toUpperCase().replace('@CHOICE.AERO', '')} disabled />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>MAWB</Label>
                                            <Input value={item.s_mawb} disabled />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>HAWB</Label>
                                            <Input value={item.s_hawb} disabled />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Type</Label>
                                            <Field name='s_type' className='form-control' type='text' />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Check #</Label>
                                            <Field name='s_payment_reference' className='form-control' type='text' />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Amount</Label>
                                            <Field name='f_amount' className='form-control' type='number' />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Label>Notes</Label>
                                        <Field name='s_notes' component='textarea' className='form-control' />
                                    </Col>
                                </Row>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" disabled={!isValid} onClick={() => updateCounterMoney(values)}>Update</Button>
                                <ButtonDropdown isOpen={dropdownOpen} toggle={() => setOpen(!dropdownOpen)}>
                                    <DropdownToggle caret>
                                        Change Status
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {
                                            statusButtons.map((b, i) =>
                                                <DropdownItem key={i} disabled={b === item.s_status} onClick={() => updateCounterMoney({ s_status: b })}>
                                                    {b}
                                                </DropdownItem>
                                            )
                                        }
                                    </DropdownMenu>
                                </ButtonDropdown>
                                <Button color="secondary" onClick={toggle}>Cancel</Button>
                            </ModalFooter>
                        </>
                    )}
                </Formik>
            </Modal>
        </div>
    );
}

