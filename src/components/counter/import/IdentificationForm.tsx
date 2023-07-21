import React, { useMemo } from 'react';
import { Row, Col, FormGroup, Label, Button } from 'reactstrap';
import { Field } from 'formik';
import moment from 'moment';

import FormikCheckbox from '../../custom/FormikCheckbox';
import ConfirmField from './ConfirmField';
import { IMap } from '../../../globals/interfaces';
import { File, ISelectedAwb } from './interfaces';

interface Props {
    values: IMap<any>,
    setFieldValue: (name: string, value: any) => void,
    validIdentification: boolean,
    tempFile: File,
    handleAddFile: (identificationInfo: boolean, recognize: boolean) => void,
    selectedAwb: ISelectedAwb,
    reviewIdentification: boolean
}

export default function IdentificationForm ({
    values,
    setFieldValue,
    validIdentification,
    tempFile,
    handleAddFile,
    selectedAwb,
    reviewIdentification
}: Props) {

    const invalidExpiration = useMemo(() => {
        return !values.t_driver_id_expiration || values.t_driver_id_expiration.length === 0 || moment(values.t_driver_id_expiration).isBefore(moment().format('YYYY-MM-DD'));
    }, [values.t_driver_id_expiration]);

    const handleExpirationDate = (value: string, name: string, setFieldValue: (name: string, value: any) => void) => {
        if (value && moment(value).isValid()) {
            if (moment(value).isSameOrAfter(moment().local().format('YYYY-MM-DD'))) {
                setFieldValue(name, value);
            } else {
                setFieldValue(name, '');
                alert('Invalid date entered');
            }
        }
    }

    return (
        <Row>
            <Col md={12}>
                <Row className={'text-left mt-3'}>
                    <Col md={6} className={'text-center mt-2'}>
                        <p className={'mb-1'}>Kiosk Photo:</p>
                        <img src={`${selectedAwb.s_driver_photo_link || 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms='}`} style={{ maxWidth: '400px', height: 'auto', marginBottom: '5px' }} />
                        <p className={'mb-1'}>ID Scan:</p>
                        <img src={`${tempFile.base64 || 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms='}`} style={{ maxWidth: '400px', height: 'auto' }} />
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <ConfirmField 
                                name={'name'}
                                label={'Name: '}
                                fieldName={'s_driver_name'}
                                reviewIdentification={reviewIdentification}
                                handleChange={() => {}}
                                fieldType={''}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Identification Type:</Label>
                            <Field name={'s_driver_id_type'} className={'form-control'} disabled style={{ width: '350px' }} />
                        </FormGroup>
                        <FormGroup>
                            <ConfirmField 
                                name={'idNum'}
                                label={'Identification Number:'}
                                fieldName={'s_driver_id_number'}
                                reviewIdentification={reviewIdentification}
                                handleChange={() => {}}
                                fieldType={''}
                            />
                        </FormGroup>
                        <FormGroup>
                            <ConfirmField 
                                name={'expirationDate'}
                                label={'Expiration Date:'}
                                labelClassName={`${invalidExpiration && 'text-danger'}`}
                                fieldName={'t_driver_id_expiration'}
                                fieldType={'date'}
                                fieldClassName={`form-control d-inline ${invalidExpiration && 'bg-warning'}`}
                                handleChange={e => handleExpirationDate(e.target.value, 't_driver_id_expiration', setFieldValue)}
                                reviewIdentification={reviewIdentification}
                            />
                        </FormGroup>
                        <FormikCheckbox 
                            name={'b_driver_id_match_photo'}
                            checked={values.b_driver_id_match_photo}
                            label={'Driver Photo Match'}
                            onClick={() => setFieldValue('b_driver_id_match_photo', !values.b_driver_id_match_photo)}
                        />
                    </Col>
                    <Col md={12} className={'text-center'}> 
                        <Button disabled={!validIdentification} onClick={() => handleAddFile(true, false)}>Save</Button>
                    </Col>
                </Row>
            </Col>                                                   
        </Row>
    );
}