import React, { useState, useEffect, useContext } from 'react';
import { Row, Col } from 'reactstrap';
import styled from 'styled-components';
import moment from 'moment';
import uuidv4 from 'uuid/v4';

import { AppContext } from '../../../context';
import VirtualTable from '../../custom/VirtualTable';
import Card from '../../custom/Card';
import { INotificationEmail, INotificationName, INotificationPhone } from '../../../globals/notificationInterfaces';
import { IFWB, IMap, IUser } from '../../../globals/interfaces';
import { api, updateLocalValue, deleteLocalValue, addLocalValue } from '../../../utils';
import ModalCreateRecord from './ModalCreateRecord';
import ModalUpdateRecord from './ModalUpdateRecord'; 
import ModalDeleteRecord from './ModalDeleteRecord'; 

type Type = 'company' | 'name' | 'email' | 'phone';
type Action = 'delete' | 'update';

interface Props {
    user: IUser;
    companyData: Array<INotificationName>;
    setCompanyData: (companyData: any) => void;
    emailData: Array<INotificationEmail>;
    setEmailData: (emailData: any) => void;
    phoneData: Array<INotificationPhone>;
    setPhoneData: (phoneData: any) => void;
    selectedCompany: INotificationName;
    setSelectedCompany: (company: any) => void;
    blacklist: Array<any>;
    wizardNext: boolean;
    onClickNext: () => any;
    fwbData?: IFWB;
}

