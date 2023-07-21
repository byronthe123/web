import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonGroup, Label, Input } from 'reactstrap';
import Webcam from "react-webcam";
import CropPhoto from './CropPhoto';
import classnames from 'classnames';
import { Wizard, Steps, Step } from 'react-albus';
import TopNavigation from '../../wizard-hooks/TopNavigation';
import SelectFileType from './SelectFileType';

export default ({
    modal,
    setModal,
    fileTypes,
    addToFiles,
    file,
    setFile,
    updateFile,
    values,
    setFieldValue,
    selectedAwb,
    checkIdentification,
    saveIdentificationInformation
}) => {

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

    const [photo_base64, set_photo_base64] = useState('');
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
        set_photo_base64('');
        previous();
    }

    // Select Camera:

    const [deviceId, setDeviceId] = React.useState({});
    const [devices, setDevices] = React.useState([]);
    
    const handleDevices = React.useCallback(
        mediaDevices =>
        setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
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
        set_photo_base64('');
        setFile({});
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

    const handleSelectFileType = (fileType) => {
        setAddOtherType(false);
        updateFile('fileType', fileType);
    }

    const handleAddFile = () => {
        addToFiles(file);
        setModal(false);
        setFile({});
    }

    const enableSelectFileNext = () => {
        if (file.fileType === 'IDENTIFICATION') {
            return checkIdentification();
        } 
        return file.fileType && file.fileType.length > 0;
    }

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} style={{ maxWidth: '1300px', width: '100%' }}>
                <ModalHeader>Scan File</ModalHeader>
                <ModalBody>
                    
                    <div className="wizard wizard-default">
                        <Wizard>
                            <TopNavigation
                                className="justify-content-center mb-4"
                                disableNav={false}
                                topNavClick={topNavClick}
                            />

                            <Steps>

                                <Step id={'1'} name={'Select File Type'} render={({ next }) => (
                                    <SelectFileType 
                                        file={file}
                                        updateFile={updateFile}
                                        fileTypes={fileTypes}
                                        next={next}
                                        uploadFile={false}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        selectedAwb={selectedAwb}
                                        checkIdentification={checkIdentification}
                                        saveIdentificationInformation={saveIdentificationInformation}
                                    />
                                )}></Step>

                                <Step id={'2'} name={'Take Photo'} render={({ next }) => (
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
                                                width={1280}
                                                height={720}
                                            />
                                        </Col>
                                        <Col md={12} className='text-center'>
                                            <Button onClick={() => capture(next)} className='text-center'>Capture photo</Button>
                                        </Col>
                                        <Col md={12} className='text-center'>
                                            <h4 className='fas fa-times mt-1' style={{ color: 'red' }}>Photo Not Saved</h4>
                                        </Col>
                                    </Row>
                                )}>
                                </Step>

                                <Step id={'3'} name={'Crop Photo'} render={({ next, previous }) => (
                                    <CropPhoto 
                                        upImg={upImg}
                                        setUpImg={setUpImg}
                                        imgRef={imgRef}
                                        retakePhoto={retakePhoto}
                                        next={next}
                                        previous={previous}
                                        updateFile={updateFile}
                                    />
                                )}></Step>

                                <Step id={'4'} name={'Save Photo'} render={({ next, previous }) => (
                                    <Row className={"text-center"}>
                                        <Col md={12}>
                                            <img src={file.base64} style={{ maxWidth: 1000, height: 'auto' }} />
                                        </Col>
                                        <Col md={12} className={'mt-2'}>
                                            <Button className={'d-inline mr-2'} onClick={() => previous()} color={'info'}>Crop Again</Button>
                                            <Button className={'d-inline'} onClick={() => handleAddFile()}>Save</Button>
                                        </Col>
                                    </Row>
                                )} />
                            </Steps>
                        </Wizard>
                    </div>
                    
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}