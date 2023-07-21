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

const ModalSla = ({
    open, 
    handleModal,
    slaMapping,
    slaData,
    createNew,
    selectedItem,
    addUpdateSla,
    deleteSla
}) => {

    const aircraftTypes = [
        'CAO',
        'PAX',
        'TRK'
    ];

    const initialValues = {};

    for (let i = 0; i < slaMapping.length; i++) {
        const currentItem = slaMapping[i];
        if (createNew) {
            if (currentItem.value === 's_unit') {
                initialValues[currentItem.value] = units[0];
            } else if (currentItem.value === 's_aircraft') {
                initialValues[currentItem.value] = aircraftTypes[0];
            } else if (currentItem.value === 'b_default') {
                initialValues[currentItem.value] = false;
            } else {
                initialValues[currentItem.value] = '';
            }
        } else {
            initialValues[currentItem.value] = selectedItem && selectedItem[currentItem.value];
        }
    }

    const resolveValidDefault = (s_unit, b_default) => {
        if (!b_default || !createNew) {
            return true;
        } else {
            const existing = slaData.find(d => d.s_unit === s_unit && d.b_default === true);
            console.log(existing === undefined);
            console.log(!existing);
            return existing === undefined;
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
                                            const exclude = ['id'];
                                            for (let key in values) {
                                                if (exclude.indexOf(key) === -1 && values[key].length === 0) {
                                                    errors[key] = `${key} is invalid`;
                                                }
                                            }
                                            const validDefault = resolveValidDefault(values.s_unit, values.b_default);
                                            if (!validDefault) {
                                                errors.notValidDefault = true;
                                            }
                                            console.log(errors);
                                            return errors;
                                        }}
                                        >
                                        {({ isSubmitting, isValid, errors, values, setFieldValue }) => (
                                            <Form>
                                                <FormGroup>
                                                    <Label className='mr-2'>Unit</Label>
                                                    <Field component="select" name="s_unit" className="form-control">
                                                        {
                                                            units.map((u, i) => 
                                                                <option value={u} key={i}>{u}</option>
                                                            )
                                                        }
                                                    </Field>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label className='mr-2'>Airline Name</Label>
                                                    <Field type="text" name="s_airline_name" className="form-control" />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label className='mr-2'>Aircraft</Label>
                                                    <Field component="select" name="s_aircraft" className="form-control">
                                                    {
                                                        aircraftTypes.map((a, i) =>
                                                            <option value={a} key={i}>{a}</option>
                                                        )
                                                    }
                                                    </Field>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label className='mr-2'>Cut-off Time</Label>
                                                    <Field type="number" name="i_cut_off_time" className="form-control" />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label className='mr-2'>UWS Time</Label>
                                                    <Field type="number" name="i_uws_time" className="form-control" />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label className='mr-2'>SLA Breakdown</Label>
                                                    <Field type="number" name="i_sla_breakdown" className="form-control" />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label className='custom-label pl-0'>Default</Label>
                                                    <Switch
                                                        className="custom-switch custom-switch-primary"
                                                        checked={values.b_default}
                                                        onClick={() => setFieldValue("b_default", !values.b_default)}
                                                    />
                                                </FormGroup>
                                                {
                                                    !resolveValidDefault(values.s_unit, values.b_default) && 
                                                    <h3 color='danger'>Defaut already exists for station {values.s_unit}</h3>
                                                }
                                                <Button onClick={() => addUpdateSla(values)} disabled={!isValid}>
                                                    Submit
                                                </Button>
                                                {
                                                    !createNew && 
                                                    <Button className='ml-2' color='danger' onClick={() => deleteSla(selectedItem.id)}>
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

export default ModalSla;