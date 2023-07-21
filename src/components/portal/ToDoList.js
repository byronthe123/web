import React, {Fragment, useState, useEffect, useRef} from 'react';
import { Table, Button, Input, Card, CardBody, Breadcrumb, BreadcrumbItem, Nav, NavItem, TabContent, TabPane, Row, Col  } from "reactstrap";
import moment from 'moment';
import axios from 'axios';

import AddTask from './AddTask';
import Task from './Task';

const ToDoList = ({
    baseApiUrl,
    headerAuthCode,
    user,
    eightyWindow,
    createSuccessNotification
}) => {

    const [userTasks, setUserTasks] = useState([]);
    const [addTaskName, setAddTaskName] = useState('');
    const [editTaskName, setEditTaskName] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);
    const [displayCompletedTasks, setDisplayCompletedTasks] = useState(false);
    const [edit, setEdit] = useState(false);
    const [dueDate, setDueDate] = useState(new Date());
    const focusRef = useRef(null);

    // useEffect(() => {
    //     const s_user_email = user && user.s_email;
    //     headerAuthCode && s_user_email && 
    //     getTasks();
    // }, [user]);

    useEffect(() => {
        if (focusRef.current !== null) {
            focusRef.current.focus();
        }
    }, [editTaskId, edit]);

    const getTasks = () => {
        const s_user_email = user && user.s_email;

        axios.post(`${baseApiUrl}/userTasks`, {
            s_user_email
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setUserTasks(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        const setTaskName = userTasks && userTasks.filter(t => t.id === editTaskId)[0] && userTasks.filter(t => t.id === editTaskId)[0].s_task_name;
        setEditTaskName(setTaskName);
    }, [editTaskId]);

    const addTask = (e) => {
        e.preventDefault();
        const s_task_name = addTaskName;
        const s_user_email = user && user.s_email;

        axios.post(`${baseApiUrl}/addUserTask`, {
            s_user_email,
            s_task_name
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setAddTaskName('');
            getTasks();
        }).catch(error => {

        });
    }

    const editTask = (e) => {
        e.preventDefault();
        const id = editTaskId;
        const s_task_name = editTaskName;

        axios.post(`${baseApiUrl}/editTask`, {
            id, 
            s_task_name
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setEditTaskId(null);
            getTasks();
        }).catch(error => {
            console.log(error);
        });
    }

    const updateTaskCompletion = (id, currentCompletionStatus) => {
        const b_completed = !currentCompletionStatus;

        axios.post(`${baseApiUrl}/updateTaskCompletion`, {
            id, 
            b_completed 
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setEditTaskId(null);
            getTasks();
        }).catch(error => {
            console.log(error);
        });
    }

    const deleteTask = (id) => {
        axios.post(`${baseApiUrl}/deleteTask`, {
            id
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            getTasks();
        }).catch(error => {

        }); 
    }

    return (
        <Row>

            <div className={'col-12'}>
                <Col md='12' lg='12' className='px-0'>
                    {
                        userTasks.map((t, i) => t.b_completed !== true &&  
                            <Task 
                                task={t} 
                                key={i} 
                                editTaskName={editTaskName}
                                setEditTaskName={setEditTaskName}
                                editTask={editTask}
                                editTaskId={editTaskId}
                                setEditTaskId={setEditTaskId}
                                updateTaskCompletion={updateTaskCompletion}
                                focusRef={focusRef}
                                deleteTask={deleteTask}
                            />
                        )
                    }
                    <AddTask
                        addTaskName={addTaskName}
                        setAddTaskName={setAddTaskName}
                        addTask={addTask}
                        focusRef={focusRef}
                        edit={edit}
                        setEdit={setEdit}
                    />
                </Col>

            </div>

        </Row>
    );
}

export default ToDoList;