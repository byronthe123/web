import React, {Fragment, useState, useEffect, useRef} from 'react';
import { Table, Button, ButtonGroup, Input, Card, CardBody, Breadcrumb, BreadcrumbItem, Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import axios from 'axios';
import PulseLoader from "react-spinners/PulseLoader";
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import ModalManageTraining from './ModalManageTraining';
import ReactTable from '../../custom/ReactTable';
import usersMapping from './usersMapping';

const AssignTraining = ({
    baseApiUrl,
    headerAuthCode,
    user,
    eightyWindow,
    createSuccessNotification
}) => {

    const [trainingModules, setTrainingModules] = useState([]);
    const userTypes = ['EOS', 'EXTERNAL'];
    const [type, setType] = useState('EOS');
    const [users, setUsers] = useState(null);
    const [displayUsers, setDisplayUsers] = useState(null);
    const [i_training_id, set_i_training_id] = useState(null);
    const [s_access_type, set_s_access_type] = useState('CONTENT');
    const accessTypes = ['CONTENT', 'QUIZ', 'BOTH'];
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [b_enforce_content, set_b_enforce_content] = useState(false);
    const [modalTrainingOpen, setModalTrainingOpen] = useState(false);
    const [userTrainingRecords, setUserTrainingRecords] = useState([]);
    const [editingUser, setEditingUser] = useState('');

    const selectTrainingModulesAndUsers = () => {
        axios.get(`${baseApiUrl}/selectTrainingModulesAndUsers/EOS`, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            console.log('Users');
            console.log(response.data);
            const { users, modules } = response.data;
            setTrainingModules(modules);
            setUsers(users);
            setDisplayUsers(users);
        }).catch(error => {
            console.log(error);
            alert(error);
        });
    }

    useEffect(() => {
        if (user && user.s_unit) {
            selectTrainingModulesAndUsers();
        }
    }, [user]);

    const handleSelectTrainingId = (id) => {
        set_i_training_id(id);
    }

    const handleAddUser = (user) => {
        const addEmail = user.s_email;
        let copy = Object.assign([], selectedUsers);

        const usersCopy = Object.assign([], users);
        const index = usersCopy.findIndex(u => u.s_email === user.s_email);

        if (copy.indexOf(addEmail) === -1) {
            copy.push(addEmail);
            usersCopy[index].selected = true;
        } else {
            copy = copy.filter(email => email !== addEmail);
            usersCopy[index].selected = false;
        }
        setSelectedUsers(copy);
        setUsers(usersCopy);
    }

    const assignTraining = () => {

        const i_add_hours = s_access_type === 'QUIZ' ? 1 : 4;

        const data = {
            main: {
                i_training_id,
                s_access_type,
                i_add_hours,
                s_assignor : user.s_email,
                b_enforce_content
            }, 
            users: selectedUsers
        }

        axios.post(`${baseApiUrl}/assignTraining`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            console.log(response);
            setSelectedUsers([]);
            selectTrainingModulesAndUsers();
            createSuccessNotification('Training Assigned.');
        }).catch(error => {
            console.log(error);
            alert(error);
        });
    }

    const enableAssignTraining = () => {
        return i_training_id !== null && selectedUsers.length > 0;
    }

    const removeTrainingAssigned = (id) => {
        axios.post(`${baseApiUrl}/removeTrainingAssigned`, {
            id,
            s_user_id: user.s_email
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setUserTrainingRecords(response.data);
            createSuccessNotification('Training Record Deleted');
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <Row>
        
            <div className={`${eightyWindow() ? 'col-12' : 'col-12'} pb-2`}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row>
                            <Col md={10}>
                                <Row>
                                    WARNING: This record contains Sensitive Security Information that is controlled under 49 CFR parts 15 and 1520. No part of this record may be disclosed to persons without a "need to know", as defined in 49 CFR parts 15 and 1520, except with the written permission of the Administrator of the Transportation Security Administration or the Secretary of Transportation. Unauthorized release may result in civil penalty or other action. For U.S. government agencies, public disclosure is governed by 5 U.S.C. 552 and 49 CFR parts 15 and 1520.
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>

            <div className={'col-12'}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row>
                            <Col md={4}>
                                <h4 style={{display: 'inline-block'}}>Access Type:</h4>
                                <ButtonGroup className='ml-3' style={{display: 'inline-block'}}>
                                    {
                                        accessTypes.map((t, i) => 
                                            <Button key={i} onClick={() => set_s_access_type(t)} active={s_access_type === t}>{t}</Button>
                                        )
                                    }
                                </ButtonGroup>
                            </Col>
                            <Col md={4} className='pt-2'>
                                <h4 className='mr-3' style={{display: 'inline-block'}}>Enforce Complete Content before Quiz:</h4>
                                <Switch
                                    className="switch-dg"
                                    checked={b_enforce_content}
                                    onClick={() => set_b_enforce_content(!b_enforce_content)}
                                    style={{border: '2px rgb(95, 153, 247) solid'}}
                                /> 
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col md={12}>
                                <h4>Training Modules:</h4>
                                <ReactTable 
                                    data={trainingModules}
                                    mapping={[
                                        {
                                            name: 'Module ID',
                                            value: 'id'
                                        },
                                        {
                                            name: 'Module Name',
                                            value: 's_module_name'
                                        },
                                        {
                                            name: 'Category',
                                            value: 's_module_category'
                                        },
                                        {
                                            name: 'Created',
                                            value: 't_created',
                                            datetime: true,
                                            utc: true
                                        }
                                    ]}
                                    enableClick={true}
                                    handleClick={(item) => handleSelectTrainingId(item.id)}
                                    index={true}
                                    customHeight={'300px'}
                                /> 
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
            
            <div className={'col-12 mt-2'}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row className='mt-4 mb-2'>  
                            <Col md={12}>
                                <div className='float-left'>
                                    <h4 className={'d-inline'}>Users</h4>
                                    <ButtonGroup className={'d-inline ml-2'}>
                                        {
                                            userTypes.map((u, i) =>
                                                <Button 
                                                    key={i}
                                                    active={type === u}
                                                    onClick={() => setType(u)}
                                                >
                                                    {u}
                                                </Button>
                                            )
                                        }
                                    </ButtonGroup>
                                </div>
                                <Button 
                                    disabled={!enableAssignTraining()} 
                                    onClick={() => assignTraining()}
                                    className='float-right'
                                >
                                    Assign Training
                                </Button>
                            </Col>
                        </Row>

                        <Row style={{height: '500px', overflowY: 'scroll'}}>
                        {
                            users ? 
                                <Col md={12}>
                                    <ReactTable
                                        data={users.filter(u => type === 'EOS' ? u.b_internal : !u.b_internal)}
                                        mapping={usersMapping}
                                        index={true}
                                        enableClick={true}
                                        handleClick={handleAddUser}
                                    />
                                </Col> :
                                <Col md={12} className='text-center' style={{marginTop: '150px'}}>
                                    <PulseLoader
                                        size={50}
                                        color={"#51C878"}
                                        loading={true}
                                    />
                                </Col>
                        }
                        </Row>
                    </CardBody>
                </Card>
            </div>

            <ModalManageTraining 
                open={modalTrainingOpen}
                handleModal={setModalTrainingOpen}
                editingUser={editingUser}
                userTrainingRecords={userTrainingRecords}
                removeTrainingAssigned={removeTrainingAssigned}
            />

        </Row>
    );
}

export default AssignTraining;