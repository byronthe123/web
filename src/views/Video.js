import React, { Component, Fragment, useState, useEffect, useRef, useCallback } from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";

import { Player } from 'video-react';
import 'video-react/dist/video-react.css';
import ReactPlayer from 'react-player';

import Webcam from "react-webcam";

import {Button, Row, Col, Table, Card, CardBody, CardTitle, CardText} from 'reactstrap';

import AppLayout from '../components/AppLayout';
import ModalConfirmLocation from '../components/ModalConfirmLocation';
import PageVisibility from 'react-page-visibility';
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

const Video = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, eightyWindow, width
}) => {

    const [currentPlayTime, setCurrentPlayTime] = useState(0);
    const [watchedSeconds, setWatchedSeconds] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef();

    //react-image-crop
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);

    useEffect(() => {
        console.log(imgRef.current);
    }, [imgRef.current]);

    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16 / 9 });
    const [completedCrop, setCompletedCrop] = useState(null);

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        console.log(image);
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
        getCroppedImg(imgRef.current, completedCrop, 'test.png');
    }

    function getCroppedImg(image, crop, fileName) {
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
        console.log(base64Image);
    
        // As a blob
        // return new Promise((resolve, reject) => {
        //   canvas.toBlob(blob => {
        //     blob.name = fileName;
        //     resolve(blob);
        //   }, 'image/jpeg', 1);
        // });
    }

    //webcam:
    const webcamRef = React.useRef(null);

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
      };

    const capture = React.useCallback(
        () => {
          const imageSrc = webcamRef.current.getScreenshot();

          var img = document.createElement('img');
          img.setAttribute('src', imageSrc);
          
          imgRef.current = img;
          setUpImg(imageSrc);
          console.log(imageSrc);
        },
        [webcamRef]
    );

    const callback = () => {
        alert('working');
    }



    const handleSeek = (seconds) => {
        console.log(`Seconds: ${seconds}`);
        console.log(`Current Time: ${currentPlayTime}`);
        if (seconds > currentPlayTime) {
            playerRef.current.seekTo(currentPlayTime);
        }
    }

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setWatchedSeconds(prevSeconds => prevSeconds + 1);
            }, 1000)

            return () => {
                clearInterval(interval);
            }
        }
        console.log(watchedSeconds);
    }, [isPlaying]);

    // useEffect(() => {
    //     // const checkArray = ['hidden', 'msHidden', 'webkitHidden'];
    //     // for (let i = 0; i < checkArray.length; i++) {
    //     //     if (document[checkArray[i]]) {
    //     //         alert('hidden');
    //     //     }
    //     // }
    //     if (document.hidden) {
    //         console.log('HIDDEN');
    //     }
    // }, [document.hidden]);

    const handleVisibilityChange = (isVisible) => {
        if (!isVisible) {
            console.log(playerRef.current);
            console.log(playerRef.current.playing);
            setIsPlaying(false);
        }
    }

    const [questionsData, setQuestionsData] = useState([]);
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [enableSubmit, setEnableSubmit] = useState(false);
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const selectTrainingQuestions = () => {
        const data = {
            i_quiz_id: 1
        }
        axios.post(`${baseApiUrl}/selectTrainingQuestions`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setQuestionsData(response.data);
        }).catch(error => {
            alert(error);
        });
    }

    useEffect(() => {
        selectTrainingQuestions();
    }, []);

    const shuffleArray = (array) => {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    const randomizer = (question) => {
        console.log('fining');
      const array = [];
      const mapKeys = ['s_answer', 's_option_1', 's_option_2', 's_option_3'];

      for (let key in question) {
        if (mapKeys.indexOf(key) !== -1) {
          if (question[key] && question[key].length > 0) {
            array.push({
              id: key,
              option: question[key]
            });
          }
        }
      }

      const randomized = shuffleArray(array);
      return randomized;
    }

    const questionsGenerator = () => {

        const shuffledQuestions = shuffleArray(questionsData);
        const finalArray = [];

        for (let i = 0; i < shuffledQuestions.length; i++) {
            const questionObject = {
                id: shuffledQuestions[i].id,
                s_question: shuffledQuestions[i].s_question,
                options: randomizer(shuffledQuestions[i]),
                selection: null,
                selectionType: null,
                correct: null
            }
            finalArray.push(questionObject);
        }

        return finalArray;
    }

    useEffect(() => {
        if (questionsData.length > 0) {
            setGeneratedQuestions(questionsGenerator());
        }
    }, [questionsData]);

    const markSelection = (e) => {
        const questionId = e.target.name;
        const setSelection = e.target.value;
        const setSelectionType = e.target.id;

        console.log(`questionId: ${questionId}`);
        console.log(`setSelection: ${setSelection}`);

        const generatedQuestionsCopy = Object.assign([], generatedQuestions);

        for (let i = 0; i < generatedQuestionsCopy.length; i++) {
            if (parseInt(generatedQuestionsCopy[i].id) === parseInt(questionId)) {
                console.log(`working`);
                generatedQuestionsCopy[i].selection = setSelection;
                generatedQuestionsCopy[i].selectionType = setSelectionType;
            }
        }

        setGeneratedQuestions(generatedQuestionsCopy);

    }

    useEffect(() => {
        let valid = true;
        for (let i = 0; i < generatedQuestions.length; i++) {
            if (generatedQuestions[i].selection === null) {
                valid = false;
                // return false;
            }
        }
        console.log(valid);
        setEnableSubmit(valid);
    }, [generatedQuestions]);

    const handleSubmit = () => {

        let correct = 0;

        const generatedQuestionsCopy = Object.assign([], generatedQuestions);
        for (let i = 0; i < generatedQuestionsCopy.length; i++) {
            if (generatedQuestionsCopy[i].selectionType === 's_answer') {
                generatedQuestionsCopy[i].correct = true;
                correct++;
            } else {
                generatedQuestionsCopy[i].correct = false;
            }
        }

        setGeneratedQuestions(generatedQuestionsCopy);
        setScore(correct);
        setTotal(generatedQuestions.length);
        setSubmitted(true);
    }

    useEffect(() => {

    }, [generatedQuestions]);


    return (
        <PageVisibility onChange={handleVisibilityChange}>
            <AppLayout>
                <div className={`card queue-card-container`} style={{backgroundColor: 'white', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                    <div className="card-body mb-5 px-1 py-1">
                        <script>

                        </script>
                        <Row className='px-3 py-3'>
                            {/* <Player>
                                <source onEnded={() => callback()} onEnded src="https://ewrstorage1.blob.core.windows.net/blob1/When I come home for lunch....I get this bouncy bird.mp4" />
                            </Player> */}
                            {/* <iframe width="1280" height="720" src="https://web.microsoftstream.com/embed/video/a2f06647-38eb-4062-93f8-7040aa18f625?autoplay=false&amp;showinfo=false"></iframe>  */}
                            <ReactPlayer
                                controls
                                ref={playerRef}
                                onStart={() => setIsPlaying(true)}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                playing={isPlaying}
                                onProgress={(progress) => setCurrentPlayTime(progress.playedSeconds)}
                                onSeek={(seconds) => handleSeek(seconds)} onEnded={() => callback()}
                                url='https://ewrstorage1.blob.core.windows.net/blob1/When I come home for lunch....I get this bouncy bird.mp4'
                            />
                        </Row>
                        <iframe src="https://choiceaviationsvc-my.sharepoint.com/personal/byron_choice_aero/_layouts/15/Doc.aspx?sourcedoc={660d5458-faf4-4bcf-8747-0b0b344e610d}&amp;action=embedview&amp;wdAr=1.7777777777777777" width="100%" height="600px" frameborder="0">This is an embedded <a target="_blank" href="https://office.com">Microsoft Office</a> presentation, powered by <a target="_blank" href="https://office.com/webapps">Office</a>.</iframe>

                        {
                            submitted &&
                            <h1>Results: {score} / {total}</h1>
                        }
                        <div>
                            {
                                generatedQuestions.map((q, i) =>
                                    <div key={i}>
                                        <h6>{i+1}. {q.s_question} {q.correct && q.correct ? <i className="far fa-check-square text-success" style={{fontSize: '16px'}}></i> : q.correct === false ? <i className="fas fa-times text-danger" style={{fontSize: '16px'}}></i> : ''}</h6>
                                        <ol type='a'>
                                            {
                                                q.options.map((o, _i) =>
                                                    <div key={_i}>
                                                        <input name={q.id} id={o.id} value={o.option} className='mr-2' type='radio' onClick={(e) => markSelection(e)}></input>
                                                        <label>{o.option}</label>
                                                    </div>

                                                )
                                            }
                                        </ol>
                                    </div>

                                )
                            }
                        </div>
                        <button disabled={!enableSubmit} onClick={() => handleSubmit()}>Submit</button>

                        {/* Webcam */}

                        <Webcam
                            audio={false}
                            height={720}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={1280}
                            videoConstraints={videoConstraints}
                        />
                        <button onClick={capture}>Capture photo</button>

                        <ReactCrop
                            src={upImg}
                            // onImageLoaded={onLoad}
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                        />
                        <div>
                            <canvas
                            ref={previewCanvasRef}
                            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                            style={{
                                width: Math.round(completedCrop?.width ?? 0),
                                height: Math.round(completedCrop?.height ?? 0)
                            }}
                            />
                        </div>
                        <p>
                            Note that the download below won't work in this sandbox due to the
                            iframe missing 'allow-downloads'. It's just for your reference.
                        </p>
                        <button
                            type="button"
                            disabled={!completedCrop?.width || !completedCrop?.height}
                            onClick={() =>
                            generateDownload(previewCanvasRef.current, completedCrop)
                            }
                        >
                            Download cropped image
                        </button>
                        <button onClick={() => handleGetCroppedImage()}>Log</button>

                    </div>
                </div>

                <ModalConfirmLocation
                    open={promptUserLocation}
                    setUserLocation={setUserLocation}
                    selectUserLocation={selectUserLocation}
                    saveUserLocation={saveUserLocation}
                    onChangeMethod={null}
                />

            </AppLayout>
        </PageVisibility>
    );
}

export default withRouter(Video);