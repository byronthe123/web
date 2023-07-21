import React, {Fragment, useState, useEffect, useRef} from 'react';
import { Table, Button, ButtonGroup, Input, Card, CardBody, Breadcrumb, BreadcrumbItem, Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import moment from 'moment';
import axios from 'axios';
import { units } from '../../data/data';
import PulseLoader from "react-spinners/PulseLoader";
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import ModalManageTraining from './ModalManageTraining';
import ReactTable from '../../custom/ReactTable';

const AssignTraining = ({
    baseApiUrl,
    headerAuthCode,
    user,
    eightyWindow,
    createSuccessNotification
}) => {

    const [trainingModules, setTrainingModules] = useState([]);
    const [users, setUsers] = useState(null);
    const [displayUsers, setDisplayUsers] = useState(null);
    const [i_training_id, set_i_training_id] = useState(null);
    const [s_access_type, set_s_access_type] = useState('CONTENT');
    const accessTypes = ['CONTENT', 'QUIZ', 'BOTH'];
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filterByName, setFilterByName] = useState('');
    const [unitFilter, setUnitFilter] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [b_enforce_content, set_b_enforce_content] = useState(false);
    const [modalTrainingOpen, setModalTrainingOpen] = useState(false);
    const [userTrainingRecords, setUserTrainingRecords] = useState([]);
    const assignedFilters = ['ALL', 'ASSIGNED ONLY'];
    const [selectedAssignFilter, setAssignFilter] = useState('ALL');
    const [editingUser, setEditingUser] = useState('');

    // useEffect(() => {
    //     if (filterByName.length > 0) {
    //         filterUsersByName();
    //     } else {
    //         setDisplayUsers(users);
    //     }
    // }, [filterByName]);

    useEffect(() => {
        if (users && users.length > 0) {
            if (filterByName.length > 0) {
                filterUsersByName();
            } else {
                if (unitFilter) {
                    filterByUnit(unitFilter);
                } else {
                    setDisplayUsers(users);
                }
            }
        }
    }, [filterByName]);

    const filterUsersByName = () => {
        let filtered;
        if (unitFilter) {
            filtered = displayUsers.filter(u => u.displayName && u.displayName.toLowerCase().includes(filterByName.toLowerCase()));
        } else {
            filtered = users.filter(u => u.displayName && u.displayName && u.displayName.toLowerCase().includes(filterByName.toLowerCase()));
        }
        setDisplayUsers(filtered);
    }

    const selectTrainingModulesAndUsers = () => {
        alert('working');
        axios.get(`${baseApiUrl}/selectTrainingModulesAndUsers`, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            console.log('Users');
            console.log(response.data);
            const { users, modules } = response.data;
            setTrainingModules(modules);
            setUsers(users);
            setDisplayUsers(users);
            resolveDepartments(users);
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

    const resolveDepartments = (users) => {
        const exclude = [
            'Microsoft Communication Application Instance',  
            'Brand Ambassador',
            'Service', 
            'HDQ'
        ];
        const departments = [];
        users.map(u => 
            u.department && 
            u.department.length > 0 && 
            departments.indexOf(u.department) === -1 && 
            exclude.indexOf(u.department) === -1 &&
            departments.push(u.department));
        
        setDepartments(departments);
    }

    const handleSelectTrainingId = (id) => {
        set_i_training_id(id);
    }

    const handleAddUser = (addEmail) => {
        let copy = Object.assign([], selectedUsers);
        if (copy.indexOf(addEmail) === -1) {
            copy.push(addEmail);
        } else {
            copy = copy.filter(email => email !== addEmail);
        }
        setSelectedUsers(copy);
        console.log(selectedUsers);
    }

    const resolveSelected = (email) => {
        return selectedUsers.indexOf(email) !== -1;
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

    const filterByUnit = (value) => {
        setSelectedDepartment(null);
        let filtered;

        if (unitFilter === value) {
            setUnitFilter(null);
            filtered = users;
        } else {
            setUnitFilter(value);
            if (users && users.length > 0) {
                filtered = users.filter(u => u && u.officeLocation && u.officeLocation.toLowerCase() === value.toLowerCase());
            }
        }

        setDisplayUsers(filtered);
    }

    const filterByDepartment = (department) => {
        setUnitFilter(null);

        if (selectedDepartment === department) {
            setSelectedDepartment(null);
        } else {
            setSelectedDepartment(department);
        }

        const filtered = users.filter(u => u.department && u.department === department);
        setDisplayUsers(filtered);
    }

    const handleModal = (email) => {
        setEditingUser(email);
        getUserTrainingRecords(email, () => {
            setModalTrainingOpen(true); 
        })
    }

    const getUserTrainingRecords = (email, callback) => {
        axios.post(`${baseApiUrl}/getUserTrainingRecords`, {
            s_user_id: email
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setUserTrainingRecords(response.data);
            return callback();
        }).catch(error => {
            console.log(error);
        });
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

    const filterByAssigned = (value) => {
        setAssignFilter(value);
        if (value === 'ALL') {
            setDisplayUsers(users);
        } else {
            const assignedUsers = users.filter(u => u.alreadyAssigned);
            setDisplayUsers(assignedUsers);
        }
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
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Module ID</th>
                                            <th>Module Name</th>
                                            <th>Category</th>
                                            <th>Created</th>
                                        </tr>
                                    </thead>
                                    <tbody className={'table-row-hover'}>
                                        {
                                            trainingModules && trainingModules.map((t, i) =>
                                                <tr onClick={() => handleSelectTrainingId(t.id)} key={i} className={`${i_training_id === t.id ? 'table-row-selected' : ''}`}>
                                                    <td>{i+1}</td>
                                                    <td>{t.id}</td>
                                                    <td>{t.s_module_name}</td>
                                                    <td>{t.s_module_category}</td>
                                                    <td>{moment(t.t_created).format('MM/DD/YYYY HH:mm:ss')}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
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
                                <h6 style={{display: 'inline-block'}} className='mr-3'>Filter by Name:</h6>
                                <input value={filterByName} onChange={(e) => setFilterByName(e.target.value)} style={{display: 'inline-block', width: '300px'}} type='text' />
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
                                <h6 style={{display: 'inline-block'}} className='mr-3'>Filter by Dept.:</h6>
                                <ButtonGroup style={{display: 'inline-block'}}>
                                    {
                                        departments.map((d, i) =>
                                            <Button active={selectedDepartment === d} key={i} onClick={() => filterByDepartment(d)}>{d}</Button>
                                        )
                                    }
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <h6 style={{display: 'inline-block'}} className='mr-3'>Filter by Assigned:</h6>
                                <ButtonGroup style={{display: 'inline-block'}}>
                                    {
                                        assignedFilters.map((f, i) =>
                                            <Button active={selectedAssignFilter === f} key={i} onClick={() => filterByAssigned(f)}>{f}</Button>
                                        )
                                    }
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>

            <div className={'col-12 mt-2'}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row className='mt-4'>  
                            <Col md={12}>
                                <h4>Users</h4>
                            </Col>
                        </Row>
                        <Row className='mt-4 mb-0 pb-0'>
                            <Col md={12} className='mb-0 pb-0'>
                                <Table className='mb-0 pb-0' style={{tableLayout: 'fixed'}}>
                                    <thead>
                                        <tr>    
                                            <th width='2%'></th>
                                            <th width='5%'>#</th>
                                            <th width='13%'>Name</th>
                                            <th width='13%'>Email</th>
                                            <th width='7%'>Office</th>
                                            <th width='10%'>Department</th>
                                            <th width='47%'>Notes</th>
                                            <th width='3%'></th>
                                        </tr>
                                    </thead>
                                    <tbody>
  
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>

                        <Row style={{height: '500px', overflowY: 'scroll'}}>
                        {
                            users ? 
                                <Col md={12}>
                                    <Table style={{tableLayout: 'fixed'}}>
                                        <thead>

                                        </thead>
                                        <tbody className={'table-row-hover'}>
                                            {
                                                displayUsers && displayUsers.map((u, i) => u.displayName && u.department &&  
                                                    <tr key={i} onClick={() => handleAddUser(u.mail)}>
                                                        <td width='2%'>
                                                            <input type='checkbox' checked={resolveSelected(u.mail)} />
                                                        </td>
                                                        <td width='5%'>{i+1}</td>
                                                        <td width='13%'>{u.s_first_name} {u.s_last_name}</td>
                                                        <td width='13%'>{u.mail}</td>
                                                        <td width='7%'>{u.officeLocation}</td>
                                                        <td width='10%'>{u.department}</td>
                                                        {
                                                            u.alreadyAssigned ? 
                                                            <td width='50%'>Assigned to {u.s_module_name} by {u.s_assignor} at {moment(u.t_created).format('MM/DD/YYYY HH:mm:ss')}</td> :
                                                            <td></td>
                                                        }
                                                        <td width='3%'>
                                                            <i onClick={() => handleModal(u.mail)} className="fas fa-edit"></i>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </Table>
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

            <div className={'col-12 mt-2'}>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row className='mt-4'>
                            <Col md={12}>
                                <Button disabled={!enableAssignTraining()} onClick={() => assignTraining()} >Assign Training</Button>
                            </Col>
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