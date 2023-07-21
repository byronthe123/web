import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Label, Form, FormGroup, Input, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// Increase pixel density for crop preview quality on retina screens.
const pixelRatio = window.devicePixelRatio || 1;

function getResizedCanvas(canvas, newWidth, newHeight) {
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = newWidth;
    tmpCanvas.height = newHeight;

    const ctx = tmpCanvas.getContext("2d");
    ctx.drawImage(
        canvas,
        0,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        newWidth,
        newHeight
    );

    return tmpCanvas;
}
  
function generateDownload(previewCanvas, crop) {
    if (!crop || !previewCanvas) {
      return;
    }
  
    const canvas = getResizedCanvas(previewCanvas, crop.width, crop.height);
  
    canvas.toBlob(
      (blob) => {
        const previewUrl = window.URL.createObjectURL(blob);
  
        const anchor = document.createElement("a");
        anchor.download = "cropPreview.png";
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
  
        window.URL.revokeObjectURL(previewUrl);
      },
      "image/png",
      1
    );
}

export default ({
    upImg,
    setUpImg,
    imgRef,
    setFile,
    retakePhoto,
    next,
    previous,
    updateFile
}) => {

    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: "%", width: 0, height: 0 });
    const [completedCrop, setCompletedCrop] = useState(null);

    const rotate = () => {
        var img = new Image();
        img.src = upImg;

        var canvas = document.createElement("canvas");

        const maxDim = Math.max(img.height, img.width);
        if ([90, 270].indexOf(90) > -1) {
            canvas.width = img.height;
            canvas.height = img.width;
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }
        var ctx = canvas.getContext("2d");

        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(90*Math.PI/180);
        ctx.drawImage(img,-img.width/2,-img.height/2);

        const imgData = canvas.toDataURL("image/jpeg");
        setUpImg(imgData);

        var img = document.createElement('img');
        img.setAttribute('src', imgData);
        imgRef.current = img;

        // img.onload = () => {

        // };
    }

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext("2d");

        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
        );
    }, [completedCrop]);

    const handleGetCroppedImage = () => {
        const base64 = getCroppedImg(imgRef.current, completedCrop);
        updateFile('base64', base64);
        next();
    }

    function getCroppedImg(image, crop) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
    
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );
    
        // As Base64 string
        const base64Image = canvas.toDataURL('image/jpeg');
        return base64Image;
    }

    const enableCrop = () => crop.height > 0 && crop.width > 0;

    const handleChangeCrop = (c) => {
        setCrop(c);
        setCompletedCrop(c);
    }

    return (
        <Row>
            <Col md={12} className={'text-center'}>
                <Row>
                    <Col md={12}>
                        <ReactCrop
                            src={upImg}
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                        />
                        {/* <div>
                            <canvas
                                ref={previewCanvasRef}
                                // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                style={{
                                    width: Math.round(completedCrop?.width ?? 0),
                                    height: Math.round(completedCrop?.height ?? 0)
                                }}
                            />
                        </div> */}
                    </Col>
                </Row>
                <Button 
                    className={'mr-2'} 
                    color={'info'} 
                    onClick={() => setCrop({ unit: "%", width: 0, height: 0})}
                >
                    Select None
                </Button>
                <Button className={'mr-2'} color={'info'} onClick={() => rotate()}>Rotate</Button>
                <Button color='warning mr-2' onClick={() => retakePhoto(previous)}>Retake Photo</Button>
                <Button disabled={!enableCrop()} onClick={() => handleGetCroppedImage()}>Crop</Button>
            </Col>
        </Row>
    );
}

