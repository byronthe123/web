import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, Form, FormGroup, Input, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Formik, Field } from 'formik';
import * as yup from 'yup';
import moment from 'moment';

import FormikCheckbox from '../../components/custom/FormikCheckbox';

export default ({
    modal,
    setModal,
    item,
    createUpdate,
    updateDevUpdate
}) => {

    const toggle = () => setModal(!modal);

    const validationSchema = yup.object().shape({
        s_title: yup.string().required(),
        s_description: yup.string().required(),
    });

    const [initValues, setInitValues] = useState({});

    useEffect(() => {
        const values = {};
        const mapping = ['s_title', 's_description', 's_url', 's_image_url', 'b_display'];
        for (let i = 0; i < mapping.length; i++) {
            const key = mapping[i];
            if (createUpdate) {
                values[key] = '';
            } else {
                values[key] = item[key];
            }
        }
        setInitValues(values);
    }, [modal, createUpdate]);

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
                            <ModalHeader>{createUpdate ? 'Create' : 'Update'} Record</ModalHeader>
                            <ModalBody>
                                <Form>
                                    <FormGroup>
                                        <Label>Title</Label>
                                        <Field name='s_title' component='textarea' className='form-control' />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Description</Label>
                                        <Field name='s_description' component='textarea' className='form-control' />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>URL</Label>
                                        <Input type='textarea' value={values.s_url} disabled />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Image URL</Label>
                                        <Field name='s_image_url' component='textarea' className='form-control' />
                                    </FormGroup>
                                    <FormikCheckbox 
                                        name={'b_display'}
                                        checked={values.b_display}
                                        label={'Display'}
                                        onClick={() => setFieldValue('b_display', !values.b_display)}
                                    />
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" disabled={!isValid} onClick={() => updateDevUpdate(values)}>Submit</Button>
                                <Button color="secondary" onClick={toggle}>Cancel</Button>
                            </ModalFooter>
                        </>
                    )}
                </Formik>
            </Modal>
        </div>
    );
}

