import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonGroup, Label, FormGroup } from 'reactstrap';
import { Field } from 'formik';
import Webcam from "react-webcam";
import CropPhoto from '../CropPhoto';
import { Wizard, Steps, Step } from 'react-albus';
import TopNavigation from '../../wizard-hooks/TopNavigation';
import SelectFileType from './SelectFileType';
import FileBase64 from 'react-file-base64';
import IdentificationForm from './IdentificationForm';
import AwbForm from './AwbForm';
import { v4 as uuidv4 } from 'uuid';

const Main = ({
    previous,
    next,
    push,
    type,
    modal,
    setModal,
    fileTypes,
    addToFiles,
    file,
    setFile,
    modelId,
    setModelId,
    saveAndRecognizeForm,
    formFields,
    setFormFields,
    updateFile,
    selectedFile,
    setSelectedFile,
    values,
    setFieldValue,
    selectedAwb,
    checkIdentification,
    saveIdentificationInformation,
    checkAwbData,
    reviewIdentification,
    mobile,
    airportCodes,
    airportCodesMap,
    setBookingConfirmed,
    shcs,
    shcsDgMap
}) => {

    console.log(selectedFile);

    useEffect(() => {
        if (reviewIdentification) {
            if (type === 'WEBCAM') {
                push('5');
            } else {
                push('3');
            }
        } else {
            push('1'); 
        }
    }, [reviewIdentification, modal]);

    // ------ Upload Files ------

    const [fileKey, setFileKey] = useState(0);
    const [fileType, setFileType] = useState('');

    // ------ Webcam ------

    //Other Button:
    const [addOtherType, setAddOtherType] = useState(false);

    useEffect(() => {
        if (addOtherType) {
            updateFile('fileType', '');
        }
    }, [addOtherType]);

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
        console.log(devices);
    }, [devices]);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
    },[handleDevices]);

    const toggle = () => setModal(!modal);

    useEffect(() => {
        setFileKey(fileKey + 1);
        setFile({});
        setFileType('');
        setModelId('');
    }, [modal]);

    const topNavClick = (stepItem, push, step) => {
        if (step.id === '1') {
            if (!enableSelectFileNext()) {
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

    const [recognizingFile, setRecognizingFile] = useState(false);

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
            file.fileType = fileType;
            file.modalType = 'UPLOAD';
        } else {
            const fileSize = resolveFileSize(file);
            file.size = fileSize;
            file.displaySize = fileSizeFormatter(fileSize);   
            file.type = 'image/png'; 
            file.modalType = 'WEBCAM';
        }

        file.s_file_type = file.fileType;
    }

    const handleAddFile = async (recognize) => {

        const recognizeFiles = {
            'IDENTIFICATION1': true,
            'IDENTIFICATION2': true,
            'AWB': true
        }

        prepFile(file,  type === 'UPLOAD');

        const enableRecognize = (recognizeFiles[fileType] !== undefined) || (recognizeFiles[file.fileType] !== undefined);
        if (enableRecognize) {
            next();
            if (modelId && modelId.length > 0 && recognize) {
                setRecognizingFile(true);
                await saveAndRecognizeForm(fileType);
                setRecognizingFile(false);    
            }
        } else {
            addToFiles(file);
            setModal(false);
        }

        setSelectedFile(file);
        setFile({});
    }

    const enableSelectFileNext = () => {
        if (type === 'WEBCAM') {
            if (file.fileType === 'IDENTIFICATION' || fileType === 'IDENTIFICATION') {
                return checkIdentification();
            } 
            return file.fileType && file.fileType.length > 0;
        }
    }

    const [rotated, setRotated] = useState(false);

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
                                            file={file}
                                            updateFile={updateFile}
                                            fileTypes={fileTypes}
                                            modelId={modelId}
                                            setModelId={setModelId}
                                            next={next}
                                            push={push}
                                            uploadFile={false}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            selectedAwb={selectedAwb}
                                            checkIdentification={checkIdentification}
                                            saveIdentificationInformation={saveIdentificationInformation}
                                            fileType={fileType}
                                            setFileType={setFileType}
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
                                            fileType={fileType}
                                        />
                                    </Step>
    
                                    <Step id={'4'} name={'Save Photo'}>
                                        <Row className={"text-center"}>
                                            <Col md={12}>
                                                <img src={file.base64} style={{ maxWidth: 1000, height: 'auto' }} />
                                            </Col>
                                            <Col md={12} className={'mt-2'}>
                                                <Button className={'d-inline mr-2'} onClick={() => previous()} color={'info'}>Crop Again</Button>
                                                {
                                                    modelId.length > 0 && 
                                                    <Button 
                                                        className={'d-inline mr-2'} 
                                                        onClick={() => handleAddFile(true)}
                                                        color={'primary'}
                                                    >
                                                        Analyze File
                                                    </Button>
                                                }
                                                <Button 
                                                    className={'d-inline'} 
                                                    onClick={() => handleAddFile(false)}
                                                    color={'secondary'}
                                                >
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Step>

                                    <Step id={'5'} name={'Finalize'}>
                                    {
                                        ['IDENTIFICATION1', 'IDENTIFICATION2'].includes((selectedFile && selectedFile.fileType) || fileType) ?
                                            <IdentificationForm 
                                                recognizingFile={recognizingFile}
                                                formFields={formFields}
                                                setFormFields={setFormFields}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                checkIdentification={checkIdentification}
                                                selectedFile={selectedFile}
                                                fileType={fileType}
                                                setModal={setModal}   
                                                saveIdentificationInformation={saveIdentificationInformation} 
                                                addToFiles={addToFiles}
                                                selectedAwb={selectedAwb}
                                            /> : 
                                        selectedFile && selectedFile.fileType === 'AWB' || fileType === 'AWB' ? 
                                            <AwbForm 
                                                selectedAwb={selectedAwb}
                                                recognizingFile={recognizingFile}
                                                formFields={formFields}
                                                setFormFields={setFormFields}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                checkIdentification={checkIdentification}
                                                selectedFile={selectedFile}
                                                fileType={fileType}
                                                setModal={setModal}   
                                                checkAwbData={checkAwbData}   
                                                addToFiles={addToFiles}
                                                airportCodes={airportCodes}
                                                airportCodesMap={airportCodesMap}
                                                setBookingConfirmed={setBookingConfirmed}
                                                shcs={shcs}
                                                shcsDgMap={shcsDgMap}
                                            /> : `${fileType}`
                                    }
                                    </Step>
                                </Steps> : 
                                <Steps>
                                    <Step id={'1'} name={'Select File Type'}>
                                        <SelectFileType 
                                            file={file}
                                            updateFile={updateFile}
                                            fileTypes={fileTypes}
                                            modelId={modelId}
                                            setModelId={setModelId}
                                            next={next}
                                            push={push}
                                            uploadFile={false}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            selectedAwb={selectedAwb}
                                            checkIdentification={checkIdentification}
                                            saveIdentificationInformation={saveIdentificationInformation}
                                            fileType={fileType}
                                            setFileType={setFileType}
                                            setModal={setModal}
                                            devices={devices}
                                            type={type}
                                        />
                                    </Step>
    
                                    <Step id={'2'} name={'Upload File'}>
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
                                                        onClick={() => handleAddFile(true)}
                                                        color={'primary'}
                                                    >
                                                        Analyze File
                                                    </Button>
                                                }
                                                <Button
                                                    className={'d-inline ml-2'} 
                                                    color={'secondary'}
                                                    disabled={!file.base64}
                                                    onClick={() => handleAddFile(false)}
                                                >
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Step>

                                    <Step id={'3'} name={'Finalize'}>
                                    {
                                        ['IDENTIFICATION1', 'IDENTIFICATION2'].includes((selectedFile && selectedFile.fileType) || fileType) ?
                                            <IdentificationForm 
                                                recognizingFile={recognizingFile}
                                                formFields={formFields}
                                                setFormFields={setFormFields}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                checkIdentification={checkIdentification}
                                                selectedFile={selectedFile}
                                                fileType={fileType}
                                                setModal={setModal}   
                                                saveIdentificationInformation={saveIdentificationInformation}  
                                                addToFiles={addToFiles}
                                                selectedAwb={selectedAwb}
                                            /> : 
                                        selectedFile && selectedFile.fileType === 'AWB' || fileType === 'AWB' ? 
                                            <AwbForm 
                                                selectedAwb={selectedAwb}
                                                recognizingFile={recognizingFile}
                                                formFields={formFields}
                                                setFormFields={setFormFields}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                checkIdentification={checkIdentification}
                                                selectedFile={selectedFile}
                                                fileType={fileType}
                                                setModal={setModal}   
                                                checkAwbData={checkAwbData}
                                                addToFiles={addToFiles}
                                                airportCodes={airportCodes}
                                                airportCodesMap={airportCodesMap}
                                                setBookingConfirmed={setBookingConfirmed}
                                                shcs={shcs}
                                                shcsDgMap={shcsDgMap}
                                            /> : `${fileType}`
                                        }
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

