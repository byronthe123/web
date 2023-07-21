import React, { useState, useEffect } from 'react';
import ReactTable from '../../../components/custom/ReactTable';
import { Row, Col, Input, Button } from 'reactstrap';
import moment from 'moment';
import axios from 'axios';

import statusOptions from './statusOptions';
import ModalCounterMoney from './ModalCounterMoney';
import tableMapping from './tableMapping';

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

    const [counterMoneyData, setCounterMoneyData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState(moment().subtract(30, 'days').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
    const [modal, setModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [selectedOption, setSelectedOption] = useState(statusOptions[0]);
    
    useEffect(() => {
        const getCounterMoney = asyncHandler(async () => {
            const res = await axios.post(`${baseApiUrl}/getCounterMoney`, {
                data: {
                    s_unit: user.s_unit,
                    startDate,
                    endDate
                }
            }, {
                headers: {
                    Authorization: `Bearer ${headerAuthCode}`
                }
            });

            const { data } = res;
            setCounterMoneyData(data);
            const filteredData = data.filter(d => d.s_status === selectedOption);
            setFilteredData(filteredData);
        });
        if (user && user.s_unit) {
            getCounterMoney();
        }
    }, [user, startDate, endDate]);


    const handleViewItem = (item) => {
        setSelectedItem(item);
        setModal(true);
    }

    const updateCounterMoney = asyncHandler(async(values) => {
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const { s_email } = user && user;

        const data = values;
        data.i_id = selectedItem.i_id;
        data.t_modified = now;
        data.s_modified_by = s_email;
        data.s_unit = user && user.s_unit;

        if (values.s_status === 'RECEIVED') {
            data.t_received_date = now;
            data.s_received_by = s_email;
            data.b_received = true;
        } else if (values.s_status === 'NOT RECEIVED') {
            data.b_received = false;
        }

        const res = await axios.put(`${baseApiUrl}/updateCounterMoney`, {
            data
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        updateLocalValue(counterMoneyData, setCounterMoneyData, selectedItem.i_id, res.data, 'i_id');
        setModal(false);
    });

    useEffect(() => {
        const data = counterMoneyData.filter(d => d.s_status === selectedOption);
        setFilteredData(data);
    }, [counterMoneyData, selectedOption]);

    return (
        <Row className='px-3 py-3'>
            <Col md='12' lg='12'>
                <Row>
                    <Col md={12}>
                        <Input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} className='d-inline mr-2' style={{ width: '200px' }} />
                        <h4 className='d-inline'>to</h4>
                        <Input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} className='d-inline ml-2' style={{ width: '200px' }} />
                        <h4 className='d-inline ml-4'>{counterMoneyData.length} Records Total</h4>
                    </Col>
                </Row>
                <Row className='my-3'>
                    <Col md={12}>
                        {
                            statusOptions.map((o, i) =>
                                <Button 
                                    key={i} 
                                    active={selectedOption === o} 
                                    onClick={() => setSelectedOption(o)}
                                    className='mr-2'
                                >
                                    {o}
                                </Button>
                            )
                        }
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <ReactTable 
                            data={filteredData}
                            mapping={tableMapping}
                            index={true}
                            enableClick={true}
                            handleClick={(item) => handleViewItem(item)}
                        />
                    </Col>
                </Row>
            </Col>

            <ModalCounterMoney 
                modal={modal}
                setModal={setModal}
                item={selectedItem}
                updateCounterMoney={updateCounterMoney}
            />
        </Row>
    );
}