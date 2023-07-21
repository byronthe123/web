import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import ReactTable from '../../custom/ReactTable';
import { addLocalValue, deleteLocalValue, asyncHandler } from '../../../utils';
import _ from 'lodash';

import ModalCreateRecord from './ModalCreateRecord';

export default function Profiles ({
    user,
    baseApiUrl,
    headerAuthCode,
    createSuccessNotification,
    companyData,
    setCompanyData,
    emailData,
    setEmailData,
    phoneData,
    setPhoneData,
    blacklist
}) {

    const s_unit = user && user.s_unit;
    const [s_name, set_s_name] = useState('');
    const [s_email, set_s_email] = useState('');
    const [s_phone, set_s_phone] = useState('');
    const [s_guid, set_s_guid] = useState('');
    const [selectedCompany, setSelectedCompany] = useState({});

    const handleSelectCompany = (company) => {
        setSelectedCompany(company);
        set_s_guid(company.s_guid);
    }

    const findData = (table, key, value) => {
        const data = table.filter(d => d[key] && d[key].toUpperCase().includes(value.toUpperCase()));
        if (data && data.length > 0) {
            set_s_guid(data[0].s_guid);
        } else {
            set_s_guid('');
        }
    }

    useEffect(() => {
        findData(companyData, 's_name', s_name);
    }, [s_name]);

    useEffect(() => {
        findData(emailData, 's_email', s_email);
    }, [s_email]);

    useEffect(() => {
        findData(phoneData, 's_phone', s_phone);
    }, [s_phone]);

    const renderMain = () => {
        if (s_email.length > 0 || s_phone.length > 0) {
            return companyData.filter(d => d.s_guid === s_guid);
        } else if (s_name.length > 0) {
            return companyData.filter(d => _.get(d, 's_name.toUpperCase()', '').includes(s_name || ''.toUpperCase()))
        } else if (s_name.length === 0) {
            return companyData;
        }
    }

    const clearInput = () => {
        set_s_name('');
        set_s_email('');
        set_s_phone('');
    }

    const deleteRecord = asyncHandler(async(type, id) => {
        let updateData, setUpdateData;

        if (type === 'NotificationCompanyOrName') {
            updateData = companyData;
            setUpdateData = setCompanyData;
        } else if (type === 'NotificationEmail') {
            updateData = emailData;
            setUpdateData = setEmailData;
        } else {
            updateData = phoneData;
            setUpdateData = setPhoneData;
        }

        await axios.put(`${baseApiUrl}/delete${type}`, {
            data: {
                id,
                s_unit
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });
        deleteLocalValue(updateData, setUpdateData, id);
        createSuccessNotification('Record deleted');
    });

    const createNewNotificationCompany = asyncHandler(async() => {
        await axios.post(`${baseApiUrl}/createNewNotificationCompany`, {
            data: {
                t_created: moment().local().format('MM/DD/YYYY HH:mm:ss'),
                s_created_by: user.email,
                t_modified: moment().local().format('MM/DD/YYYY HH:mm:ss'),
                s_modified_by: user.email,
                s_unit,
                s_guid: '',
                s_name: ''
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        })
    });

    // Create Record:
    const [modal, setModal] = useState(false);
    const [createValue, setCreateValue] = useState('');
    const [modalCreateType, setModalCreateType] = useState('');

    const startCreateRecord = (type) => {
        setModalCreateType(type);
        setModal(true);
    }

    const handleCreateRecord = asyncHandler(async() => {

        //For all:
        const email = user && user.s_email;
        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        const useCreateValue = createValue && createValue.toUpperCase();

        const data = {
            t_created: now,
            s_created_by: email,
            t_modified: now,
            s_modified_by: email,
            s_unit: user && user.s_unit
        }
        
        //Conditional:
        if (modalCreateType === 'record') {
            data.s_guid = uuidv4();
        } else {
            data.s_guid = selectedCompany.s_guid;
            data.i_record = selectedCompany.i_record;
        }

        let url = '';
        let notification = '';
        let updateDataFunction = null;
        let dataSet = [];
        
        //Only for create company:
        if (modalCreateType === 'record') {
            data.s_name = useCreateValue;
            url = 'createNewNotificationCompany';
            notification = 'New Company Record Created';
            dataSet = companyData;
            updateDataFunction = setCompanyData;
        } else if (modalCreateType === 'name') {
            data.s_name = useCreateValue;
            url = 'addNotificationCompanyName';
            notification = 'Company Name Added';
            dataSet = companyData;
            updateDataFunction = setCompanyData;
        } else if (modalCreateType === 'email') {
            data.s_email = useCreateValue;
            url = 'addNotificationCompanyEmail';
            notification = 'Company Email Added';
            dataSet = emailData;
            updateDataFunction = setEmailData;
        } else {
            data.s_phone = useCreateValue;
            url = 'addNotificationCompanyPhone';
            notification = 'Company Phone Number Added';
            dataSet = phoneData;
            updateDataFunction = setPhoneData;
        }

        const response = await axios.post(`${baseApiUrl}/${url}`, {
            data
        },  {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        });

        if (response.status === 200) {
            createSuccessNotification(notification);

            const addedValue = response.data[0];

            if (modalCreateType === 'record' || modalCreateType === 'name') {
                addLocalValue(companyData, setCompanyData, addedValue);
            } else if (modalCreateType === 'email') {
                addLocalValue(emailData, setEmailData, addedValue);
            } else {
                addLocalValue(phoneData, setPhoneData, addedValue);
            }

            setCreateValue('');
            setModal(false);
            
            if (selectedCompany && selectedCompany.id) {
                const company = companyData.find(c => c.id === selectedCompany.id);
                setSelectedCompany({});
                setSelectedCompany(company);
            }

        }
    });

    return (
        <Row>
            <Col md={12}>
                <Row>
                    <Col md={4}>
                        <FormGroup>
                            <Label>Company Name</Label>
                            <Input type='text' value={s_name} onChange={(e) => set_s_name(e.target.value)} onFocus={() => clearInput()} />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label>Company Email</Label>
                            <Input type='text' value={s_email} onChange={(e) => set_s_email(e.target.value)} onFocus={() => clearInput()} />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label>Company Phone</Label>
                            <Input type='text' value={s_phone} onChange={(e) => set_s_phone(e.target.value)} onFocus={() => clearInput()} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Button className={'mb-1'} onClick={() => startCreateRecord('record')}>Create New Company</Button>
                        <ReactTable 
                            data={renderMain()}
                            mapping={[
                                {
                                    name: 'ID',
                                    value: 'i_record',
                                    smallWidth: true
                                },
                                {
                                    name: 'Company Name',
                                    value: 's_name'
                                },
                                {
                                    name: '',
                                    value: 'fal fa-trash',
                                    icon: true,
                                    function: (item) => deleteRecord('NotificationCompanyOrName', item.id)
                                }
                            ]}
                            enableClick={true}
                            handleClick={(item) => handleSelectCompany(item)}
                            numRows={10}
                        />
                    </Col>
                    <Col md={3}>
                        <Button 
                            className={'mb-1'} 
                            onClick={() => startCreateRecord('name')}
                            disabled={!selectedCompany.id}
                        >
                            Add Name
                        </Button>
                        <ReactTable 
                            data={companyData.filter(d => d.s_guid === s_guid)}
                            mapping={[
                                {
                                    name: 'Possible Names',
                                    value: 's_name'
                                },
                                {
                                    name: '',
                                    value: 'fal fa-trash',
                                    icon: true,
                                    function: (item) => deleteRecord('NotificationCompanyOrName', item.id)
                                }
                            ]}
                            numRows={10}
                        />
                    </Col>
                    <Col md={3}>
                        <Button 
                            className={'mb-1'} 
                            onClick={() => startCreateRecord('email')}
                            disabled={!selectedCompany.id}
                        >
                            Add Email
                        </Button>                        
                        <ReactTable 
                            data={emailData.filter(d => d.s_guid === s_guid)}
                            mapping={[
                                {
                                    name: 'Emails',
                                    value: 's_email'
                                },
                                {
                                    name: '',
                                    value: 'fal fa-trash',
                                    icon: true,
                                    function: (item) => deleteRecord('NotificationEmail', item.id)
                                }
                            ]}
                            numRows={10}
                        />
                    </Col>
                    <Col md={2}>
                        <Button 
                            className={'mb-1'} 
                            onClick={() => startCreateRecord('phone')}
                            disabled={!selectedCompany.id}
                        >
                            Add Phone Number
                        </Button>                        
                        <ReactTable 
                            data={phoneData.filter(d => d.s_guid === s_guid)}
                            mapping={[
                                {
                                    name: 'Phone',
                                    value: 's_phone'
                                },
                                {
                                    name: '',
                                    value: 'fal fa-trash',
                                    icon: true,
                                    function: (item) => deleteRecord('NotificationPhone', item.id)
                                }
                            ]}
                            numRows={10}
                        />
                    </Col>
                </Row>
            </Col>
            <ModalCreateRecord 
                open={modal}
                handleModal={setModal}
                createValue={createValue}
                setCreateValue={setCreateValue}
                modalCreateType={modalCreateType}
                handleCreateRecord={handleCreateRecord}
                companyData={companyData}
                emailData={emailData}
                phoneData={phoneData}
                selectedCompany={selectedCompany}
                blacklist={blacklist}
            />
        </Row>
    );
}