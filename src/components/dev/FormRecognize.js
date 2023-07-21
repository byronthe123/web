import React, { useState, useEffect, useRef } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import Webcam from "react-webcam";
import axios from 'axios';
import { Row, Col, Table } from 'reactstrap';
import CropPhoto from './CropPhoto';
import { Wizard, Steps, Step } from 'react-albus';
import TopNavigation from '../../components/wizard-hooks/TopNavigation';
import ModalLoading from '../custom/ModalLoading';

export default ({
    baseApiUrl,
    headerAuthCode,
    asyncHandler,
    updateLocalValue,
    user
}) => {

    // Crop:
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);

    //webcam:
    const webcamRef = React.useRef(null);

    const [file, setFile] = useState({
        type: 'image/png'
    });

    const modelIds = [{
        name: 'NY STATE ID',
        value: 'e06616a0-3399-4442-a8d4-e168b8728479'
    }, {
        name: 'AWB',
        value: 'ad6537f1-be5b-4f3f-b175-b32122a039fc'
    }]

    const [modelId, setModelId] = useState('');

    const capture = React.useCallback(
        (next) => {
          const imageSrc = webcamRef.current.getScreenshot();

          var img = document.createElement('img');
          img.setAttribute('src', imageSrc);
          
          imgRef.current = img;
          setUpImg(imageSrc);
          console.log(imageSrc);
          next();
        },
        [webcamRef]
    );

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
  
    React.useEffect(
      () => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
      },
      [handleDevices]
    );
  
    const retakePhoto = (previous) => {
        previous();
    }

    const updateFile = (prop, value) => {
        const copy = Object.assign({}, file);
        copy[prop] = value;
        setFile(copy);
    }

    const resolveEnableNext = () => true;

    const topNavClick = (stepItem, push) => {
        console.log(resolveEnableNext(stepItem))
        if (resolveEnableNext(stepItem)) {
            push(stepItem.id);
        }
    };

    const handleSelectModelId = (id, next) => {
        setModelId(id);
        next();
    }

    const [forms, setForms] = useState({});
    const [fields, setFields] = useState({});
    const [modalLoading, setModalLoading] = useState(false);
    const [fileLink, setFileLink] = useState('');

    const saveAndRecognizeForm = asyncHandler(async(push, fileLink=null) => {
        setModalLoading(true);
        const res = await axios.post(`${baseApiUrl}/saveAndRecognizeForm`, {
            data: {
                file,
                fileLink,
                modelId
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        push('5');
        console.log(res.data);
        setForms(res.data[0]);
        setFields(res.data[0].fields);
        setFileLink(res.data[0].fileLink);
        console.log(res.data[0].fields);
        setModalLoading(false);

    });

    const images = [
        'https://ewrstorage1.blob.core.windows.net/blob1/41651274495%20-%2048edf567-350d-49b7-9349-25904364f455.png',
        'https://ewrstorage1.blob.core.windows.net/blob1/41651273375%20-%20970280bf-9d84-4d11-b86e-6dc7b60dc43e.png'
    ];

    return (
        <Row>
            <Col md={12} className='text-center'>

                <Wizard>
                    <div className="wizard wizard-default">
                        <TopNavigation
                            className="justify-content-center mb-4"
                            disableNav={false}
                            topNavClick={topNavClick}
                        />

                        <Steps>  
                  
                            <Step id={'1'} name={'Select File Type'} render={({  next }) => (
                                <ButtonGroup>
                                    {
                                        modelIds.map((id, i) => (
                                            <Button 
                                                onClick={() => handleSelectModelId(id.value, next)}
                                                active={modelId === id.value}
                                                key={i}
                                            >
                                                {id.name}
                                            </Button>
                                        ))
                                    }
                                </ButtonGroup>
                            )}></Step>
            
                            <Step id={'2'} name={'Take Photo'} render={({ next, push }) => (
                                <Row>
                                    <Col md={6}>
                                        <Col md={12}>
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
                                        <Col md={12}>
                                            <Webcam
                                                audio={false}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                videoConstraints={{ deviceId, width: 2592, height: 1944 }}
                                                width={1280}
                                                height={720}
                                            />
                                        </Col>
                                        <Col md={12}>
                                            <Button onClick={() => capture(next)} className='text-center'>Capture photo</Button>
                                        </Col>
                                    </Col>
                                    {
                                        modelId === 'e06616a0-3399-4442-a8d4-e168b8728479' && 
                                        <Col md={6} className={'text-right'}>
                                            {
                                                images.map((image, i) => (
                                                    <img 
                                                        src={image} 
                                                        key={i} 
                                                        className={'hover-border'} 
                                                        style={{ width: '494px', height: 'auto', marginBottom: '5px' }} 
                                                        onClick={() => saveAndRecognizeForm(push, image)}
                                                    />
                                                ))
                                            }
                                        </Col>
                                    }
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
                                        <Button className={'d-inline'} onClick={() => saveAndRecognizeForm(next)}>Analyze</Button>
                                    </Col>
                                </Row>
                            )} />

                            <Step id={'5'} name={'Results'} render={({ }) => (
                                <Row>
                                    <Col md={6}>
                                        <img src={fileLink} style={{ width: '600px', height: 'auto'}} />
                                    </Col>
                                    <Col md={6}>
                                        <Table striped>
                                            <thead></thead>
                                            <tbody>
                                                {
                                                    Object.keys(fields).map((key, i) => (
                                                        <tr key={i}>
                                                            <th>{fields[key].name}</th>
                                                            <td>{fields[key].value}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            )} />
            
                        </Steps>

                    </div>
                </Wizard>

            </Col>

            <ModalLoading 
                modal={modalLoading}
                setModal={setModalLoading}
            />
        </Row>
    );   
}