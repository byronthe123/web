import React, { useState, useEffect } from 'react';
import { Row, Col, ButtonGroup, Label, Button, Input, FormGroup } from 'reactstrap';
import { Field } from 'formik';
import FormikCheckbox from '../../custom/FormikCheckbox';
import moment from 'moment';
import { render } from 'react-dom';

export default ({
    file,
    updateFile,
    fileTypes,
    next,
    push,
    fileType, 
    setFileType,
    modelId,
    setModelId,
    uploadFile,
    values,
    setFieldValue,
    selectedAwb,
    checkIdentification,
    saveIdentificationInformation,
    setModal={setModal},
    devices,
    type
}) => {

    const [selectedCategory, setSelectedCategory] = useState({});
    const [otherScanType, setOtherScanType] = useState(false);
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
        setFileType(fileType);
        updateFile('fileType', fileType);
        if (fileTypes[fileType] && fileTypes[fileType].modelId) {
            setModelId(fileTypes[fileType].modelId);
        }
    }

    const renderScanTypes = () => {
        if ( (type === 'WEBCAM' && devices.length > 0) || (type === 'UPLOAD') ) {
            if (fileTypes[file.fileType] && fileTypes[file.fileType].categories && fileTypes[file.fileType].categories.length > 0) {
                return true;
            }
        }
        return false;
    }

    const enableSelectFileNext = () => {
        const checkType = uploadFile ? fileType : file.fileType;

        if (renderScanTypes()) {
            const idTypeSelected = 
                (values.s_company_driver_id_type_1 && values.s_company_driver_id_type_1.length > 0) ||
                (values.s_company_driver_id_type_2 && values.s_company_driver_id_type_2.length > 0);

            if (selectedCategory.subcategories && selectedCategory.subcategories.length > 0) {
                return (idTypeSelected && modelId.length > 0) || otherScanType;
            } else {
                return idTypeSelected;
            }

        }
        return checkType && checkType.length > 0;  
    };

    const resolveActive = (key) => {
        if (uploadFile) { 
            return !addOtherType && fileType === key;
        } 
        return !addOtherType && file.fileType === key;
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
            if (fileType && fileType.includes('IDENTIFICATION')) {
                push('5'); // only push for WEBCAM modal
            } else {
                setModal(false);
            }
        }
    }

    const handleSelectCategory = (selectedCategory) => {
        const type = fileType === 'IDENTIFICATION1' ? 's_company_driver_id_type_1' : 's_company_driver_id_type_2';
        setSelectedCategory(selectedCategory);
        setFieldValue(type, selectedCategory.name);
    }

    const resolveNext = () => {
        if (type === 'WEBCAM') {
            if (devices.length < 1) {
                if (fileType === 'IDENTIFICATION1' || fileType === 'IDENTIFICATION2') {
                    return 'Manually Enter ID Data';
                } else {
                    return 'No Camera Detected: Exit'
                }
            } else {
                return 'Next';
            }
        }
        return 'Next';
    }

    const enableOtherFileScans = (key) => {
        const validPhoto = values.b_company_driver_photo_match_1 === true;
        if (!validPhoto && !['IDENTIFICATION1'].includes(key)) {
            return false;
        }
        return true;
    }

    return (
        <Row className={'text-center'}>
            <Col md={12}>
                <h4>Select File Type:</h4>
                <Row>
                    <Col md={12}>
                        {
                            Object.keys(fileTypes).map((key, i) => ( (fileTypes[key].singleUpload && !fileTypes[key].uploaded) || !fileTypes[key].singleUpload ) && 
                                    <Button 
                                        key={i} 
                                        onClick={() => handleSelectFileType(key)}
                                        active={resolveActive(key)}
                                        color={'primary mx-2'}
                                        disabled={!enableOtherFileScans(key)}
                                    >
                                        { key }
                                    </Button>
                                )
                        }
                        <Button
                            onClick={() => setAddOtherType(true)}
                            active={addOtherType}
                            color={'primary'}
                            disabled={!enableOtherFileScans('OTHER')}
                        >
                            Other
                        </Button>
                    </Col>
                </Row>

                {
                    fileType &&  fileType.length > 0 && fileTypes[file.fileType] && fileTypes[file.fileType].categories && fileTypes[file.fileType] && fileTypes[file.fileType].categories.length > 0 &&
                        <Row className={'mt-4'}>
                            <Col md={12}>
                                <h4>Select Category</h4>
                                {
                                    fileTypes[file.fileType].categories.map((c, i) => (
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
                    renderScanTypes() &&
                    <>
                        <Row className={'mt-4'}>
                            <Col md={12}>
                                <h4>
                                    {
                                        !selectedCategory.name ? 
                                            '' :
                                        selectedCategory.name && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 ? 
                                            'Select Scan Type' : 
                                            'No Scan Types Available. Please type data manually.'
                                    }
                                </h4>
                                {
                                    selectedCategory.subcategories && selectedCategory.subcategories.map((sc, i) => (
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
                            <Label>Enter Other Name:</Label>
                            {
                                uploadFile ? 
                                    <Input type='text' value={fileType} onChange={(e) => setFileType(e.target.value)} style={{ width: '500px' }} className={'mx-auto'} /> :
                                    <Input type='text' value={file.fileType} onChange={(e) => updateFile('fileType', e.target.value)} style={{ width: '500px' }} className={'mx-auto'} />
                            }
                        </Col>
                    </Row>
                }

                {/* <Button 
                    className={'mt-3 d-block mx-auto'} 
                    onClick={() => saveAndExit()}
                    disabled={!enableSelectFileNext()}
                    outline 
                    color={'secondary'}
                >
                    Save and Exit
                </Button> */}
                <Button 
                    className={'mt-3 d-block mx-auto'} 
                    onClick={() => handleNext()}
                    disabled={!enableSelectFileNext()}
                    color={'light'}
                >
                    {resolveNext()}
                </Button>
            </Col>
        </Row>
    );
}