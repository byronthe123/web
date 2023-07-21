import React from 'react';
import { FormGroup, Label, Row, Col } from 'reactstrap';
import { Field } from 'formik';
import FormikCheckbox from '../../custom/FormikCheckbox';
import Activity from './Activity';

import SelectAirline from './SelectAirline';
import FormError from '../../custom/FormError';

export default ({
    values,
    setFieldValue,
    airlineOptions,
    handleSelectAirline,
    selectedAirline,
    viewOnly,
    errors
}) => {

    return (
        <Row>
            <Col md={3}>
                <h5>Enter Flight ID</h5>
                <SelectAirline 
                    selectedAirline={selectedAirline}
                    handleSelectAirline={handleSelectAirline}
                    airlineOptions={airlineOptions}
                    setFieldValue={setFieldValue}
                />
                <FormGroup>
                    <Label>Flight Number <FormError message={errors.s_flight_number} /></Label>
                    <Field name='s_flight_number' type='text' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>Flight Date <FormError message={errors.d_flight} /></Label>
                    <Field name='d_flight' type='date' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>Aircraft Type <FormError message={errors.s_aircraft_type} /></Label>
                    <Field name='s_aircraft_type' type='text' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <FormikCheckbox 
                        name={'b_nil'}
                        checked={values.b_nil}
                        label={'NIL'}
                        onClick={() => setFieldValue('b_nil', !values.b_nil)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormikCheckbox 
                        name={'b_cancelled'}
                        checked={values.b_cancelled}
                        label={'Cancelled'}
                        onClick={() => setFieldValue('b_cancelled', !values.b_cancelled)}
                    />
                </FormGroup>
            </Col>
            <Col md={3}>
                <h5>Enter Flight Data</h5>
                <FormGroup>
                    <Label>Aircraft Handling</Label>
                    <Field name='f_aircraft_handling' type='number' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>Aircraft Parking</Label>
                    <Field name='f_aircraft_parking' type='number' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>Drayage</Label>
                    <Field name='f_drayage' type='number' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>Lavatory</Label>
                    <Field name='i_lavatory' type='number' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>Water</Label>
                    <Field name='i_water' type='number' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>Cabin Cleaning</Label>
                    <Field name='i_cabin_cleaning' type='number' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>Waste Removal</Label>
                    <Field name='i_waste_removal' type='number' className='form-control' />
                </FormGroup>
            </Col>
            <Col md={3}>
                <FormGroup style={{ marginTop: '29px' }}>
                    <Label>Flight Watch</Label>
                    <Field name='f_flight_watch' type='number' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>GPU</Label>
                    <Field name='f_gpu' type='number' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>ASU</Label>
                    <Field name='f_asu' type='number' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>Deicing</Label>
                    <Field name='f_deicing' type='number' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>Weight Balance</Label>
                    <Field name='f_weight_balance' type='number' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>Customs</Label>
                    <Field name='f_customs' type='number' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>Gen Dec</Label>
                    <Field name='f_gen_dec' type='number' className='form-control' />
                </FormGroup>
            </Col>
            <Col md={3}>
                <Col md={12}>
                    <FormGroup className='mb-0'>
                        <Label>Notes</Label>
                        <Field name='s_notes' component='textarea' className='form-control' style={{ height: '100px'}} />
                    </FormGroup>
                </Col>
                <Activity 
                    viewOnly={viewOnly}
                    s_activity={values.s_activity}
                />
            </Col>

        </Row>
    );
}