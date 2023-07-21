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

    const [trainingModules, setTrainingModules] = useState([]);
    const [i_training_id, set_i_training_id] = useState(null);
    const [trainingContent, setTrainingContent] = useState([]); 
    const [modalPowerpointOpen, setModalPowerpointOpen] = useState(false);
    const [powerpointLink, setPowerpointLink] = useState('');
    const [modalQuizOpen, setModalQuizOpen] = useState(false);
    const [i_quiz_id, set_i_quiz_id] = useState(null);
    const [selectedContent, setSelectedContent] = useState(null);
    
    const selectTrainingModules = () => {

        console.log('running');

        axios.get(`${baseApiUrl}/selectTrainingModules`, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            console.log(response.data);
            setTrainingModules(response.data);
        }).catch(error => {
            console.log(error);
            alert(error);
        });
    }

    useEffect(() => {
        selectTrainingModules();
    }, []);

    const handleSelectTrainingId = (id) => {
        set_i_training_id(id);
        selectTrainingContent(id);
    }

    const selectTrainingContent = (i_training_id) => {
        const data = {
            content: {
                i_training_id
            },
            record: {
                i_training_id,
                s_user_id: user && user.s_email
            }
        }
        axios.post(`${baseApiUrl}/selectTrainingContent`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            const {content, record} = response.data;
            setTrainingContent(resolveCompleted(content, record));
            console.log(response.data);
        }).catch(error => {

        });
    }

    const resolveCompleted = (content, record) => {
        for (let i = 0; i < content.length; i++) {
            if (record.length > 0) {
                const match = record.filter(r => r.i_content_id === content[i].id);
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

    const createTrainingRecord = (content, quiz=false, quizContent=null) => {
        const now = moment().local().format('MM/DD/YYYY hh:mm A');

        const data = {
            quiz,
            main: {
                i_content_id: content.id,
                s_user_id: user && user.s_email,
                b_completed: quiz ? quizContent.b_completed : true,
                t_completed: now,
                i_training_id
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
            setTrainingContent(resolveCompleted(trainingContent, record));
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
        console.log(order -1 );
        if (order === 1) {
            return true;
        }
        console.log(trainingContent[order - 1]);
        const target = trainingContent.filter(t => t.i_order === (order-1))[0];
        console.log(target);
        return target && target.b_completed;
    }

    const handleContent = (content) => {
        // console.log(content);
        if (enableStartContent(content.i_order)) {
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
            alert('Please finish the previous training content first');
        }
    }

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: 'white', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-4 py-3">
                    <h1>Training Module</h1>
                    <Row>
                        <Col md={3}>
                            <Card className='custom-card'>
                                <CardBody className='py-3 px-5'>
                                    <Row>
                                        <h4>Available Training:</h4>
                                    </Row>
                                    <Row>
                                    {
                                        <Table className={'table-row-hover'}>
                                            <thead></thead>
                                            <tbody>
                                                {                                        
                                                    trainingModules.map((t, i) => 
                                                        <tr onClick={() => handleSelectTrainingId(t.id)} key={i} className={`${i_training_id === t.id ? 'table-row-selected' : ''}`}>
                                                            <td>{t.s_module_name}</td>
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
                        <Col md={9}>
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
                                                                trainingContent.map((t, i) => 
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