import React, { useEffect } from 'react';
import { FormGroup, Label, Row, Col } from 'reactstrap';
import { Field } from 'formik';
import FormikCheckbox from '../../custom/FormikCheckbox';

import Activity from './Activity';
import SelectAirline from './SelectAirline';
import FormError from '../../custom/FormError';
import _ from 'lodash';

export default ({
    values,
    setFieldValue,
    airlineOptions,
    handleSelectAirline,
    selectedAirline,
    viewOnly,
    errors
}) => {

    const uomOptions = [
        'USD',
        'KG',
        'UNITS',
        'HOURS'
    ];

    const miscTypes = [
        '',
        'ULD OVERAGE',
        'TRANSFER SKID',
        'LABOR',
        'SPACE',
        'STORAGE',
        'OTHER'
    ];

    // useEffect(() => {
    //     if (values.s_misc_type && values.s_misc_type.length > 0) {
    //         if (miscTypes.indexOf(values.s_misc_type) === -1) {
    //             setFieldValue('s_misc_type_other', values.s_misc_type);
    //             setFieldValue('s_misc_type', 'OTHER');
    //         }   
    //     }
    // }, [values.s_misc_type]);

    return (
        <Row>
            <Col md={12}>
                <h5>Enter Data</h5>
            </Col>
            <Col md={6}>
                <SelectAirline 
                    selectedAirline={selectedAirline}
                    handleSelectAirline={handleSelectAirline}
                    airlineOptions={airlineOptions}
                    setFieldValue={setFieldValue}
                />
                <FormGroup>
                    <Label>Charge Date</Label>
                    <Field name='d_flight' type='date' className='form-control' />
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
            <Col md={6}>
                <FormGroup>
                    <Row>
                        <Col md={6}>
                            <Label>Misc. Type <FormError message={_.get(values, 's_misc_type.length', 0) === 0 ? 'Type required' : ''} /></Label>
                            <Field name='s_misc_type' component='select' className='form-control'>
                                {
                                    miscTypes.map((type, i) => (
                                        <option key={i}>{type}</option>
                                    ))
                                }
                            </Field>
                        </Col>
                        <Col md={6}>
                            {
                                values.s_misc_type === 'OTHER' && 
                                <>  
                                    <Label>Other Value</Label>
                                    <Field name='s_misc_type_other' type='text' className='form-control' />
                                </>
                            }
                        </Col>
                    </Row>
                </FormGroup>
                <FormGroup>
                    <Label>Misc Charge</Label>
                    <Field name='f_misc' type='number' className='form-control' />
                </FormGroup>
                <FormGroup>
                    <Label>Misc UOM</Label>
                    <Field name='s_misc_uom' component={'select'} className='form-control'>
                        {
                            uomOptions.map((o, i) =>
                                <option key={i} value={o}>{o}</option>
                            )
                        }
                    </Field>
                </FormGroup>
            </Col>
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
        </Row>
    );
}