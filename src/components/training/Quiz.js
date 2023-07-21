import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";

import { Player } from 'video-react';
import 'video-react/dist/video-react.css';
import ReactPlayer from 'react-player';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

import {Button, Row, Col, Table, Card, CardBody, CardTitle, CardText, Input} from 'reactstrap';
import ReactDOMServer from 'react-dom/server';

const Quiz = ({
    user, 
    i_quiz_id, 
    baseApiUrl, 
    headerAuthCode, 
    i_training_id, 
    selectedContent, 
    createTrainingRecord,
    modalRef,
    assignorName
}) => {

    const [questionsData, setQuestionsData] = useState([]);
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [enableSubmit, setEnableSubmit] = useState(false);
    const [i_score, set_i_score] = useState(0);
    const [i_total, set_i_total] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [s_instructor, set_s_instructor] = useState('');
    const [s_quiz_html, set_s_quiz_html] = useState('');
    // const modalRef = useRef();

    const selectTrainingQuestions = () => {
        const data = {
            i_quiz_id
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

    const arrangeOptionsArray = (array) => {
        // console.log('working 1');
        const store = [];
        const checkArray = ['all of the above', 'none of the above', 'all the above'];

        for (let i = 0; i < array.length; i++) {
          const currentOption = array[i].option;
          if (checkArray.indexOf(currentOption.toLowerCase().trim().replace('.', '')) !== -1) {
            store.push(array.splice(i, 1)[0]);
          }
        }

        if (store.length > 0) {
            for (let i = 0; i < store.length; i++) {
                array.push(store[i]);
            }
        }

        return array;
    }
    
    const randomizer = (question) => {
      const array = [];
      const mapKeys = ['s_answer', 's_option_1', 's_option_2', 's_option_3'];
      
      for (let key in question) {
        if (mapKeys.indexOf(key) !== -1) {
          if (question[key] && question[key].length > 0) {
            array.push({
              id: key === 's_answer' ? '`y#nH`7Sugf@Kb+E' : "`y#nH'7Sugf@Kb+E",
              option: question[key]
            });
          }
        }
      }
    
      const randomized = shuffleArray(array);

      const final = arrangeOptionsArray(randomized);

      for (let i = 0; i < final.length; i++) {
        final[i].letterIndex = resolveLetterIndex(i)
      }

      return final;
    }

    const questionsGenerator = () => {

        const shuffledQuestions = shuffleArray(questionsData);
        const finalArray = [];

        for (let i = 0; i < shuffledQuestions.length; i++) {
            const questionObject = {
                id: shuffledQuestions[i].id,
                s_question: shuffledQuestions[i].s_question.replace('{TODAY}', moment().format('MM/DD/YYYY HH:mm:ss')),
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

    const resolveLetterIndex = (i) => {
        const start = 65;
        return String.fromCharCode(start + i);
    
    }

    const markSelection = (e, selectionIndex) => {
        const questionId = e.target.name;
        const setSelection = e.target.value;
        const setSelectionType = e.target.id;
        const setSelectionIndex = resolveLetterIndex(selectionIndex);

        // console.log(`questionId: ${questionId}`);
        // console.log(`setSelection: ${setSelection}`);

        const generatedQuestionsCopy = Object.assign([], generatedQuestions);

        for (let i = 0; i < generatedQuestionsCopy.length; i++) {
            if (parseInt(generatedQuestionsCopy[i].id) === parseInt(questionId)) {
                // console.log(`working`);
                generatedQuestionsCopy[i].selection = setSelection;
                generatedQuestionsCopy[i].selectionType = setSelectionType;
                generatedQuestionsCopy[i].selectionIndex = setSelectionIndex;
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
        // console.log(valid);
        if (valid && !submitted) {
            setEnableSubmit(true);
        } else {
            setEnableSubmit(false);
        }
    }, [generatedQuestions, s_instructor, submitted]);

    const handleSubmit = () => {

        let correct = 0;

        const generatedQuestionsCopy = Object.assign([], generatedQuestions);
        for (let i = 0; i < generatedQuestionsCopy.length; i++) {
            if (generatedQuestionsCopy[i].selectionType === '`y#nH`7Sugf@Kb+E') {
                generatedQuestionsCopy[i].correct = true;
                correct++;
            } else {
                generatedQuestionsCopy[i].correct = false;
            }
        }

        setGeneratedQuestions(generatedQuestionsCopy);
        set_i_score(correct);
        set_i_total(generatedQuestions.length);   
        setSubmitted(true);
        modalRef.current.scrollTo(0, 0)
    }

    useEffect(() => {
        let saveHtml = ReactDOMServer.renderToString(saveHtmlGenerator());
        saveHtml += `
            <script>
                setTimeout(() => {
                    window.print();
                }, 1000);
            </script>
        `;
        // console.log(saveHtml);
        set_s_quiz_html(saveHtml);
    }, [submitted]);

    useEffect(() => {
        if (submitted) {
            const quizContent = {
                b_completed: (parseFloat(i_score) / parseFloat(i_total)) >= 0.85 ? true : false,
                i_score,
                i_total,
                s_instructor,
                s_quiz_html
            }
            createTrainingRecord(selectedContent, true, quizContent);
        }
    }, [s_quiz_html]);

    const saveHtmlGenerator = () => {
        return (
            <div>
                {
                    submitted && 
                    <div>
                        <div style={{position: 'fixed', top: '50%', left: '-40%', textAlign: 'right', fontSize: '50px', transform: 'rotate(-52deg)', width: '1200px', fontSize: '60px', opacity: '0.5'}}>
                            <span>SENSITIVE SECURITY INFORMATION</span>            
                        </div>
                        <h3>SENSITIVE SECURITY INFORMATION</h3>
                        <div className='mb-3'>
                            WARNING: This record contains Sensitive Security Information that is controlled under 49 CFR parts 15 and 1520. No part of this record may be disclosed to persons without a "need to know", as defined in 49 CFR parts 15 and 1520, except with the written permission of the Administrator of the Transportation Security Administration or the Secretary of Transportation. Unauthorized release may result in civil penalty or other action. For U.S. government agencies, public disclosure is governed by 5 U.S.C. 552 and 49 CFR parts 15 and 1520.
                        </div>
                        <h1>Training Module {selectedContent.i_training_id}: {selectedContent.s_name}</h1>
                        <h4>Results: {i_score} / {i_total} ({((parseFloat(i_score) / parseFloat(i_total)) * 100).toFixed(0)}%)</h4>
                        <h4>Name: {user && user.displayName}</h4>
                        <h4>Instructor Name: {assignorName}</h4>
                        <h4>Date: {moment().format('MM/DD/YYYY HH:mm:ss')}</h4>
                        <h4 style={{backgroundColor: 'green'}}>Correct Answer in Green</h4>
                        <h4 style={{fontWeight: 'bolder'}}>User's selected answer in bold</h4>
                    </div>
                }
                <div>
                    {
                        generatedQuestions.map((q, i) => 
                            <div key={i}>
                                <h4 className='my-1'>{i+1}. {q.s_question} {q.selection && ` - ${q.selectionIndex}`} {q.correct && q.correct ? <i className='text-success' style={{fontSize: '16px'}}>&#10004;</i> : q.correct === false ? <i className='text-danger' style={{fontSize: '16px'}}>&#10060;</i> : ''}</h4>
                                {
                                    q.options.map((o, _i) => 
                                        <div key={_i}>
                                            <input name={q.id} id={o.id} value={o.option} className='mr-2' type='radio' onClick={(e) => markSelection(e, _i)}></input>
                                            <label style={{fontWeight: `${o.option === q.selection ? '900' : 'normal'}`, backgroundColor: `${o.id === '`y#nH`7Sugf@Kb+E' ? 'green' : 'white'}`, color: `${o.id === '`y#nH`7Sugf@Kb+E' ? 'white' : 'black'}`}}>{o.letterIndex}. {o.option}</label>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
                <div style={{marginTop: '10px'}}>
                    WARNING: This record contains Sensitive Security Information that is controlled under 49 CFR parts 15 and 1520. No part of this record may be disclosed to persons without a "need to know", as defined in 49 CFR parts 15 and 1520, except with the written permission of the Administrator of the Transportation Security Administration or the Secretary of Transportation. Unauthorized release may result in civil penalty or other action. For U.S. government agencies, public disclosure is governed by 5 U.S.C. 552 and 49 CFR parts 15 and 1520.
                </div>
            </div>
        )
    }

    const resolveIncomplete = () => {
        let incomplete = '';
        for (let i = 0; i < generatedQuestions.length; i++) {
            if (!generatedQuestions[i].selection || generatedQuestions[i].selection.length < 0) {
                incomplete += `${i + 1}, `;
            }
        }
        return incomplete.substr(0, incomplete.length - 2);
    }
    

    return (
        <div>
            <div id='divToSave'>
                <h3>SENSITIVE SECURITY INFORMATION</h3>
                <div className='mb-3'>
                    WARNING: This record contains Sensitive Security Information that is controlled under 49 CFR parts 15 and 1520. No part of this record may be disclosed to persons without a "need to know", as defined in 49 CFR parts 15 and 1520, except with the written permission of the Administrator of the Transportation Security Administration or the Secretary of Transportation. Unauthorized release may result in civil penalty or other action. For U.S. government agencies, public disclosure is governed by 5 U.S.C. 552 and 49 CFR parts 15 and 1520.
                </div>
                <h1>Training Module {selectedContent.i_training_id}: {selectedContent.s_name}</h1>
                <h4>Instructor Name: <span><Input value={assignorName} disabled type='text'/></span></h4>
                {
                    submitted && 
                    <h3>Results: {i_score} / {i_total} ({((parseFloat(i_score) / parseFloat(i_total)) * 100).toFixed(0)}%)</h3>
                }
                <div style={{display: `${submitted ? 'none' : 'block'}`}}>
                    {
                        generatedQuestions.map((q, i) => 
                            <div key={i}>
                                <h6>{i+1}. {q.s_question} {q.selection && ` - ${q.selectionIndex}`}</h6>
                                <ul>
                                {
                                    q.options.map((o, _i) => 
                                        <div key={_i}>
                                            <input name={q.id} id={o.id} value={o.option} className='mr-2' type='radio' onClick={(e) => markSelection(e, _i)}></input>
                                            <label style={{fontWeight: `${o.option === q.selection ? '900' : 'normal'}`}}>{o.letterIndex}. {o.option}</label>
                                        </div>
                                        
                                    )
                                }
                                </ul>
                            </div>

                        )
                    }
                    <div>
                        WARNING: This record contains Sensitive Security Information that is controlled under 49 CFR parts 15 and 1520. No part of this record may be disclosed to persons without a "need to know", as defined in 49 CFR parts 15 and 1520, except with the written permission of the Administrator of the Transportation Security Administration or the Secretary of Transportation. Unauthorized release may result in civil penalty or other action. For U.S. government agencies, public disclosure is governed by 5 U.S.C. 552 and 49 CFR parts 15 and 1520.
                    </div>
                </div>
            </div>
            {
                !submitted && 
                <Row>
                    <Col md={1}>
                        <Button color='primary' className='mt-2' disabled={!enableSubmit} onClick={() => handleSubmit()}>Submit</Button>
                    </Col>
                    <Col md={11} className='mt-3'>
                        {
                            !enableSubmit && 
                            <h6>Please complete these questions to submit your exam: {resolveIncomplete()}</h6>
                        }
                    </Col>
                </Row>
            }
        </div>
    );
}

export default withRouter(Quiz);