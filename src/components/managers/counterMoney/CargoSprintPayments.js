import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Label } from 'reactstrap';
import ReactTable from '../../custom/ReactTable';
import axios from 'axios';
import csPaymentsTable from './csPaymentsTable';

export default ({
    user,
    baseApiUrl,
    headerAuthCode,
    eightyWindow,
    createSuccessNotification,
    asyncHandler,
    updateLocalValue,
    addLocalValue,
    deleteLocalValue   
}) => {
    
    const [foundPayments, setFoundPayments] = useState([]);
    const [s_awb, set_s_awb] = useState('');
    const [s_hawb, set_s_hawb] = useState('');

    const searchCargoSprintPayments = asyncHandler(async(s_type) => {
        const res = await axios.post(`${baseApiUrl}/searchCargoSprintPayments`, {
            data: {
                s_search_value: s_type === 's_awb' ? s_awb : s_hawb,
                s_type,
                s_unit: user && user.s_unit
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        setFoundPayments(res.data);
    });

    return (
        <Row className='mx-4'>
            <Col md={12}>
                <Row>
                    <Col md={12}>
                        <Row className='mb-2'>
                            <Col md={1}>
                                <Label className='d-inline mr-2'>Search by AWB</Label>
                            </Col>
                            <Col md={2}>
                                <Input type='text' value={s_awb} onChange={(e) => set_s_awb(e.target.value)} style={{ width: '200px' }} className='d-inline' />
                            </Col>
                            <Col md={2}>
                                <Button disabled={s_awb.length < 11} onClick={() => searchCargoSprintPayments('s_awb')}>Search</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={1}>
                                <Label className='d-inline mr-2'>Search by HAWB</Label>
                            </Col>
                            <Col md={2}>
                                <Input type='text' value={s_hawb} onChange={(e) => set_s_hawb(e.target.value)} style={{ width: '200px' }} className='d-inline' />
                            </Col>
                            <Col md={2}>
                                <Button disabled={s_hawb.length < 3} onClick={() => searchCargoSprintPayments('s_hawb')}>Search</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col md={12} className='mt-2'>
                <ReactTable 
                    data={foundPayments}
                    mapping={csPaymentsTable}
                    index={true}
                />
            </Col>
        </Row>
    );
}
