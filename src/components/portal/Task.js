import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import {Row, Col, Table, Card, CardBody, CardTitle, CardText} from 'reactstrap';
import ReactTooltip from 'react-tooltip';

const Task = ({
    task,
    editTask,
    editTaskName,
    setEditTaskName,
    editTaskId,
    setEditTaskId,
    updateTaskCompletion,
    focusRef,
    deleteTask
}) => {

    const [icon, setIcon] = useState('fa-circle');

    return (
        <Card style={{borderRadius: '10px',width: '90%', backgroundColor: `${task.b_completed && 'rgb(206, 245, 203, 0.4)'}`}} className='mb-1'>
            <CardBody style={{width: '100%'}} className='py-3 px-3'>
                <Row style={{width: '100%'}}>
                    <Col md='1' lg='1'>
                        {
                            task.b_completed ?
                            <i className={`far fa-check-circle text-success`} style={{fontSize: '20px'}} onClick={() => updateTaskCompletion(task.id, task.b_completed)}></i> :
                            <i className={`far ${icon}`} onClick={() => updateTaskCompletion(task.id, task.b_completed)} onMouseEnter={() => setIcon('fa-check-circle incomplete-task')} onMouseLeave={() => setIcon('fa-circle')} style={{fontSize: '20px'}}></i>
                        }
                    </Col>
                    <Col md='10' lg='10' className='pl-0' onClick={() => setEditTaskId(task.id)}>
                        {
                            editTaskId === task.id ? 
                            <form onSubmit={(e) => editTask(e)}>
                                <input style={{width: '100%', border: 'none'}} value={editTaskName} onChange={(e) => setEditTaskName(e.target.value)} ref={focusRef} /> 
                            </form> :
                            <h6 className='mb-0'>{task.s_task_name}</h6>
                        }
                    </Col>

                    <Col md='1' lg='1' className='px-0'>
                    <ReactTooltip />
                        <i className="far fa-calendar-alt mr-0" style={{fontSize: '20px'}}></i>
                        <i onClick={() => deleteTask(task.id)} className="far fa-trash-alt delete-task ml-3" style={{fontSize: '20px'}}></i>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}

export default Task;