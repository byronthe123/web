import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Row, Col } from 'reactstrap';
import { Field, Formik } from 'formik';
import airlinesFormMapping from './airlinesFormMapping';
import * as yup from 'yup';
import FileBase64 from 'react-file-base64';
import SaveButton from '../../../custom/SaveButton';
import DeleteButton from '../../../custom/DeleteButton';

export default ({
    modal,
    setModal,
    newAirline,
    selectedAirline,
    handleCreateUpdateAirline,
    deleteAirline,
    setLogoAttachment,
    setSqLogoAttachment
}) => {

    const [uploadKey, setUploadKey] = useState(0);
    const [initialValues, setInitialValues] = useState({});

    const airlineSchema = yup.object().shape({
        s_airline_prefix: yup.string().required(),
        s_airline_name: yup.string().required(),
        s_airline_code: yup.string().required(),
        s_logo: yup.string().notRequired()
    });

    const toggle = () => setModal(!modal);

    useEffect(() => {
        const resolveInitialValues = () => {
            const initialValues = {};
            for (let i = 0; i < airlinesFormMapping.length; i++) {
                const key = airlinesFormMapping[i];
                if (newAirline) {
                    initialValues[key] = '';
                } else {
                    initialValues[key] = selectedAirline[key];
                }
            }
            return initialValues;
        }
        setInitialValues(resolveInitialValues());
        setUploadKey(uploadKey + 1);
    }, [modal]);

    const enableSubmit = (values) => {
        const keys = ['s_airline_prefix','s_airline_name','s_airline_code'];
        for (let i = 0; i < keys.length; i++) {
            const current = keys[i];
            if (!values[current] || values[current].length < 1) {
                return false;
            }
        }
        return true;
    }

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} size={'lg'}>
                <ModalHeader>{ newAirline ? 'Create' : 'Update' } Airline</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={airlineSchema}
                >
                    {({values, isValid}) => (
                        <>
                            <ModalBody>
                                <Form>
                                    <FormGroup>
                                        <Label>Name</Label>
                                        <Field type='text' name='s_airline_name' className='form-control' />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Airline Prefix</Label>
                                        <Field type='number' name='s_airline_prefix' className='form-control' />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Code</Label>
                                        <Field type='text' name='s_airline_code' className='form-control' />
                                    </FormGroup>
                                    {
                                        !newAirline && 
                                        <Row>
                                            <Col md={6}>
                                                <Label>Normal: {values.s_logo}</Label>
                                                <img src={values.s_logo} style={{ width: '250px', height: 'auto' }} className={'d-block'} />
                                            </Col>
                                            <Col md={6}>
                                                <Label>Square: {(values.s_logo || '').replace('.png', '-sq.png')}</Label>
                                                {
                                                    values.s_logo && 
                                                    <img src={(values.s_logo || '').replace('.png', '-sq.png')} style={{ width: '250px', height: 'auto' }} className={'d-block'} />
                                                }
                                            </Col>
                                        </Row>
                                    }
                                    <FormGroup>
                                        <Label className={'d-block'}>Upload Logo</Label>
                                        <FileBase64 
                                            onDone={setLogoAttachment}
                                            key={uploadKey}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label className={'d-block'}>Upload Square Logo</Label>
                                        <FileBase64 
                                            onDone={setSqLogoAttachment}
                                            key={uploadKey}
                                        />
                                    </FormGroup>
                                </Form>
                            </ModalBody>
                            <ModalFooter style={{ width: '100%' }}>
                                <Row style={{ width: '100%' }}>
                                    <Col md={12}>
                                        <DeleteButton 
                                            handleDelete={() => deleteAirline(selectedAirline.id)}
                                            className={'float-left'}
                                        />
                                        <SaveButton 
                                            enableSave={() => enableSubmit(values)}
                                            handleSave={() => handleCreateUpdateAirline(values)}
                                            className={'float-right'}
                                        />
                                    </Col>
                                </Row>
                            </ModalFooter>
                        </>
                    )}
                </Formik>
            </Modal>
        </div>
    );
}