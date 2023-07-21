import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Label, Button, Input } from 'reactstrap';
import moment from 'moment';
import _ from 'lodash';

export default ({
    fileTypes,
    next,
    push,
    s_file_type, 
    set_s_file_type,
    modelId,
    setModelId,
    values,
    setFieldValue,
    setModal,
    devices,
    type
}) => {

    const [selectedCategory, setSelectedCategory] = useState({});
    const [otherScanType, setOtherScanType] = useState(false);
    const [addOtherType, setAddOtherType] = useState(false);

    useEffect(() => {
        if (addOtherType) {
            set_s_file_type('');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addOtherType]);

    const handleSelectFileType = (s_file_type) => {
        setAddOtherType(false);
        set_s_file_type(s_file_type);
    }

    const renderScanTypes = useMemo(() => {
        if ( (type === 'WEBCAM' && devices.length > 0) || (type === 'UPLOAD') ) {
            if (_.get(fileTypes, `[${s_file_type}].categories.length`, 0) > 0) {
                return true;
            }
        }
        return false;
    }, [type, fileTypes, s_file_type, devices.length]);

    const enableSelectFileNext = useMemo(() => {
        if (renderScanTypes) {
            const idTypeSelected = values.s_driver_id_type && values.s_driver_id_type.length > 0;
            if (_.get(selectedCategory, 'subcategories', null)) {
                return (idTypeSelected && modelId.length > 0) || otherScanType;
            } else {
                return idTypeSelected;
            }
        } else {
            return _.get(s_file_type, 'length', 0) > 0; 
        }
    }, [renderScanTypes, modelId.length, otherScanType, s_file_type, selectedCategory, values.s_driver_id_type]);

    const resolveActive = (key) => {
        return !addOtherType && s_file_type === key;
    }

    useEffect(() => {
        if (values.t_driver_id_expiration) {
            const year = parseInt(moment(values.t_driver_id_expiration).format('YYYY'));
            if (year >= 2100) {
                alert('Invalid date');
                setFieldValue('t_driver_id_expiration', '');
            }
        }
    }, [values.t_driver_id_expiration]);

    const handleSelectScanType = (modelId) => {
        if (modelId) {
            setModelId(modelId);
            setOtherScanType(false)
        } else {
            setOtherScanType(true);
            setModelId('');
        }
    }

    const handleNext = () => {
        if ( (type === 'WEBCAM' && devices.length > 0) || (type === 'UPLOAD') ) {
            next();
        } else {
            if (s_file_type === 'IDENTIFICATION') {
                push('5'); // only push for WEBCAM modal
            } else {
                setModal(false);
            }
        }
    }

    const handleSelectCategory = (selectedCategory) => {
        setSelectedCategory(selectedCategory);
        setFieldValue('s_driver_id_type', selectedCategory.name);
    }

    const resolveNext = useMemo(() => {
        if (type === 'WEBCAM') {
            if (devices.length < 1) {
                if (s_file_type === 'IDENTIFICATION') {
                    return 'Manually Enter ID Data';
                } else {
                    return 'No Camera Detected: Exit'
                }
            } else {
                return 'Next';
            }
        }
        return 'Next';
    }, [type, devices.length, s_file_type]);

    return (
        <Row className={'text-center'}>
            <Col md={12}>
                <h4>Select File Type:</h4>
                <Row>
                    <Col md={12}>
                        {
                            Object.keys(fileTypes).map((key, i) => 
                                    <Button 
                                        key={i} 
                                        onClick={() => handleSelectFileType(key)}
                                        active={resolveActive(key)}
                                        color={'primary mx-2'}
                                    >
                                        { key }
                                    </Button>
                                )
                        }
                        <Button
                            onClick={() => setAddOtherType(true)}
                            active={addOtherType}
                            color={'primary'}
                        >
                            Other
                        </Button>
                    </Col>
                </Row>

                {
                    _.get(fileTypes, `[${s_file_type}].categories`, null) &&
                        <Row className={'mt-4'}>
                            <Col md={12}>
                                <h4>Select Category</h4>
                                {
                                    fileTypes[s_file_type].categories.map((c, i) => (
                                        <Button 
                                            onClick={() => handleSelectCategory(c)} 
                                            key={i}
                                            active={selectedCategory.name === c.name}
                                            className={'mx-2 mt-2'}
                                        >
                                            {c.name}
                                        </Button>
                                    ))
                                }
                            </Col>
                        </Row>
                }

                {
                    renderScanTypes &&
                    <>
                        <Row className={'mt-4'}>
                            <Col md={12}>
                                <h4>
                                    {
                                        !selectedCategory.name ? 
                                            '' :
                                        _.get(selectedCategory, 'subcategories', null) ? 
                                            'Select Scan Type' : 
                                            'No Scan Types Available. Please type data manually.'
                                    }
                                </h4>
                                {
                                    _.get(selectedCategory, 'subcategories', []).map((sc, i) => (
                                        <Button 
                                            key={i} 
                                            color={'info'}
                                            className={'mx-2 mt-2'}
                                            active={modelId === sc.modelId}
                                            onClick={() => handleSelectScanType(sc.modelId)}
                                        >
                                            {sc.name}
                                        </Button>
                                    ))
                                }
                                {
                                    selectedCategory.name && 
                                        <Button onClick={() => handleSelectScanType(null)} active={otherScanType} className={'mt-2'}>Other</Button>
                                }
                            </Col>
                        </Row>
                    </>
                }

                {
                    addOtherType && 
                        <Row className={'mt-2 text-center'}> 
                            <Col md={12}>
                                <Label>Enter Other Name: </Label>
                                <Input type='text' value={s_file_type} onChange={(e) => set_s_file_type(e.target.value)} style={{ width: '500px' }} className={'mx-auto'} />
                            </Col>
                        </Row>
                }

                <Button 
                    className={'mt-3 d-block mx-auto'} 
                    onClick={() => handleNext()}
                    disabled={!enableSelectFileNext}
                    color={'light'}
                >
                    {resolveNext}
                </Button>
            </Col>
        </Row>
    );
}