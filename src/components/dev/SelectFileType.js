import React, { useState, useEffect } from 'react';
import { Row, Col, ButtonGroup, Label, Button, Input, FormGroup } from 'reactstrap';
import { Field } from 'formik';
import FormikCheckbox from '../../custom/FormikCheckbox';
import moment from 'moment';

export default ({
    file,
    updateFile,
    fileTypes,
    next,
    fileType, 
    setFileType,
    uploadFile,
    values,
    setFieldValue,
    selectedAwb,
    checkIdentification,
    saveIdentificationInformation,
    setModal={setModal}
}) => {


    const identificationTypes = [`STATE DRIVER'S LICENSE`, `U.S. PASSPORT`, `SIDA BADGE`, `U.S. Department of Defense ID`, `PERMENANT RESIDENT CARD`, `FOREIGN GOVERNMENT-ISSUED PASSPORT`, `TRANSPORTATION WORKER IDENTIFICATION CREDENTIAL`];

    useEffect(() => {
        if (!values.s_driver_id_type || values.s_driver_id_type.length < 1) {
            setFieldValue('s_driver_id_type', identificationTypes[0]);
        }
    }, []);

    const [addOtherType, setAddOtherType] = useState(false);

    useEffect(() => {
        if (addOtherType) {
            if (uploadFile) {
                setFileType('');
            } else {
                updateFile('fileType', '');
            }
        }
    }, [addOtherType]);

    const handleSelectFileType = (fileType) => {
        setAddOtherType(false);

        if (uploadFile) {
            setFileType(fileType);
        } else {
            updateFile('fileType', fileType);
        }
    }

    const enableSelectFileNext = () => {
        if (uploadFile) {
            if (fileType === 'IDENTIFICATION') {
                return checkIdentification();
            }
            return fileType && fileType.length > 0;
        }
        if (file.fileType === 'IDENTIFICATION') {
            return checkIdentification();
        }
        return file.fileType && file.fileType.length > 0;
    };

    const resolveActive = (key) => {
        if (uploadFile) { 
            return !addOtherType && fileType === key;
        } 
        return !addOtherType && file.fileType === key;
    }

    const displayIdentificationForm = () => {
        if (uploadFile ) {
            return fileType === 'IDENTIFICATION';
        } else {
            return file.fileType === 'IDENTIFICATION';
        }
    }

    const handleNext = () => {
        if (fileType === 'IDENTIFICATION' || file.fileType === 'IDENTIFICATION') {
            saveIdentificationInformation();
        }
        next();
    }

    const saveAndExit = () => {
        saveIdentificationInformation();
        setModal(false);
    }

    return (
        <Row className={'text-center'}>
            <Col md={12}>
                <h4>Select File Type:</h4>
                <ButtonGroup>
                    {
                        Object.keys(fileTypes).map((key, i) => 
                            <Button 
                                key={i} 
                                onClick={() => handleSelectFileType(key)}
                                active={resolveActive(key)}
                                color={'info'}
                            >
                                { key }
                            </Button>
                        )
                    }
                    <Button
                        onClick={() => setAddOtherType(true)}
                        active={addOtherType}
                        color={'info'}
                    >
                        Other
                    </Button>
                </ButtonGroup>

                {
                    displayIdentificationForm() &&
                    <Row className={'text-left mt-3'}>
                        <Col md={3} className={'text-center mt-2'}>
                            <img src={`${selectedAwb.s_driver_photo_link || 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms='}`} style={{ borderRadius: '50%', width: '210px', height: '210px' }} />
                        </Col>
                        <Col md={9}>
                            <FormGroup>
                                <Label>Name:</Label>
                                <Field name={'s_driver_name'} type={'text'} className={'form-control'} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Identification Type:</Label>
                                <Field component={'select'} name={'s_driver_id_type'} className={'form-control'}>
                                    {
                                        identificationTypes.map((type, i) =>
                                            <option value={type} key={i}>{type}</option>
                                        )
                                    }
                                </Field>
                            </FormGroup>
                            <FormGroup>
                                <Label>Identification Number:</Label>
                                <Field name={'s_driver_id_number'} type={'text'} className={'form-control'} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Expiration Date:</Label>
                                <Field 
                                    name={'t_driver_id_expiration'} 
                                    type={'date'} 
                                    className={'form-control'} 
                                    min={moment().format('YYYY-MM-DD')}
                                />
                            </FormGroup>
                            <FormikCheckbox 
                                name={'b_driver_id_match_photo'}
                                checked={values.b_driver_id_match_photo}
                                label={'Driver Photo Match'}
                                onClick={() => setFieldValue('b_driver_id_match_photo', !values.b_driver_id_match_photo)}
                            />
                        </Col>
                    </Row>
                }

                {
                    addOtherType && 
                    <Row className={'mt-2 text-center'}> 
                        <Col md={12}>
                            <Label>Enter Other Name:</Label>
                            {
                                uploadFile ? 
                                    <Input type='text' value={fileType} onChange={(e) => setFileType(e.target.value)} style={{ width: '500px' }} className={'mx-auto'} /> :
                                    <Input type='text' value={file.fileType} onChange={(e) => updateFile('fileType', e.target.value)} style={{ width: '500px' }} className={'mx-auto'} />
                            }
                        </Col>
                    </Row>
                }

                <Button 
                    className={'mt-3 d-block mx-auto'} 
                    onClick={() => saveAndExit()}
                    disabled={!enableSelectFileNext()}
                >
                    Save and Exit
                </Button>
                <Button 
                    className={'mt-3 d-block mx-auto'} 
                    onClick={() => handleNext()}
                    disabled={!enableSelectFileNext()}
                >
                    Next
                </Button>
            </Col>
        </Row>
    );
}