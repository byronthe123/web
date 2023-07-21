import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'reactstrap';
import Webcam from "react-webcam";
import axios from 'axios';
import { Row, Col } from 'reactstrap';

import ModalSavePhoto from './ModalSavePhoto';

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
    const [modalSavePhoto, setModalSavePhoto] = useState(false);

    const capture = React.useCallback(
        () => {
          const imageSrc = webcamRef.current.getScreenshot();

          var img = document.createElement('img');
          img.setAttribute('src', imageSrc);
          
          imgRef.current = img;
          setUpImg(imageSrc);
          console.log(imageSrc);
          setModalSavePhoto(true);
        },
        [webcamRef]
    );

    const saveBlobFile = asyncHandler(async(base64) => {
        const res = await axios.post(`${baseApiUrl}/saveBlobFile`, {
            data: {
                file: {
                    type: 'image/png',
                    base64
                }
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        setModalSavePhoto(false);
    });

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
  

    return (
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
                    videoConstraints={{ deviceId, width: 2592, height: 1944 }}
                    width={1280}
                    height={720}
                />
            </Col>
            <Col md={12} className='text-center'>
                <Button onClick={capture} className='text-center'>Capture photo</Button>
            </Col>
            <ModalSavePhoto 
                modal={modalSavePhoto}
                setModal={setModalSavePhoto}
                upImg={upImg}
                setUpImg={setUpImg}
                imgRef={imgRef}
                saveBlobFile={saveBlobFile}
            />
        </Row>
    );   
}