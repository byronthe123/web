import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Formik, Field } from 'formik';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Input,
    Label,
    Row,
    Form,
    Col
  } from "reactstrap";
import moment from 'moment';

import { units } from '../../../data/data';

const ModalIsc = ({
    open, 
    handleModal,
    iscMapping,
    iscData,
    createNew,
    selectedItem,
    addUpdateIsc,
    deleteIsc
}) => {

    const initialValues = {};

    for (let i = 0; i < iscMapping.length; i++) {
        const currentItem = iscMapping[i];
        if (createNew) {
            initialValues[currentItem.value] = '';
        } else {
            initialValues[currentItem.value] = selectedItem && selectedItem[currentItem.value];
        }
    }

    return (
        <Fragment>
            <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
                <div className="modal-content" style={{width: '600px'}}>
                    <div className="modal-body mx-auto" style={{width: '600px'}}>
                        <div className='text-center'>
                            <h1>{createNew ? 'Add New' : 'Update Info.'}</h1>
                        </div>
                        <div>
                            <Row className='pt-3'>
                                <Col md={12} className='mx-auto'>
                                    <Formik
                                        initialValues={initialValues}
                                        validate={values => {
                                            const errors = {};
                                            const exclude = ['id', 't_created', 's_created_by', 't_modified', 's_modified_by'];
                                            for (let key in values) {
                                                if (exclude.indexOf(key) === -1 && values[key].length === 0) {
                                                    errors[key] = `${key} is invalid`;
                                                }
                                            }
                                            console.log(errors);
                                            return errors;
                                        }}
                                        >
                                        {({ isSubmitting, isValid, errors, values, setFieldValue }) => (
                                            <Form>
                                                <FormGroup>
                                                    <Label className='mr-2'>Airline Prefix</Label>
                                                    <Field type="text" name="s_airline_prefix" className="form-control"></Field>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label className='mr-2'>Name</Label>
                                                    <Field type="text" name="s_airline_name" className="form-control" />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label className='mr-2'>Code</Label>
                                                    <Field type="text" name="s_airline_code" className="form-control"></Field>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label className='mr-2'>CEWR1</Label>
                                                    <Field type="number" name="f_cewr1" className="form-control"></Field>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label className='mr-2'>CIAD1</Label>
                                                    <Field type="number" name="f_ciad1" className="form-control"></Field>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label className='mr-2'>CBOS1</Label>
                                                    <Field type="number" name="f_cbos1" className="form-control"></Field>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label className='mr-2'>CJFK1</Label>
                                                    <Field type="number" name="f_cjfk1" className="form-control"></Field>
                                                </FormGroup>
                                                <Button onClick={() => addUpdateIsc(values)} disabled={!isValid}>
                                                    Submit
                                                </Button>
                                                {
                                                    !createNew && 
                                                    <Button className='ml-2' color='danger' onClick={() => deleteIsc(selectedItem.id)}>
                                                        Delete
                                                    </Button>
                                                }
                                            </Form>
                                        )}
                                    </Formik>                            
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}

export default ModalIsc;