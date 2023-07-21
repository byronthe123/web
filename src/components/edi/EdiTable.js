import React, { Component, Fragment, useState, useEffect, useRef  } from 'react';
import moment from 'moment';
import { api, asyncHandler } from '../../utils';

import { Input, Row, Col, Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import ReactTable from '../custom/ReactTable';
import AddButton from '../custom/AddButton';
import ModalSaveFfm from './ModalSaveFfm';

const EdiTable = ({
    user,
    s_type,
    s_table,
    fieldsMapping,
    triggerIndex,
    setLoading
}) => {

    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(moment().subtract(30, 'days').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
    const [modalSaveFfm, setModalSaveFfm] = useState(false);

    useEffect(() => {
        const getData = asyncHandler(async() => {
            setLoading(true);
            const s_unit = user.s_unit;  
    
            const res = await api('post', 'getEdiData', {
                s_unit,
                s_table,
                d_start_date: startDate,
                d_end_date: endDate
            });
    
            const { data } = res
            setData(data);
            setLoading(false);
        });
        if (user && user.s_unit && s_type) {
            getData();
        }
    }, [user.s_unit, s_type, startDate, endDate]);


    return (
        <Row>
            <Col md='12' lg='12' className='px-3'>
                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                    <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                        <Row>
                            <Col md='12' lg='12'>
                                <div className={'float-left'}>
                                    <h4 className='d-inline mr-2'>Start Date</h4>
                                    <Input className='d-inline mr-4' type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '200px' }} />
                                    <h4 className='d-inline mr-2'>End Date</h4>
                                    <Input className='d-inline mr-4' type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '200px' }} />
                                    <h4 className='d-inline'>{data.length} records</h4>
                                </div>
                                <div className={'float-right'}>
                                    <AddButton 
                                        enableAdd={true}
                                        handleAdd={() => setModalSaveFfm(true)}
                                    />
                                </div> 
                            </Col>
                        </Row>
                        {/* <Row className='my-2'>
                            <Col md='12' lg='12'>
                                <h4 className='mr-2 d-inline'>Search for AWB not listed:</h4>
                                <Input type='text' className='d-inline' value={formatMawb(s_mawb)} onChange={(e) =>set_s_mawb(e.target.value)} style={{ width: '200px' }} />
                                <Button className='d-inline'>Submit</Button>
                            </Col>
                        </Row> */}
                        <Row className='mt-4 mb-0' style={{fontWeight: 'bold', fontSize: '14px'}}>
                            <Col md='12' lg='12'>
                                <ReactTable 
                                    data={data}
                                    mapping={fieldsMapping}
                                    index={true}
                                    customPagination={true}
                                    numRows={10}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
            <ModalSaveFfm 
                modal={modalSaveFfm}
                setModal={setModalSaveFfm}
                setLoading={setLoading}
                s_table={s_table}
            />
        </Row>
    );
}

export default EdiTable;