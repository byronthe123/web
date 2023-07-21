import React, { useState, useEffect } from 'react';
import { Row, Col, FormGroup, Label, Button } from 'reactstrap';
import { Field } from 'formik';
import PulseLoader from 'react-spinners/PulseLoader';
import moment from 'moment';

import FormikCheckbox from '../../custom/FormikCheckbox';
import ConfirmField from './ConfirmField';

export default ({
    recognizingFile,
    formFields,
    setFormFields,
    values,
    setFieldValue,
    checkIdentification,
    selectedFile,
    fileType,
    setModal,
    saveIdentificationInformation,
    addToFiles,
    selectedAwb
}) => {

    const [useFileType, setUseFileType] = useState('');

    useEffect(() => {
        if (fileType && fileType.length > 0) {
            setUseFileType(fileType);
        } else {
            setUseFileType(selectedFile.fileType);
        }
    }, [fileType, selectedFile]);

    console.log(selectedFile);

    const handleSave = () => {
        saveIdentificationInformation(useFileType);
        addToFiles(selectedFile, fileType);
        setModal(false);
    }

    const mapping = {
        name: {
            'IDENTIFICATION': 's_driver_name',
            'IDENTIFICATION1': 's_company_driver_name',
            'IDENTIFICATION2': 's_company_driver_name'
        },
        identificationType: { 
            'IDENTIFICATION': 's_driver_id_type',
            'IDENTIFICATION1': 's_company_driver_id_type_1',
            'IDENTIFICATION2': 's_company_driver_id_type_2'
        },
        idNumber: { 
            'IDENTIFICATION': 's_driver_id_number',
            'IDENTIFICATION1': 's_company_driver_id_num_1',
            'IDENTIFICATION2': 's_company_driver_id_num_2'
        },
        idExpiration: { 
            'IDENTIFICATION': 't_driver_id_expiration',
            'IDENTIFICATION1': 'd_company_driver_id_expiration_1',
            'IDENTIFICATION2': 'd_company_driver_id_expiration_2'
        },
        photoMatch: { 
            'IDENTIFICATION': 'b_driver_id_match_photo',
            'IDENTIFICATION1': 'b_company_driver_photo_match_1',
            'IDENTIFICATION2': 'b_company_driver_photo_match_2'
        },
        confirmName: {
            'IDENTIFICATION': 'name',
            'IDENTIFICATION1': 'name',
            'IDENTIFICATION2': 'name'
        },
        confirmIdNum: {
            'IDENTIFICATION': 'idNum',
            'IDENTIFICATION1': 'idNum1',
            'IDENTIFICATION2': 'idNum2'
        },
        confirmExpirationDate: {
            'IDENTIFICATION': 'expirationDate',
            'IDENTIFICATION1': 'expirationDate1',
            'IDENTIFICATION2': 'expirationDate2'
        }
    }

    const handleExpirationDate = (value, name, setFieldValue) => {
        console.log(value.length);
        if (value && moment(value).isValid()) {
            if (
                moment(moment(value).format('YYYY-MM-DD'))
                .isSameOrAfter(moment().local().format('YYYY-MM-DD'))
            ) {
                setFieldValue(name, value);
            } else {
                setFieldValue(name, '');
                alert('Invalid Date');
            }
        }
    }

    return (
        <Row>
        {
            recognizingFile ?
                <Col md={12} className={'text-center'}>
                    <PulseLoader 
                        size={100}
                        color={'#51C878'}
                        loading={true}
                    />
                </Col> :
                <Col md={12}>
                    <Row className={'text-left mt-3'}>
                        <Col md={6} className={'text-center mt-2'}>
                            <p className={'mb-1'}>Kiosk Photo:</p>
                            <img src={`${selectedAwb.s_driver_photo_link || 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms='}`} style={{ maxWidth: '400px', height: 'auto', marginBottom: '5px' }} />
                            <p className={'mb-1'}>ID Scan:</p>
                            <img src={`${selectedFile.base64 || 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms='}`} style={{ maxWidth: '400px', height: 'auto' }} />
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label className={'d-block'}>Name:</Label>
                                <Field name={mapping.name[useFileType]} type={'text'} className={'form-control d-inline'} style={{ width: '350px' }} />
                                <ConfirmField 
                                    formFields={formFields}
                                    setFormFields={setFormFields}
                                    name={mapping.confirmName[useFileType]}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Identification Type:</Label>
                                <Field name={mapping.identificationType[useFileType]} className={'form-control'} disabled style={{ width: '350px' }} />
                            </FormGroup>
                            <FormGroup>
                                <Label className={'d-block'}>Identification Number:</Label>
                                <Field name={mapping.idNumber[useFileType]} type={'text'} className={'form-control d-inline'} style={{ width: '350px' }} />
                                <ConfirmField 
                                    formFields={formFields}
                                    setFormFields={setFormFields}
                                    name={mapping.confirmIdNum[useFileType]}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className={'d-block'}>Expiration Date:</Label>
                                <Field 
                                    name={mapping.idExpiration[useFileType]} 
                                    type={'date'} 
                                    className={`form-control d-inline ${!moment(values[mapping.idExpiration[useFileType]]).isValid() && 'bg-warning'}`} 
                                    min={moment().format('YYYY-MM-DD')}
                                    style={{ width: '350px' }}
                                    onChange={e => handleExpirationDate(e.target.value, mapping.idExpiration[useFileType], setFieldValue)}
                                />
                                <ConfirmField 
                                    formFields={formFields}
                                    setFormFields={setFormFields}
                                    name={mapping.confirmExpirationDate[useFileType]}
                                />
                            </FormGroup>
                            <FormikCheckbox 
                                name={mapping.photoMatch[useFileType]}
                                checked={values[mapping.photoMatch[useFileType]]}
                                label={'Driver Photo Match'}
                                onClick={() => setFieldValue(mapping.photoMatch[useFileType], !values[mapping.photoMatch[useFileType]])}
                            />
                        </Col>
                        <Col md={12} className={'text-center'}> 
                            <Button disabled={!checkIdentification(useFileType)} onClick={() => handleSave()}>Save</Button>
                        </Col>
                    </Row>
                </Col>
        }                                                    
    </Row>
    );
}