export default function ManageNotificationData ({
    user,
    companyData,
    setCompanyData,
    emailData,
    setEmailData,
    phoneData,
    setPhoneData,
    selectedCompany,
    setSelectedCompany,
    fwbData,
    blacklist,
    wizardNext,
    onClickNext
}: Props) {

    const { createSuccessNotification } = useContext(AppContext);

    // Create Modal
    const [createValue, setCreateValue] = useState('');
    const [modalCreateType, setModalCreateType] = useState<Type>('name');
    const [modalCreateRecordOpen, setModalCreateRecordOpen] = useState(false);

    const handleModalCreateRecord = (type: Type) => {
        setModalCreateType(type);
        setModalCreateRecordOpen(true);
        setCreateValue('');
    }

    const handleCreateRecord = async () => {
        //For all:
        const email = user && user.s_email;
        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        const useCreateValue = createValue && createValue.toUpperCase();

        const data = {
            t_created: now,
            s_created_by: email,
            t_modified: now,
            s_modified_by: email,
            s_unit: user.s_unit,
            s_guid: ''
        }
        
        //Conditional:
        if (modalCreateType === 'company') {
            data.s_guid = uuidv4();
        } else {
            data.s_guid = selectedCompany.s_guid;
            // @ts-ignore
            data.i_record = selectedCompany.i_record;
        }

        let url = '';
        let notification = '';
        
        //Only for create company:
        if (modalCreateType === 'company') {
            // @ts-ignore
            data.s_name = useCreateValue;
            url = 'createNewNotificationCompany';
            notification = 'New Company Record Created';
        } else if (modalCreateType === 'name') {
            // @ts-ignore
            data.s_name = useCreateValue;
            url = 'addNotificationCompanyName';
            notification = 'Company Name Added';
        } else if (modalCreateType === 'email') {
            // @ts-ignore
            data.s_email = useCreateValue;
            url = 'addNotificationCompanyEmail';
            notification = 'Company Email Added';
        } else {
            // @ts-ignore
            data.s_phone = useCreateValue;
            url = 'addNotificationCompanyPhone';
            notification = 'Company Phone Number Added';
        }

        const res = await api('post', url, {data});

        if (res.status === 200) {
            createSuccessNotification(notification);

            const addedValue = res.data[0];

            if (modalCreateType === 'company' || modalCreateType === 'name') {
                addLocalValue(companyData, setCompanyData, addedValue);
            } else if (modalCreateType === 'email') {
                addLocalValue(emailData, setEmailData, addedValue);
            } else {
                addLocalValue(phoneData, setPhoneData, addedValue);
            }

            setCreateValue('');
            setModalCreateRecordOpen(false);
            
            if (selectedCompany && selectedCompany.id) {
                const company = companyData.find(c => c.id === selectedCompany.id);
                setSelectedCompany(company);
            }

        } else {
            alert('Error creating record');
        }
    }

    // Edit Modal
    const [selectedItem, setSelectedItem] = useState({});
    const [updateAction, setUpdateAction] = useState('');
    const [updateType, setUpdateType] = useState<Type>('name');
    const [updateId, setUpdateId] = useState(0);
    const [initialValue, setInitialValue] = useState('');
    const [updateValue, setUpdateValue] = useState('');
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

    const handleModalLaunchUpdateRecord = (type: Type, action: Action, item: any, id: number, initialValue: string) => {
        setSelectedItem(item);
        setUpdateAction(action);
        setUpdateType(type);
        setUpdateId(id);
        setInitialValue(initialValue);
        setUpdateValue(initialValue);
        setModalUpdateOpen(true);
    }

    const launchModalDeleteRecord = () => {
        setUpdateAction('delete');
        setModalDeleteOpen(true);
    }

    const properCase = (string: string) => {
        const stringArray = Array.from(string);
        stringArray[0] = stringArray[0].toUpperCase();
        return stringArray.toString().replace(/,/g, '');
    }

    const handleUpdateRecord = async () => {
        //action options: delete, update
        //types: company, email, phone
        //updateValue
        const useUpdateValue = updateValue && updateValue.toUpperCase();
        const s_name = useUpdateValue;

        const action = updateAction;
        const type = properCase(updateType);
        const lowerCaseType = updateType.toLowerCase();
        const id = updateId;
    
        let endpoint = `${action}Notification${type}`;
        let data: IMap<any> = {
            s_unit: user && user.s_unit,
            s_modified_by: user.s_email,
            t_modified: moment().local().format('MM/DD/YYYY HH:mm')
        };
        let notification = '';
    
        if (action === 'delete') {
            if (lowerCaseType === 'company' || lowerCaseType === 'name') {
                endpoint = `${action}NotificationCompanyOrName`;
            }
    
            data.id = id;
            data.s_name = s_name;
            notification = `${type} deleted.`;
        } else { 
            //action === 'update'
            data.s_modified_by = user.s_email;
            data.t_modified = moment().local().format('MM/DD/YYYY HH:mm');

            if (lowerCaseType === 'company' || lowerCaseType === 'name') {
                endpoint = `${action}NotificationCompanyOrName`;

                data.id = id;
                data.s_name = s_name;
                notification = `${type} updated.`;
            } else if (lowerCaseType === 'email') {
                const s_email = useUpdateValue;

                data.id = id;
                data.s_email = s_email;

                notification = `${type} updated.`;
    
            } else {
                const s_phone = useUpdateValue;
                data.id = id;
                data.s_phone = s_phone;
    
                notification = `${type} number updated.`;             
            }
        }
    
        await api('put', endpoint, {data});
        createSuccessNotification(notification);
        setModalUpdateOpen(false);
        setModalDeleteOpen(false);

        if (action === 'delete') {
            if (lowerCaseType === 'company' || lowerCaseType === 'name') {
                deleteLocalValue(companyData, setCompanyData, id);
            } else if (lowerCaseType === 'email') {
                deleteLocalValue(emailData, setEmailData, id);
            } else {
                deleteLocalValue(phoneData, setPhoneData, id);
            }
        } else {
            if (lowerCaseType === 'company' || lowerCaseType === 'name') {
                updateLocalValue(companyData, setCompanyData, id, data);
            } else if (lowerCaseType === 'email') {
                updateLocalValue(emailData, setEmailData, id, data);
            } else {
                updateLocalValue(phoneData, setPhoneData, id, data);
            }
        }
    }

    return (
        <>
            <CompanyInfoCardsContainer>
                <CompanyInfoCard>
                    <Row>
                        <Col md={12}>
                            <h4 style={{float: 'left'}}>Select Company Profile:</h4>
                            <i style={{float: 'right'}} className='fas fa-plus-square fa-plus-square-active' onClick={() => handleModalCreateRecord('company')}></i>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <VirtualTable 
                                data={companyData}
                                mapping={[
                                    {
                                        name: 'Name',
                                        value: 's_name',
                                        id: 'name'
                                    },
                                    {
                                        name: '',
                                        value: 'fas fa-edit',
                                        icon: true,
                                        function: (item: INotificationName) => handleModalLaunchUpdateRecord('name', 'update', item, item.id, item.s_name) 
                                    }
                                ]}
                                enableClick={true}
                                numRows={8}
                                locked={true}
                                customPagination={true}
                                customHeight={'500px'}
                                handleClick={setSelectedCompany}
                                defaultFiltered={[
                                    {
                                        id: 'name',
                                        value: fwbData ? fwbData.s_consignee_name1 : '',
                                    },
                                ]}
                                wizardNext={wizardNext}
                                onClickNext={onClickNext}
                            />
                        </Col>
                    </Row>
                </CompanyInfoCard>
                <CompanyInfoCard>
                    <Row>
                        <Col md={12}>
                            <h4 style={{float: 'left'}}>Possible Names:</h4>
                            <i style={{float: 'right'}} className={`fas fa-plus-square ${selectedCompany && 'fa-plus-square-active'}`} onClick={() => selectedCompany && handleModalCreateRecord('name')}></i>
                        </Col>                                
                    </Row>
                    <Row>
                        <Col md={12}>
                            <VirtualTable 
                                data={companyData && companyData.filter(d => selectedCompany && selectedCompany.s_guid === d.s_guid)}
                                mapping={[
                                    {
                                        name: 'Name',
                                        value: 's_name'
                                    },
                                    {
                                        name: '',
                                        value: 'fas fa-edit',
                                        icon: true,
                                        function: (item: INotificationName) => handleModalLaunchUpdateRecord('name', 'update', item, item.id, item.s_name)  
                                    }
                                ]}
                                enableClick={true}
                                numRows={8}
                                locked={true}
                                customPagination={true}
                                customHeight={'500px'}
                            />
                        </Col>
                    </Row>
                </CompanyInfoCard>
                <CompanyInfoCard>
                    <Row>
                        <Col md={12}>
                            <h4 style={{float: 'left'}}>Emails:</h4>
                            <i style={{float: 'right'}} className={`fas fa-plus-square ${selectedCompany && 'fa-plus-square-active'}`} onClick={() => selectedCompany && handleModalCreateRecord('email')}></i>
                        </Col>                                
                    </Row>
                    <Row>
                        <Col md={12}>
                            <VirtualTable 
                                data={emailData && emailData.filter(d => selectedCompany && selectedCompany.s_guid === d.s_guid)}
                                mapping={[
                                    {
                                        name: 'Email',
                                        value: 's_email'
                                    },
                                    {
                                        name: '',
                                        value: 'fas fa-edit',
                                        icon: true,
                                        function: (item: INotificationEmail) => handleModalLaunchUpdateRecord('email', 'update', item, item.id, item.s_email)  
                                    }
                                ]}
                                enableClick={true}
                                numRows={8}
                                locked={true}
                                customPagination={true}
                                customHeight={'500px'}
                            />
                        </Col>
                    </Row>
                </CompanyInfoCard>
                <CompanyInfoCard>
                    <Row>
                        <Col md={12}>
                            <h4 style={{float: 'left'}}>Phone Numbers:</h4>
                            <i style={{float: 'right'}} className={`fas fa-plus-square ${selectedCompany && 'fa-plus-square-active'}`} onClick={() => selectedCompany && handleModalCreateRecord('phone')}></i>
                        </Col>                                
                    </Row>
                    <Row>
                        <Col md={12}>
                            <VirtualTable 
                                data={phoneData && phoneData.filter(d => selectedCompany && selectedCompany.s_guid === d.s_guid)}
                                mapping={[
                                    {
                                        name: 'Phone Number',
                                        value: 's_phone'
                                    },
                                    {
                                        name: '',
                                        value: 'fas fa-edit',
                                        icon: true,
                                        function: (item: INotificationPhone) => handleModalLaunchUpdateRecord('phone', 'update', item, item.id, item.s_phone)   
                                    }
                                ]}
                                enableClick={true}
                                numRows={8}
                                locked={true}
                                customPagination={true}
                                customHeight={'500px'}
                            />
                        </Col>
                    </Row>
                </CompanyInfoCard>
            </CompanyInfoCardsContainer>

            <ModalCreateRecord 
                open={modalCreateRecordOpen}
                handleModal={() => setModalCreateRecordOpen(!modalCreateRecordOpen)}
                companyData={companyData}
                emailData={emailData}
                phoneData={phoneData}
                createValue={createValue} 
                setCreateValue={setCreateValue}
                modalCreateType={modalCreateType}
                handleCreateRecord={handleCreateRecord}
                selectedCompany={selectedCompany}
                blacklist={blacklist}
            />

            <ModalUpdateRecord 
                open={modalUpdateOpen}
                handleModal={() => setModalUpdateOpen(!modalUpdateOpen)}
                selectedItem={selectedItem}
                initialValue={initialValue}
                updateType={updateType}
                updateValue={updateValue}
                setUpdateValue={setUpdateValue}
                handleUpdateRecord={handleUpdateRecord}
                launchModalDeleteRecord={launchModalDeleteRecord}
                blacklist={blacklist}
            />

            <ModalDeleteRecord 
                open={modalDeleteOpen}
                handleModal={() => setModalDeleteOpen(!modalDeleteOpen)}
                updateType={updateType}
                updateValue={updateValue}
                handleUpdateRecord={handleUpdateRecord}
            />
        </>
    );
}

const CompanyInfoCardsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
`;

const CompanyInfoCardContainer = styled.div`
    flex: 1;
    min-width: 24%;

    @media (max-width: 1550px) {
        min-width: 32%;
    }

    @media (max-width: 1200px) {
        min-width: 49%;
    }
`;

const CompanyInfoCard = ({ children }: { children: React.ReactNode }) => {
    return (
        <CompanyInfoCardContainer>
            <Card>
                { children }
            </Card>
        </CompanyInfoCardContainer>
    );
}