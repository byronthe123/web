import React, { useState } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, ButtonGroup } from 'reactstrap';
import { Formik, Field } from 'formik';

export default ({
    open,
    toggle,
    newCompany,
    addExternalCompany,
    editExternalCompany,
    selectedCompany,
    units,
    selectedUnits,
    setSelectedUnits
}) => {

    console.log(selectedCompany);

    const mapping = ['s_company', 's_notes', 's_units'];

    const initialValues = {};

    for (let i = 0; i < mapping.length; i++) {
        const currentKey = mapping[i];
        if (newCompany) {
            initialValues[currentKey] = '';
        } else {
            initialValues[currentKey] = selectedCompany && selectedCompany[currentKey];
        }
    }

    const handleSubmit = (e, values) => 
        newCompany ? 
            addExternalCompany(e, values) :
            editExternalCompany(e, values);

    const handleSelectUnit = (unit) => {
        let newUnits;

        if (selectedUnits.includes(unit)) {
            newUnits = selectedUnits.filter(u => u !== unit);
        } else {
            newUnits = Object.assign([], selectedUnits);
            newUnits.push(unit);
        }

        setSelectedUnits(newUnits);
    }

    const enableSubmit = (values) => {
        return values.s_company.length > 0 && selectedUnits.length > 0;
    }

    return (
        <div>
            <Modal isOpen={open} toggle={toggle} size={'lg'}>
                <ModalHeader>{newCompany ? 'Add' : 'Edit'} Company</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validate={values => {
                        const errors = {};
                        const exclude = ['s_notes', 's_units'];
                        for (let key in values) {
                            const check = values[key];
                            if (exclude.indexOf(key) === -1 && check.length === 0) {
                                errors[key] = `${key} is invalid`;
                            }
                        }
                        if (selectedUnits.length < 1) {
                            errors['s_units'] = `One or more units must be selected`;
                        }
                        console.log(errors);
                        return errors;
                    }}
                >
                    {({ values, isValid, setFieldValue }) => (
                        <>
                            <ModalBody>
                                <Form>
                                    <FormGroup>
                                        <Label>Company Name</Label>
                                        <Field component='input' name='s_company' className='form-control' />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Notes</Label>
                                        <Field component='input' name='s_notes' className='form-control' />
                                    </FormGroup>
                                    <Row>
                                        <Col md={12}>
                                            <Label className='d-block'>Units</Label>
                                            {
                                                <ButtonGroup>
                                                    {
                                                        units.map((u, i) => 
                                                            <Button 
                                                                value={u} 
                                                                key={i} 
                                                                onClick={() => handleSelectUnit(u)}
                                                                active={selectedUnits.includes(u)}
                                                            >
                                                                {u}
                                                            </Button>
                                                        )
                                                    }
                                                </ButtonGroup>
                                            }
                                        </Col>
                                    </Row>
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                    <Button color="primary" disabled={!enableSubmit(values)} onClick={(e) => handleSubmit(e, values)}>Submit</Button>{' '}
                                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                            </ModalFooter>
                        </>
                    )}
                </Formik>
            </Modal>
        </div>
    );
}