export default function ModalFiles ({
    type,
    modal,
    setModal,
    fileTypes,
    addToFiles,
    file,
    setFile,
    modelId,
    setModelId,
    saveAndRecognizeForm,
    formFields,
    setFormFields,
    updateFile,
    selectedFile,
    setSelectedFile,
    values,
    setFieldValue,
    selectedAwb,
    checkIdentification,
    saveIdentificationInformation,
    checkAwbData,
    reviewIdentification,
    mobile,
    airportCodes,
    airportCodesMap,
    setBookingConfirmed,
    shcs,
    shcsDgMap
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
                fileTypes={fileTypes}
                addToFiles={addToFiles}
                file={file}
                setFile={setFile}
                modelId={modelId}
                setModelId={setModelId}
                saveAndRecognizeForm={saveAndRecognizeForm}
                formFields={formFields}
                setFormFields={setFormFields}
                updateFile={updateFile}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                values={values}
                setFieldValue={setFieldValue}
                selectedAwb={selectedAwb}
                checkIdentification={checkIdentification}
                saveIdentificationInformation={saveIdentificationInformation}
                checkAwbData={checkAwbData}
                reviewIdentification={reviewIdentification}
                mobile={mobile}
                airportCodes={airportCodes}
                airportCodesMap={airportCodesMap}
                setBookingConfirmed={setBookingConfirmed}
                shcs={shcs}
                shcsDgMap={shcsDgMap}
            />
        )}></Wizard>
    );
}