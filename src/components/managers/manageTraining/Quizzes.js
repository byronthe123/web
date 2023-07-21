import React, {Fragment, useState, useEffect, useRef} from 'react';
import { Table, Button, ButtonGroup, Input, Card, CardBody, Breadcrumb, BreadcrumbItem, Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import moment from 'moment';
import axios from 'axios';
import { renderToString } from 'react-dom/server';

import CustomSwitch from '../../custom/CustomSwitch';
import GenerateCertificate from './GenerateCertificate';
import ReactTable from '../../custom/ReactTable';
import { fileDownload } from '../../../utils';

const Quizzes = ({
    baseApiUrl,
    headerAuthCode,
    user,
    eightyWindow,
    createSuccessNotification,
    units
}) => {

    const [quizData, setQuizData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [enableFilterPassing, setEnableFilterPassing] = useState(false);
    const [unitFilter, setUnitFilter] = useState(null);
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);

    const selectAllQuizRecords = () => {
        axios.get(`${baseApiUrl}/selectAllQuizRecords`, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            console.log(response.data);
            setQuizData(response.data);
            setDisplayData(response.data);
            setModules(resolveModules(response.data));
        }).catch(error => {
            alert(error);
        });
    }

    useEffect(() => {
        selectAllQuizRecords();
    }, []);

    const filterPassing = () => {
        const data = quizData.filter(d => d.b_completed);
        setDisplayData(data);
    }

    useEffect(() => {
        if (enableFilterPassing) {
            filterPassing();
        } else {
            setDisplayData(quizData);
        }
    }, [enableFilterPassing]);

    const resolveModules = (data) => {
        const modules = [];
        for (let i = 0; i < data.length; i++) {
            const add = {
                module_id: data[i].module_id,
                module_name: data[i].module_name
            }

            const foundIndex = modules.findIndex(m => m.module_id === add.module_id);

            if (foundIndex === -1) {
                modules.push(add);
            }
        }
        return modules;
    }

    const filterByUnit = (value, reset) => {
        let filtered;

        const useData = enableFilterPassing ? 
            quizData.filter(d => d.b_completed) :
            quizData;

        if (unitFilter === value) {
            if (!reset) {
                setUnitFilter(null);
            }
            filtered = useData;
        } else {
            setUnitFilter(value);
            if (quizData && quizData.length > 0) {
                filtered = useData.filter(d => d && d.s_unit && d.s_unit.toLowerCase() === value.toLowerCase());
            }
        }

        setDisplayData(filtered);
    }

    const filterByModule = (module) => {
        if (selectedModule && selectedModule.module_id === module.module_id) {
            setSelectedModule(null);
            filterByUnit(unitFilter, true);
        } else {
            setSelectedModule(module);
            const filtered = displayData.filter(d => d.module_id === module.module_id);
            setDisplayData(filtered);
        }
    }

    const getQuizFileData = (s_quiz_file_name) => {
        axios.post(`${baseApiUrl}/getQuizFileData`, {
            s_quiz_file_name
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
            myWindow.document.write(response.data);
            console.log(response);
        }).catch(error => {
            alert(error);
        });
    }

    const selectQuizData = (training_record_id) => {
        axios.post(`${baseApiUrl}/selectQuizData`, {
            id: training_record_id
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            const { quizData, stationInfo } = response.data;

            const certificate = renderToString(
                <GenerateCertificate 
                    quizData={quizData}
                    stationInfo={stationInfo}
                />
            );

            const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
            myWindow.document.write(certificate);
        }).catch(error => {
            alert(error);
        });
    }

    const trainingRecordCsv = () => {
        const data = [];
        for (let i = 0; i < displayData.length; i++) {
            const currentItem = displayData[i];
            data.push({
                '#': i + 1,
                station: currentItem.s_unit,
                user: currentItem.displayName,
                title: currentItem.jobTitle,
                module: currentItem.module_name,
                training: currentItem.content_name,
                passed: currentItem.b_completed ? 'YES' : 'NO',
                date: moment.utc(currentItem.t_completed).format('MM/DD/YYYY HH:mm:ss'),
                trainer: currentItem.s_instructor,
                score: `${(currentItem.f_percent * 100).toFixed(0)}%`
            });
        }

        fileDownload(data, 'Training Data.csv');
    }

    const resolveDisplayName = (d) => {
        if (d.displayName && d.displayName.length > 0) {
            return d.displayName;
        } else {
            if (d.s_user_id && d.s_user_id.length > 0) {
                return d.s_user_id.toUpperCase().replace('@CHOICE.AERO', '');
            }
            return '';
        }   
    }

    return (
        <Row>
        
            <div className={`${eightyWindow() ? 'col-12' : 'col-12'} pb-2`}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row>
                            <Col md={2}>
                                <CustomSwitch 
                                    label={'Show Only Passing'}
                                    value={enableFilterPassing}
                                    handleSwitch={setEnableFilterPassing}
                                />
                            </Col>
                            <Col md={10}>
                                <Row>
                                    WARNING: This record contains Sensitive Security Information that is controlled under 49 CFR parts 15 and 1520. No part of this record may be disclosed to persons without a "need to know", as defined in 49 CFR parts 15 and 1520, except with the written permission of the Administrator of the Transportation Security Administration or the Secretary of Transportation. Unauthorized release may result in civil penalty or other action. For U.S. government agencies, public disclosure is governed by 5 U.S.C. 552 and 49 CFR parts 15 and 1520.
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>

            <div className={'col-12 mt-2'}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row className='mb-2'>
                            <Col md={12}>
                                <h4>Filter</h4>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={12}>
                                <h6 style={{display: 'inline-block'}} className='mr-3'>Filter by Unit:</h6>
                                <ButtonGroup style={{display: 'inline-block'}}>
                                    {
                                        units.map((u, i) =>
                                            <Button active={unitFilter === u} key={i} onClick={() => filterByUnit(u)}>{u}</Button>
                                        )
                                    }
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={12}>
                                <h6 style={{display: 'inline-block'}} className='mr-3'>Filter by Module:</h6>
                                <ButtonGroup style={{display: 'inline-block'}}>
                                    {
                                        modules.map((m, i) =>
                                            <Button active={selectedModule && selectedModule.module_id === m.module_id} key={i} onClick={() => filterByModule(m)}>{m.module_name}</Button>
                                        )
                                    }
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={12}>
                                <button onClick={() => trainingRecordCsv()} className='btn btn-primary'>Export to CSV</button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>

            <div className={`${eightyWindow() ? 'col-12' : 'col-12'} mt-2`}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row>
                            <Col md={12}>
                                <ReactTable 
                                    data={displayData}
                                    mapping={[
                                        {
                                            name: 'Module',
                                            value: 'module_name'
                                        },
                                        {
                                            name: 'Content',
                                            value: 'content_name'
                                        },
                                        {
                                            name: 'User',
                                            value: 'displayName'
                                        },
                                        {
                                            name: 'Title',
                                            value: 'jobTitle'
                                        },
                                        {
                                            name: 'Completed',
                                            value: 'b_completed',
                                            boolean: true
                                        },
                                        {
                                            name: 'Date',
                                            value: 't_completed',
                                            datetime: true,
                                            utc: true
                                        },
                                        {
                                            name: 'Score',
                                            value: 'f_percent',
                                            percent: true
                                        },
                                        {
                                            name: 'Instructor',
                                            value: 's_instructor',
                                        },
                                        {
                                            name: 'Unit',
                                            value: 's_unit'
                                        },
                                        {
                                            name: '',
                                            value: 'fas fa-file-download',
                                            icon: true,
                                            function: (item) => getQuizFileData(item.s_quiz_file_name)
                                        },
                                        {
                                            name: '',
                                            value: 'fas fa-certificate',
                                            icon: true,
                                            showCondition: (item) => item.b_completed,
                                            function: (item) => selectQuizData(item.training_record_id)
                                        }
                                    ]}
                                    index={true}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>

        </Row>
    );
}

export default Quizzes;