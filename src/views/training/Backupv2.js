import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";

import { Player } from 'video-react';
import 'video-react/dist/video-react.css';
import ReactPlayer from 'react-player';

import {Button, Row, Col, Table, Card, CardBody, CardTitle, CardText} from 'reactstrap';

import AppLayout from '../../components/AppLayout';

import ModalPowerpoint from '../../components/training/ModalPowerpoint';
import ModalQuiz from '../../components/training/ModalQuiz';

const Training = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, eightyWindow, width
}) => {

    const [i_training_id, set_i_training_id] = useState(null);
    const [assignedContent, setAssignedContent] = useState([]);
    const [trainingRecord, setTrainingRecord] = useState([]);
    const [trainingContent, setTrainingContent] = useState([]); 
    const [modalPowerpointOpen, setModalPowerpointOpen] = useState(false);
    const [powerpointLink, setPowerpointLink] = useState('');
    const [modalQuizOpen, setModalQuizOpen] = useState(false);
    const [i_quiz_id, set_i_quiz_id] = useState(null);
    const [selectedContent, setSelectedContent] = useState(null);
    const [s_access_type, set_s_access_type] = useState('');
    
    const selectTrainingAssigned = () => {
        const data = {
            s_user_id: user && user.s_email
        }
        axios.post(`${baseApiUrl}/selectTrainingAssigned`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            if (response.data) {
                const {assigned, record} = response.data;
                setAssignedContent(assigned);
                setTrainingRecord(record);
                set_s_access_type(assigned[0].s_access_type)
                setTrainingContent(resolveCompleted(assigned, record));    
            }
            console.log(response.data);
        }).catch(error => {

        });
    }

    useEffect(() => {
        if (user && user.s_email) {
            selectTrainingAssigned();
        }
    }, [user]);

    const resolveCompleted = (content, record) => {
        console.log(content);
        console.log(record);

        for (let i = 0; i < content.length; i++) {
            if (record.length > 0) {
                const match = record.filter(r => r.i_content_id === content[i].i_content_id);
                console.log(match);
                if (match.length > 0) {
                    const useRecord = match[match.length - 1];
                    content[i].b_completed = useRecord.b_completed;
                    content[i].t_completed = useRecord.t_completed;
                    content[i].f_percent = useRecord.f_percent;
                }
            }
        }
 
        // console.log(content);
        return content;
    }


    // const resolveCompleted = (content, record) => {
    //     console.log(content);
    //     console.log(record);
    //     const { s_access_type } = content[0];
    //     const searchArray = [];

    //     if (s_access_type === 'CONTENT') {
    //         content.map(c => c.s_type !== 'QUIZ' && searchArray.push(c));
    //     } else {
    //         content.map(c => c.s_type === 'QUIZ' && searchArray.push(c));
    //     }

    //     console.log(searchArray);

    //     for (let i = 0; i < searchArray.length; i++) {
    //         if (record.length > 0) {
    //             const match = record.filter(r => r.i_content_id === searchArray[i].i_content_id);
    //             console.log(match);
    //             if (match.length > 0) {
    //                 const useRecord = match[match.length - 1];
    //                 searchArray[i].b_completed = useRecord.b_completed;
    //                 searchArray[i].t_completed = useRecord.t_completed;
    //                 searchArray[i].f_percent = useRecord.f_percent;
    //             }
    //         }
    //     }
 
    //     // console.log(content);
    //     return searchArray;
    // }

    const createTrainingRecord = (content, quiz=false, quizContent=null) => {
        const now = moment().local().format('MM/DD/YYYY hh:mm A');

        const data = {
            quiz,
            main: {
                i_content_id: content.i_content_id,
                s_user_id: user && user.s_email,
                b_completed: quiz ? quizContent.b_completed : true,
                t_completed: now,
                i_training_id: content.i_training_id
            },
            other: {}
        }

        if (quiz) {
            const {i_score, i_total, s_instructor, s_quiz_html} = quizContent;
            data.main.i_score = i_score;
            data.main.i_total = i_total;
            data.main.s_instructor = s_instructor;
            data.other.s_quiz_html = s_quiz_html;
        }

        axios.post(`${baseApiUrl}/createTrainingRecord`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            const {record} = response.data;
            setTrainingRecord(record);
            setTrainingContent(resolveCompleted(assignedContent, record));
        }).catch(error => {

        });
    }

    // const enableQuiz = () => {
    //     let allWatched = true;

    //     for (let i = 0; i < trainingVideos.length; i++) {
    //         if (!trainingVideos[i].b_watched) {
    //             allWatched = false;
    //         }
    //     }

    //     for (let i = 0; i < trainingPowerpoints.lenght; i++) {
    //         if (!trainingPowerpoints[i].b_watched) {
    //             allWatched = false;
    //         }   
    //     }

    //     return allWatched;
    // }

    const enableStartContent = (order) => {
        console.log(`Content order = ${order}`);
        if (order === 1) {
            return true;
        }
        console.log(trainingContent);
        console.log(assignedContent);
        console.log(assignedContent[order - 1]);
        const target = assignedContent.filter(t => t.i_order === (order-1))[0];
        console.log(target);
        return target && target.b_completed;
    }

    const handleContent = (content) => {
        console.log(content);
        if (enableStartContent(content.i_order)) {
            set_i_training_id(content.i_training_id);
            setSelectedContent(content);
            if (content.s_type.toUpperCase() === 'POWERPOINT') {
                setPowerpointLink(content.s_link);
                setModalPowerpointOpen(true);
                if (!content.b_completed) {
                    createTrainingRecord(content);
                }
            } else if (content.s_type.toUpperCase() === 'QUIZ') {
                set_i_quiz_id(content.i_quiz_id);
                setModalQuizOpen(true);
            }
        } else {
            alert('You must finish all previous training Content before taking the quiz.');
        }
    }

    const resolveTrainingMapping = (trainingContent) => {
        const mapping = [];
        if (s_access_type === 'QUIZ') {
            trainingContent.map(t => t.s_type === 'QUIZ' && mapping.push(t));
        } else {
            trainingContent.map(t => t.s_type !== 'QUIZ' && mapping.push(t));
        }
        return mapping;
    }

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: 'white', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-4 py-3">
                    <h1>Training Module</h1>
                    <Row>
                        <Col md={12}>
                            <Row>
                                <Col md={12}>
                                    <Card className='custom-card'>
                                        <CardBody className='py-3 px-5'>
                                                <Row>
                                                    WARNING: This record contains Sensitive Security Information that is controlled under 49 CFR parts 15 and 1520. No part of this record may be disclosed to persons without a "need to know", as defined in 49 CFR parts 15 and 1520, except with the written permission of the Administrator of the Transportation Security Administration or the Secretary of Transportation. Unauthorized release may result in civil penalty or other action. For U.S. government agencies, public disclosure is governed by 5 U.S.C. 552 and 49 CFR parts 15 and 1520.
                                                </Row>
                                                <Row>
                                                    <h4>Training Content:</h4>
                                                </Row>
                                                <Row>
                                                {
                                                    <Table>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Type</th>
                                                                <th>Name</th>               
                                                                <th>Completed</th>
                                                                <th>Completed Date</th>
                                                                <th>Score</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className={'table-row-hover'}>
                                                            {                                        
                                                                resolveTrainingMapping(trainingContent).map((t, i) =>  
                                                                    <tr key={i} onClick={() => handleContent(t)}>
                                                                        <td>{i + 1}</td>
                                                                        <td>{t.s_type}</td>
                                                                        <td>{t.s_name}</td>
                                                                        <td>{t.b_completed && t.b_completed ? 'Yes' : 'No'}</td>
                                                                        <td>{t.t_completed && moment.utc(t.t_completed).format('MM/DD/YYYY HH:mm:ss')}</td>
                                                                        <td>{t.f_percent && `${(t.f_percent * 100).toFixed(0)}%`}</td>
                                                                    </tr>
                                                                )
                                                            }
                                                        </tbody>
                                                    </Table>
                                                }
                                                </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>

            <ModalPowerpoint 
                open={modalPowerpointOpen}
                handleModal={setModalPowerpointOpen}
                s_link={powerpointLink}
            />

            <ModalQuiz 
                open={modalQuizOpen}
                handleModal={setModalQuizOpen}
                i_quiz_id={i_quiz_id}
                baseApiUrl={baseApiUrl}
                headerAuthCode={headerAuthCode}
                user={user}
                selectedContent={selectedContent}
                i_training_id={i_training_id}
                createTrainingRecord={createTrainingRecord}
                user={user}
            />



        </AppLayout>
    );
}

export default withRouter(Training);