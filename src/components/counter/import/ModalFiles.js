import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useImportContext } from './context';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Webcam from "react-webcam";
import CropPhoto from '../CropPhoto';
import { Wizard, Steps, Step } from 'react-albus';
import TopNavigation from '../../wizard-hooks/TopNavigation';
import SelectFileType from './SelectFileType';
import FileBase64 from 'react-file-base64';
import IdentificationForm from './IdentificationForm';
import { v4 as uuidv4 } from 'uuid';
import PickUpOrderCheck from './PickUpOrderCheckbox';
import _ from 'lodash';
import { print } from '../../../utils';
import PrintImage from './PrintImage';
import ActionIcon from '../../custom/ActionIcon';

const Main = ({
    previous,
    next,
    push,
    type,
    modal,
    setModal,
    reviewIdentification,
    selectedFile
}) => {

    const { global, module, fileProps, identification, additionalData } = useImportContext();

    const { mobile } = global;

    const { 
        values, 
        setFieldValue, 
        saveAndRecognizeForm, 
        formFields, 
        setFormFields,
        selectedAwb,
        manualMode
    } = module;

    const { 
        fileTypes, 
        addToFiles, 
        file, 
        setFile, 
        updateFile,
        modelId,
        setModelId 
    } = fileProps;

    const { saveIdentificationInformation, validIdentification } = identification;
 
    const [tempFile, setTempFile] = useState({});

    useEffect(() => {
        if (reviewIdentification) {
            if (!tempFile || !tempFile.base64) {
                setTempFile(selectedFile);
            }
            if (type === 'WEBCAM') {
                push('5');
            } else {
                push('3');
            }
        } else {
            push('1'); 
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviewIdentification, modal, type]);

    // ------ Upload Files ------

    const [fileKey, setFileKey] = useState(0);
    const [s_file_type, set_s_file_type] = useState('');

    // Crop:
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);

    const webcamRef = React.useRef(null); 

    const capture = (next) => {
        const imageSrc = webcamRef.current.getScreenshot();
    
        let img = document.createElement('img');
        img.setAttribute('src', imageSrc);

        imgRef.current = img;
        setUpImg(imageSrc);

        next();
    }

    const retakePhoto = (previous) => {
        previous();
    }

    // Select Camera:

    const [deviceId, setDeviceId] = React.useState({});
    const [devices, setDevices] = React.useState([]);
    
    const handleDevices = React.useCallback(
        mediaDevices =>
        setDevices(mediaDevices.filter(({ kind, deviceId }) => kind === "videoinput" && deviceId.length > 0)),
        [setDevices]
    );

    useEffect(() => {
        if (devices.length > 0) {
            setDeviceId(devices[0].deviceId);
        }
    }, [devices]);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
    },[handleDevices]);

    const toggle = () => setModal(!modal);

    useEffect(() => {
        setFileKey(fileKey => fileKey + 1);
        setFile({});
        set_s_file_type('');
        setModelId('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modal]);

    const topNavClick = (stepItem, push, step) => {
        if (step.id === '1') {
            if (!enableSelectFileNext) {
                return;
            }
        } else if (step.id === '2') {
            if (!file.base64) {
                if (stepItem.id !== '1') {
                    return;
                }
            }
        }
        push(stepItem.id);
    };

    const resolveFileSize = (file) => {
        const base64str = file.base64.split('base64,')[1];
        const decoded = atob(base64str);
        return decoded.length / 0.75;
    }  

    const fileSizeFormatter = (size) => {
        if (size > 999999) {
            return `${(size / 1000000).toFixed(2)} mb`;
        } else {
            return `${(size / 1000).toFixed(2)} kb`;
        }
    }

    const prepFile = (file, upload=false) => {
        file.guid = uuidv4();

        if (upload) {
            file.displaySize = file.size;
            file.type = file.file.type;
            file.modalType = 'UPLOAD';
        } else {
            const fileSize = resolveFileSize(file);
            file.size = fileSize;
            file.displaySize = fileSizeFormatter(fileSize);   
            file.type = 'image/png'; 
            file.modalType = 'WEBCAM';
        }

        file.s_file_type = s_file_type;

        return file;
    }

    const handleAddFile = async (identificationInfo, recognize) => {

        if (reviewIdentification) {
            setModal(false);
            return;
        }

        if (identificationInfo) {
            addToFiles(tempFile, s_file_type);
            saveIdentificationInformation();
            setModal(false);
        } else {
            const useFile = prepFile(file,  type === 'UPLOAD');
            setTempFile(useFile);

            const recognizeFiles = {
                'IDENTIFICATION': true
            }
    
            if (recognizeFiles[s_file_type]) {
                if (modelId && modelId.length > 0 && recognize) {
                    await saveAndRecognizeForm(useFile, modelId, s_file_type);
                }
                next();
            } else {
                addToFiles(useFile, s_file_type);
                setModal(false);
            }
        }
    
        setFile({});
    }

    const enableSelectFileNext = useMemo(() => {
        if (type === 'WEBCAM') {
            if (s_file_type === 'IDENTIFICATION') {
                return validIdentification;
            } 
            return s_file_type.length > 0;
        }
    }, [type, s_file_type, validIdentification]);

    const [rotated, setRotated] = useState(false);
    const [pickUpOrderCheck, setPickUpOrderCheck] = useState(false);

    const renderSaveButton = 
        (s_file_type === 'PICK UP ORDER' && pickUpOrderCheck) ||
        s_file_type !== 'PICK UP ORDER';

    const consignee = useMemo(() => {
        if (values.s_hawb && values.s_hawb.length > 0) {
            const fhl = additionalData.fhls.find(f => f.s_hawb === values.s_hawb);
            const fhlConsignee = _.get(fhl, 's_consignee_address_name1', '[Not available]');
            return fhlConsignee;
        }
        return _.get(additionalData.fwbs, '[0].s_consignee_name1', '[Not available]')
    }, [additionalData.fwbs, additionalData.fhls, values.s_hawb]);

    return (
        <Modal isOpen={modal} toggle={toggle} style={{ maxWidth: mobile ? '1080px' : '1400px', width: '100%' }}>
            <div className="wizard wizard-default">

                <ModalHeader>
                    <TopNavigation
                        className="justify-content-center mb-4"
                        disableNav={false}
                        topNavClick={topNavClick}
                    />
                </ModalHeader>
                <ModalBody>
                        {
                            type === 'WEBCAM' ?
                                <Steps>  
                                    
                                    <Step id={'1'} name={'Select File Type'}>
                                        <SelectFileType 
                                            fileTypes={fileTypes}
                                            next={next}
                                            push={push}
                                            s_file_type={s_file_type}
                                            set_s_file_type={set_s_file_type}
                                            modelId={modelId}
                                            setModelId={setModelId}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            setModal={setModal}
                                            devices={devices}
                                            type={type}
                                        />
                                    </Step>
    
                                    <Step id={'2'} name={'Take Photo'}>
                                        <Row>
                                            <Col md={12} className='text-center'>
                                                <div className='mb-2'>
                                                    {devices.map((device, key) => (
                                                        <Button
                                                            key={device.deviceId}
                                                            onClick={() => setDeviceId(device.deviceId)}
                                                            active={deviceId === device.deviceId}
                                                            className='mr-2'
                                                        >
                                                            {device.label || `Device ${key + 1}`}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </Col>
                                            <Col md={12} className='text-center'>
                                                <Webcam
                                                    audio={false}
                                                    ref={webcamRef}
                                                    screenshotFormat="image/jpeg"
                                                    // videoConstraints={{ deviceId }}
                                                    // width={720}
                                                    // height={480}
                                                    videoConstraints={{ deviceId, width: 2592, height: 1944 }}
                                                    width={mobile ? 1080 : 1280}
                                                    height={mobile ? 608 : 720}
                                                />
                                            </Col>
                                            <Col md={12} className='text-center'>
                                                <Button onClick={() => capture(next)} className='text-center'>Capture photo</Button>
                                            </Col>
                                            <Col md={12} className='text-center'>
                                                <h4 className='fas fa-times mt-1' style={{ color: 'red' }}>Photo Not Saved</h4>
                                            </Col>
                                        </Row>
                                    </Step>
    
                                    <Step id={'3'} name={'Crop Photo'}>
                                        <CropPhoto 
                                            upImg={upImg}
                                            setUpImg={setUpImg}
                                            imgRef={imgRef}
                                            retakePhoto={retakePhoto}
                                            next={next}
                                            previous={previous}
                                            updateFile={updateFile}
                                            rotated={rotated}
                                            setRotated={setRotated}
                                            mobile={mobile}
                                            s_file_type={s_file_type}
                                        />
                                    </Step>
    
                                    <Step id={'4'} name={'Save Photo'}>
                                        <Row className={"text-center"}>
                                            <Col md={12}>
                                                <img src={file.base64} style={{ maxWidth: 1000, height: 'auto' }} alt={'user'} />
                                            </Col>
                                            <Col md={12} className={'mt-2'}>
                                                {
                                                    modelId.length > 0 && 
                                                    <Button 
                                                        className={'d-inline mx-2 mb-3'} 
                                                        onClick={() => handleAddFile(false, true)}
                                                        color={'primary'}
                                                    >
                                                        Analyze File
                                                    </Button>
                                                }
                                                <ActionIcon 
                                                    type='delete'
                                                    onClick={() => previous()}
                                                    className={'mx-2'}
                                                />
                                                {
                                                    s_file_type === 'PICK UP ORDER' && 
                                                    <PickUpOrderCheck 
                                                        pickUpOrderCheck={pickUpOrderCheck}
                                                        setPickUpOrderCheck={setPickUpOrderCheck}
                                                        company={selectedAwb.s_trucking_company}
                                                        consignee={consignee}
                                                    />
                                                }
                                                <ActionIcon 
                                                    type={'save'}
                                                    onClick={() => handleAddFile(false, false)}
                                                    className={'mx-2'}
                                                />
                                                <ActionIcon 
                                                    type={'print'}
                                                    onClick={() => print(<PrintImage base64={file.base64} />)}
                                                    className={'mx-2'}
                                                />
                                            </Col>
                                        </Row>
                                    </Step>

                                    <Step id={'5'} name={'Finalize'}>
                                        <IdentificationForm 
                                            formFields={formFields}
                                            setFormFields={setFormFields}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            validIdentification={validIdentification}
                                            tempFile={tempFile}
                                            setModal={setModal}   
                                            saveIdentificationInformation={saveIdentificationInformation}
                                            handleAddFile={handleAddFile}
                                            selectedAwb={selectedAwb}
                                            s_file_type={s_file_type}
                                            reviewIdentification={reviewIdentification}
                                        />
                                    </Step>
                                </Steps> : 
                                <Steps>
                                    <Step id={'1'} name={'Select File Type'}>
                                        <SelectFileType 
                                            fileTypes={fileTypes}
                                            next={next}
                                            push={push}
                                            s_file_type={s_file_type}
                                            set_s_file_type={set_s_file_type}
                                            modelId={modelId}
                                            setModelId={setModelId}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            setModal={setModal}
                                            devices={devices}
                                            type={type}
                                        />
                                    </Step>
    
                                    <Step id={'2'} name={'Upload File'}>
                                        {
                                            s_file_type === 'PICK UP ORDER' && 
                                            <PickUpOrderCheck 
                                                pickUpOrderCheck={pickUpOrderCheck}
                                                setPickUpOrderCheck={setPickUpOrderCheck}
                                                company={selectedAwb.s_trucking_company}
                                                consignee={consignee}
                                            />
                                        }
                                        <Row>
                                            <Col md={12} className='text-center'>
                                                <FileBase64 
                                                    onDone={setFile}
                                                    key={fileKey}
                                                />
                                                {
                                                    modelId.length > 0 && 
                                                    <Button
                                                        className={'d-inline'} 
                                                        disabled={!file.base64}
                                                        onClick={() => handleAddFile(false, true)}
                                                        color={'primary'}
                                                    >
                                                        Analyze File
                                                    </Button>
                                                }
                                                <Button
                                                    className={'d-inline ml-2'} 
                                                    color={'secondary'}
                                                    disabled={!file.base64 || !renderSaveButton}
                                                    onClick={() => handleAddFile(false, false)}
                                                >
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Step>

                                    <Step id={'3'} name={'Finalize'}>
                                        <IdentificationForm 
                                            formFields={formFields}
                                            setFormFields={setFormFields}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            validIdentification={validIdentification}
                                            tempFile={tempFile}
                                            setModal={setModal} 
                                            saveIdentificationInformation={saveIdentificationInformation}
                                            handleAddFile={handleAddFile}
                                            selectedAwb={selectedAwb}
                                            reviewIdentification={reviewIdentification}
                                        />
                                    </Step>
                                </Steps>
                        }
                        
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>                                
            </div>
        </Modal>
    );
}

export default function WizardWrapper ({
    type,
    modal,
    setModal,
    reviewIdentification,
    selectedFile
}) {

    return (
        <Wizard render={({ previous, next, push }) => (
            <Main
                previous={previous}
                next={next}
                push={push} 
                type={type}
                modal={modal}
                setModal={setModal}
                reviewIdentification={reviewIdentification}
                selectedFile={selectedFile}
            />
        )}></Wizard>
    );
}