import React, { useState, useEffect } from 'react';
import {Row, Col, Table, Card, CardBody, CardTitle, CardText} from 'reactstrap';

const AddTask = ({
    addTaskName,
    setAddTaskName,
    addTask,
    focusRef,
    edit,
    setEdit
}) => {

    // const [edit, setEdit] = useState(false);

    return (
        <Card style={{borderRadius: '10px',width: '90%', opacity: `${edit ? '1' : '0.7'}`}} className='mb-1' onClick={() => setEdit(true)}>
            <CardBody style={{width: '100%'}} className='py-3 px-3'>
                <Row style={{width: '100%'}}>
                    <Col md='1' lg='1'>
                        <i className="far fa-circle" style={{fontSize: '20px'}}></i>
                    </Col>
                    <Col md='10' lg='10'>
                        {
                            edit ? 
                            <form onSubmit={(e) => addTask(e)}>
                                <input style={{width: '100%', border: 'none'}} value={addTaskName} onChange={(e) => setAddTaskName(e.target.value)} ref={focusRef} />
                            </form> :
                            <h6 className='mb-0'>Add...</h6>
                        }
                    </Col>

                    <Col md='1' lg='1' className='px-0'>
                        <i className="far fa-calendar-alt mr-0" style={{fontSize: '20px'}}></i>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}

export default AddTask;