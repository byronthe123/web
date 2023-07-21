import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, CardBody, Input } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';

import ReactTable from '../../custom/ReactTable';

export default ({
    baseApiUrl,
    headerAuthCode,
    user,
    createSuccessNotification
}) => {

    const [doors, setDoors] = useState([]);
    const [s_company, set_s_company] = useState('');
    const [s_dock_door, set_s_dock_door] = useState('');

    useEffect(() => {
        const selectStationDoors = async () => {
            const s_unit = user && user.s_unit;
            const response = await axios.get(`${baseApiUrl}/selectStationDoors/${s_unit}`, {
                headers: { 'Authorization': `Bearer ${headerAuthCode}` }
            });
            setDoors(response.data);
        }
        user && user.s_unit && selectStationDoors();
    }, [user.s_unit]);

    const reserveStationDoor = async () => {

        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const { email, office } = user && user;

        const data = {
            t_created: now,
            s_created_by: email,
            t_modified: now,
            s_modified_by: email,
            s_status: 'BUSY',
            s_unit: office,
            i_priority: 1,
            b_in_use: true,
            s_dock_door,
            s_guid: 1,
            s_company,
            s_driver: 'RESERVED'
        }

        const response = await axios.post(`${baseApiUrl}/reserveStationDoor`, {
            data
        }, {
            headers: { 'Authorization': `Bearer ${headerAuthCode}` }
        });

        if (response.status === 200) {
            setDoors(response.data);
            set_s_company('');
            createSuccessNotification('Door Reserved');
        } else {
            alert('error');
        }
    }

    const removeStationReservation = async (id) => {
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const { email, office } = user && user;

        const data = {
            id,
            s_unit: office,
            s_status: 'REMOVED',
            b_in_use: false,
            t_completed: now,
            s_completed_user: email,
            t_modified: now,
            s_modified_by: email
        }

        const response = await axios.post(`${baseApiUrl}/removeStationReservation`, {
            data
        }, {
            headers: { 'Authorization': `Bearer ${headerAuthCode}` }
        });

        setDoors(response.data);
        createSuccessNotification('Reservation Removed');
    }

    const mapping = [
        {
            name: 'ID',
            value: 'id'
        },
        {
            name: 'Door Num',
            value: 's_dock_door'
        },
        {
            name: 'Status',
            value: 's_status'
        },
        {
            name: 'Company',
            value: 's_company'
        },
        {
            name: 'Driver',
            value: 's_driver'
        },
        {
            name: 'Time',
            value: 't_created',
            datetime: true
        },
        {
            name: 'Created By',
            value: 's_created_by',
            email: true
        },
        {
            name: 'Remove',
            value: 'fas fa-trash',
            function: (item) => {
                removeStationReservation(item.id)
            },
            showCondition: (item) => {
                return item.b_in_use;
            },
            icon: true,
        },
    ];

    const enableSubmit = () => {
        return s_company.length > 0 && s_dock_door.length > 0;
    }

    return (
        <Row className='px-2 py-2'>
            <Col md={3}>
                <Card style={{borderRadius: '.75rem'}}>
                    <CardBody className='custom-card-transparent'>
                        <Row>
                            <h4 className='mr-2' style={{display: 'inline'}}>Select Door:</h4>
                            <select style={{display: 'inline'}} value={s_dock_door} onChange={(e) => set_s_dock_door(e.target.value)}>
                                <option></option>
                                {
                                    doors.map((d, i) => !d.b_in_use &&
                                        <option key={i}>{d.s_dock_door}</option>
                                    )
                                }
                            </select>
                        </Row>
                        <Row className='my-2'>
                            <h4>Enter Company/Reason:</h4>
                            <Input type='textarea' value={s_company} onChange={(e) => set_s_company(e.target.value)} />
                        </Row>
                        <Row>
                            <Button disabled={!enableSubmit()} onClick={() => reserveStationDoor()}>Reserve</Button>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
            <Col md={9} style={{height: '730px', overflowY: 'scroll'}}>
                <ReactTable 
                    data={doors}
                    mapping={mapping}
                    handleClick={null}
                    numRows={20}
                />
            </Col>
        </Row>
    );
}