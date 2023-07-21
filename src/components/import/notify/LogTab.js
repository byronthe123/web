import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactTable from '../../custom/ReactTable';
import logMapping from './logMapping';
import { Card, CardBody, Col, Label, FormGroup, Input, Button, Row } from 'reactstrap';
import PulseLoader from 'react-spinners/PulseLoader';

import ModalViewLogEmail from './ModalViewLogEmail';
import { asyncHandler } from '../../../utils';
import moment from 'moment';

export default function LogTab ({
    user,
    baseApiUrl,
    headerAuthCode,
    runLogQuery,
    createSuccessNotification
}) {

    const [logData, setLogData] = useState([]);
    const [modalViewEmail, setModalViewEmail] = useState(false);
    const [s_email_message, set_s_email_message] = useState(null);
    const [selectedNotificationRecord, setSelectedNotificationRecord] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (runLogQuery) {
            const s_unit = user && user.s_unit;

            const selectAllNotitifactionLogs = async () => {
                const response = await axios.get(`${baseApiUrl}/selectAllNotitifactionLogs/${s_unit}`, {
                    headers: {
                        'Authorization': `Bearer ${headerAuthCode}`
                    }
                });
                setLogData(response.data);
                setIsLoading(false);
            }

            selectAllNotitifactionLogs();
        }   
    }, [runLogQuery, user]);

    const handleSelectItem = (item) => {
        const { s_notification_type } = item;
        if (s_notification_type === 'EMAIL' || s_notification_type === 'PHONE') {
            set_s_email_message(item.s_email_message);
            setModalViewEmail(true);
            setSelectedNotificationRecord(item);    
        }
    }

    const forwardEmail = async () => {
        const userRequested = user && user.s_email;
        try {
            const response = await axios.post(`${baseApiUrl}/forwardNotificationEmail`, {
                userRequested,
                selectedNotificationRecord
            }, {
                headers: {'Authorization': `Bearer ${headerAuthCode}`}
            });
    
            if (response.status === 200) {
                createSuccessNotification('Email forwarded to you');
            }
        } catch (err) {
            alert(err);
        }
    }

    const resendNotificationEmail = async () => {
        const now = moment().local().format('MM/DD/YYYY HH:mm');
        const updateData = {
            t_created: now, 
            s_created_by: user.s_email, 
            t_modified: now, 
            s_modified_by: user.s_email,
            s_emails_from: user.s_email
        }
        try {
            const response = await axios.post(`${baseApiUrl}/resendNotificationEmail`, {
                selectedNotificationRecord,
                updateData
            }, {
                headers: {'Authorization': `Bearer ${headerAuthCode}`}
            });
    
            if (response.status === 200) {
                createSuccessNotification('Email resent');
            }
        } catch (err) {
            alert(err);
        }
    }

    const [s_mawb, set_s_mawb] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);

    const searchNotificationLogs = asyncHandler(async() => {
        const res = await axios.post(`${baseApiUrl}/searchNotificationLogs`, {
            data: {
                s_mawb,
                s_unit: user.s_unit
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        setSearchData(res.data);
        setDisplaySearchData(true);
    });

    useEffect(() => {
        if (s_mawb.length === 0) {
            setDisplaySearchData(false);
        }
    }, [s_mawb]);

    return (
        <div>
            <Card>
                <CardBody className='custom-opacity-card'>
                    <FormGroup>
                        <Label className={'d-inline'}>Search: </Label>
                        <Input type='text' className={'d-inline ml-2'} value={s_mawb} onChange={(e) => set_s_mawb(e.target.value)} style={{ width: '200px' }} />
                        <Button className={'d-inline ml-2'} onClick={() => searchNotificationLogs()}>Search</Button>
                    </FormGroup>
                    <Row>
                        <Col md={12}>
                            <ReactTable 
                                data={displaySearchData ? searchData : logData}
                                mapping={logMapping}
                                index={true}
                                handleClick={handleSelectItem}
                                customPagination={true}
                                numRows={10}
                                customHeight={'calc(100vh - 310px)'}
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <ModalViewLogEmail 
                open={modalViewEmail}
                handleModal={() => setModalViewEmail(!modalViewEmail)}
                s_email_message={s_email_message}
                forwardEmail={forwardEmail}
                resendNotificationEmail={resendNotificationEmail}
                selectedNotificationRecord={selectedNotificationRecord}
            />
        </div>
    );
}