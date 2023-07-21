import React, { useState, useEffect, useContext, useMemo  } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { Button, Row, Col, Card, CardBody } from 'reactstrap';
import classnames from 'classnames';
import { Formik } from 'formik';
import Tour from 'reactour';
import styled from 'styled-components';
import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';

import { AppContext } from '../../../context/index';
import CompanyCard from './CompanyCard';
import ModalViewCompany from './ModalViewCompany';
import MyAssignment from './MyAssignment';
import ActiveUser from './ActiveUser';
import ModalAddDriver from './ModalAddDriver';
import CustomerDetails from './CustomerDetails';
import ModalTestRecords from './ModalTestRecords';
import ModalReject from './ModalReject';
import ManagerView from './ManagerView';
import useBreakpoint from '../../../customHooks/useBreakpoint';
import useLoading from '../../../customHooks/useLoading';
import useQueueData from './useQueueData';
import Stats from './Stats';

import { ICompany, SelectedTypeOptions } from './interfaces';
import { IMap, IQueue, ISelectOption } from '../../../globals/interfaces';
import { defaultCompany } from './defaults';
import { defaultSelectOption, queueRecord } from '../../../globals/defaults';

import { renderActiveQueueUser } from './utils';
import Layout from '../../../components/custom/Layout';
import { notify } from '../../../utils';

const { asyncHandler, api } = require('../../../utils');
const baseApiUrl = process.env.REACT_APP_BASE_API_URL;
const headerAuthCode = process.env.REACT_APP_HEADER_AUTH_CODE;

const renderCompany = (company: ICompany, selectedType: string) => {
    if (selectedType === 'EXPORT') {
        return company.exportCount > 0 && !company.s_state.includes('TRANSFER');
    } else if (selectedType === 'IMPORT') {
        return company.importCount > 0 && !company.s_state.includes('TRANSFER');
    } else if (selectedType === 'TRANSFERS') {
        return company.s_state.includes('TRANSFER');
    } else {
        return company.exportCount > 0 || company.importCount > 0;
    }
}

const Queue = () => {

    const { user, socket, searchAwb } = useContext(AppContext);
    const { activeUsers } = socket;
    const { handleSearchAwb } = searchAwb;
    const { setLoading } = useLoading();
    const companyTypes: Array<SelectedTypeOptions> = [ 'ALL', 'IMPORT', 'EXPORT', 'TRANSFERS'];
    const {
        companiesList,
        firstWaitingId,
        processingAgentsMap,
        accessToken,
        myAssignmentCompany,
        initialValues,
        stats,
        setQueueData,
        initializeValues
    } = useQueueData(user.s_email, user.s_unit);

    const [modal, setModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<ICompany>(defaultCompany);
    const [selectedType, setSelectedType] = useState<SelectedTypeOptions>('ALL');
    const [customerFrequency, setCustomerFrequency] = useState(0);
    const [modalAddDriver, setModalAddDriver] = useState(false);
    const [modalReject, setModalReject] = useState(false);
    const [rejectReason, setRejectReason] = useState<ISelectOption>(defaultSelectOption);
    const [rejectAwb, setRejectAwb] = useState<IQueue>(queueRecord);
    const [modalManagerView, setModalManagerView] = useState(false);
    const [s_notes, set_s_notes] = useState('');
    const { breakpoint } = useBreakpoint();

    const renderCompanies = useMemo(() => {
        const waitingCompanies = [], processingCompanies = [];
        for (let i = 0; i < companiesList.length; i++) {
            const currentCompany = companiesList[i];
            const { s_status } = currentCompany;
            if (renderCompany(currentCompany, selectedType)) {
                if (s_status === 'WAITING') {
                    waitingCompanies.push(currentCompany);
                } else if (s_status === 'DOCUMENTING') {
                    processingCompanies.push(currentCompany);
                }
            }
        }
        return {
            waitingCompanies,
            processingCompanies
        }
    }, [companiesList, selectedType]);

    const waitingCustomers = useMemo(() => {
        for (let i = 0; i < companiesList.length; i++) {
            if (companiesList[i].s_status === 'WAITING') {
                return true;
            }
        }
        return false;
    }, [companiesList]);

    const viewCompany = (company: ICompany) => {
        setSelectedCompany(company);
        setModal(true);
        setTimeout(() => {
            setStep(1);
        }, 1000);
    }

    const viewMyAssignmentCompany = (company: ICompany) => {
        setSelectedCompany(company);
        const { s_state } = company;
        if (s_state === 'MIXED') {
            setSelectedType('ALL');
        } else if (s_state.includes('TRANSFER')) {
            setSelectedType('TRANSFERS');
        } else if (s_state === 'EXPORT' || s_state === 'IMPORT') {
            setSelectedType(s_state);
        }
        setModal(true);
    }

    const isMyAssignment = (awb: IQueue) => {
        const { s_counter_ownership_agent, s_status } = awb;
        if (s_counter_ownership_agent && user && s_status === 'DOCUMENTING') {
            return s_counter_ownership_agent.toUpperCase() === user.s_email.toUpperCase();
        }
        return false;
    }

    const takeOwnership = asyncHandler(async(
        selectedCompany: ICompany, 
        selectedType: SelectedTypeOptions, 
        useEmail: string
    ) => {
        const s_unit = user.s_unit;
        const fullName = user.displayName;
        const nameArray = fullName.split(' ');
        const agentName = nameArray[0];
        const t_counter_ownership = moment().local().format('MM/DD/YYYY HH:mm:ss');
        const { s_transaction_id, s_trucking_company, s_trucking_driver, s_trucking_cell, b_trucking_sms } = selectedCompany;
        
        if (useEmail && useEmail !== null && useEmail.length > 0 && useEmail.toUpperCase().includes('@')) {
            
            const body = {
                s_transaction_id,
                s_counter_ownership_agent: useEmail,
                s_type: selectedCompany.s_state.includes('TRANSFER') ? selectedCompany.s_state : selectedType,
                t_counter_ownership,
                s_unit,
                s_trucking_company, 
                s_trucking_driver, 
                s_trucking_cell, 
                b_trucking_sms, 
                agentName,
                assignEmail: (!selectedCompany.firstWaitingCo) && (useEmail !== user.s_email),
                assignedBy: user.s_email,
                firstWaitingId,
                selectedCompanyId: selectedCompany.awbs[0].id
            }

            const res = await api('put', 'takeOwnership', body, true, user);

            if (res.status === 200) {
                setQueueData(res.data);
                setModal(false);
                setStep(2);

                if (s_transaction_id !== localStorage.getItem('s_transaction_id')) {
                    ['s_driver_name', 's_driver_id_type', 't_driver_id_expiration', 's_driver_id_number', 'b_driver_id_match_photo'].map(key => {
                        localStorage.removeItem(key);
                    });
                }
            }

        }
    });

    const removeCompanyOwnership = asyncHandler(async() => { 
        if (user && user.s_email.length > 0) {
            const now = moment().local().format('MM/DD/YYYY HH:mm:ss');

            const res = await axios.put(`${baseApiUrl}/removeCompanyOwnership`, {
                s_transaction_id: selectedCompany.s_transaction_id,
                s_modified_by: user.s_email,
                t_modified: now,
                s_unit: user.s_unit,
                s_type: selectedType
            }, {
                headers: {
                    'Authorization': `Bearer ${headerAuthCode}`
                }
            });
    
            setQueueData(res.data);
            
            setModal(false);
        } 
    });

    const markLeftEarly = asyncHandler(async(selectedCompany: ICompany) => {
        let agent = null;

        if (user && user.s_email && user.s_email.length > 0) {
            agent = user.s_email;
        }

        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        const t_modified = now;
        const s_modified_by = agent;
        const s_status = 'LEFT EARLY';
        const { s_transaction_id } = selectedCompany;
        const s_abandoned_agent = agent;
        const t_abandoned = now;
        const s_unit = user && user.s_unit;

        if (agent) {
            
            const body = {
                t_modified,
                s_modified_by,
                s_status,
                s_transaction_id,
                s_abandoned_agent,
                t_abandoned,
                s_unit
            }

            const res = await api('put', 'markLeftEarly', body, true, user);

            if (res.status === 200) {
                notify(`${selectedCompany.s_trucking_company} removed from Queue`);
                setQueueData(res.data);
                
                setModal(false);
            }
        }
    });

    useEffect(() => {
        const queueCustomerFrequency = asyncHandler(async() => {
            const res = await axios.post(`${baseApiUrl}/queueCustomerFrequency`, {
                s_trucking_cell: myAssignmentCompany.s_trucking_cell
            }, {
                headers: {
                    Authorization: `Bearer ${headerAuthCode}`
                }
            });
    
            setCustomerFrequency(res.data[0].i_frequency);
        });

        if (myAssignmentCompany && myAssignmentCompany.s_trucking_cell && myAssignmentCompany.s_trucking_cell.length >= 10) {
            queueCustomerFrequency(); 
        }
    }, [myAssignmentCompany]);

    const checkIsWaiting = (company: ICompany, selectedType: SelectedTypeOptions) => {
        if (company.s_state === 'MIXED') {

            // Select all AWBs for the company (waiting & documenting):
            const companyAwbs = company.awbs;

            if (selectedType === 'ALL') {
                //All AWBs must be WAITING to take ownership of ALL AWBs in a company:
                for (let i = 0; i < companyAwbs.length; i++) {
                    if (companyAwbs[i].s_status !== 'WAITING') {
                        return false;
                    }
                }
                return true;
            } else {

                // If 1+ AWBs of the selected type are WAITING, they can be taken ownership of:
                const waitingAwbs = companyAwbs.filter(
                    awb => awb.s_status === 'WAITING' && awb.s_type === selectedType
                );
        
                return waitingAwbs.length > 0;
            }

        }
        return company.s_status === 'WAITING';
    }

    const handleAddDriver = () => {
        initializeValues();
        setModalAddDriver(true);
    }

    const steps = [
        {
            selector: '.step-1',
            content: '1. Click an AWB to take ownership',
        },
        {
            selector: '.step-2',
            content: '2. Click Take Ownership',
        }, 
        {
            selector: '.step-3',
            content: '3. Click Process AWB'
        }
    ];

    // Tutorial and Test Records

    const [runTutorial, setRunTutorial] = useState(false);
    const [step, setStep] = useState(0);
    const [tutorialKey, setTutorialKey] = useState(0);
    const [testRecordsGenerated, setTestRecordsGenerated] = useState(false);
    const [modalTestRecords, setModalTestRecords] = useState(false);

    const handleTutorial = () => {
        if (!runTutorial) {
            setStep(0);
            setTutorialKey(tutorialKey+1);
        }
    }

    useEffect(() => {
        if (tutorialKey > 0) {
            setRunTutorial(true);
        }
    }, [tutorialKey]);

    const generateTestRecords = asyncHandler(async(num=1, s_state='IMPORT', s_mawb=null) => {
        const data = {
            num,
            now: moment().local().format('MM/DD/YYYY HH:mm:ss'),
            s_state,
            s_mawb,
            s_unit: user.s_unit,
            s_email: user.s_email
        }
        const res = await api('post', 'generateTestQueueRecord', { data });

        if (res.status === 200) {
            setQueueData(res.data);
            setModalTestRecords(false);    
        }
    });


    useEffect(() => {
        if (runTutorial && !testRecordsGenerated) {
            generateTestRecords();
            setTestRecordsGenerated(true);
        }
    }, [runTutorial]);

    const handleReject = (awb: IQueue) => {
        setRejectAwb(awb);
        setModalReject(true);
    }

    const reject = async() => {

        const endpoint = 'rejectCounterItem';

        const { s_email } = user;
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');

        const data: IMap<any> = {};
    
        const queueData = {
            id: rejectAwb.id,
            t_counter_start: now,
            t_counter_end: now,
            s_counter_ownership_agent: s_email,
            s_transaction_id: rejectAwb.s_transaction_id,
            s_mawb_id: rejectAwb.s_mawb_id,
            s_type: rejectAwb.s_type,
            s_modified_by: s_email,
            t_modified: now,
            s_status: 'REJECTED',
            b_counter_reject: true,
            s_counter_reject_agent: s_email,
            t_counter_reject_time: now,
            s_counter_reject_reason: rejectReason.value,
            s_notes: s_notes
        }

        const importData: IMap<any> = {};
        importData.s_unit = rejectAwb.s_unit;
        importData.s_awb_type = rejectAwb.s_type;
        importData.s_mawb = rejectAwb.s_mawb;
        importData.s_transaction_id = rejectAwb.s_transaction_id;
        importData.s_driver_company = rejectAwb.s_trucking_company;
        importData.t_kiosk_submittedtime = rejectAwb.t_kiosk_submitted;
        importData.s_counter_assigned_agent = rejectAwb.s_counter_ownership_agent;
        importData.t_counter_assigned_start = rejectAwb.t_counter_ownership;
        importData.s_counter_by = s_email;
        importData.t_counter_endtime = now;
        importData.t_created = now;
        importData.s_created_by = s_email;
        importData.t_modified = now;
        importData.s_modified_by = s_email;
        importData.s_mawb_id = rejectAwb.s_mawb_id;
        importData.t_counter_start_time = rejectAwb.t_kiosk_submitted;
        importData.s_status = 'REJECTED';
        importData.b_counter_reject = true;
        importData.s_counter_reject_agent = s_email;
        importData.t_counter_reject_time = now;
        importData.s_counter_reject_reason = rejectReason.value;
        importData.s_driver_name = rejectAwb.s_trucking_driver;
        importData.s_notes = s_notes;

        const exportData: IMap<any> = {};
        exportData.s_unit = user.s_unit;
        exportData.s_awb_type = 'EXPORT';
        exportData.s_mawb = rejectAwb.s_mawb;
        exportData.s_priority = 'NORMAL';
        exportData.s_airline = rejectAwb.s_airline;
        exportData.s_airline_code = rejectAwb.s_airline_code;
        exportData.s_language = rejectAwb.s_trucking_language;
        exportData.b_sms_enabled = rejectAwb.b_trucking_sms;
        exportData.s_sms = rejectAwb.s_trucking_cell;
        exportData.s_company = rejectAwb.s_trucking_company;
        exportData.s_company_driver_name = rejectAwb.s_trucking_driver;
        exportData.s_status = 'REJECTED';
        exportData.b_counter_reject = true;
        exportData.s_counter_reject_agent = s_email;
        exportData.t_counter_reject_time = now;
        exportData.s_counter_reject_reason = rejectReason.value;
        exportData.s_kiosk_submitted_agent = rejectAwb.s_counter_ownership_agent;
        exportData.t_kiosk_submitteddatetime = rejectAwb.t_kiosk_submitted;
        exportData.s_counter_assigned_agent = rejectAwb.s_counter_ownership_agent;
        exportData.t_counter_assigned_start = rejectAwb.t_counter_ownership;
        exportData.s_counter_by = s_email;
        exportData.t_counter_start_time = rejectAwb.t_kiosk_submitted;
        exportData.t_counter_endtime = now;
        exportData.t_created = now;
        exportData.s_created_by = s_email;
        exportData.t_modified = now;
        exportData.s_modified_by = s_email;
        exportData.s_transaction_id = rejectAwb.s_transaction_id;
        exportData.s_mawb_id = rejectAwb.s_mawb_id;
        exportData.s_notes = s_notes;
        data.queueData = queueData;

        if (rejectAwb.s_type === 'IMPORT') {
            data.importData = importData;
            data.s_awb_type = 'IMPORT';
        } else {
            data.exportData = exportData;
            data.s_awb_type = 'EXPORT';
        }

        data.other = {
            s_mawb_id: rejectAwb.s_mawb_id,
            s_email: user.s_email,
            s_unit: user.s_unit,
            t_modified: now,
            rejectReason: rejectReason.value
        }

        setLoading(true);
        const res = await api('post', endpoint, { data });
        setLoading(false);

        if (res.status === 200) {
            setModal(false);
            setModalReject(false);
            notify('Complete');
            setQueueData(res.data);
            
            setRejectReason(defaultSelectOption);
            set_s_notes('');
        }
    };

    const [companiesKey, setCompaniesKey] = useState(0);

    return (
        <Layout>
            <Tour 
                steps={steps}
                isOpen={runTutorial}
                onRequestClose={() => setRunTutorial(false)}
                goToStep={step}
                startAt={0}
            />
            <MainContainer className='px-0 py-3 d-flex' data-testid={'view-queue'}>
                <RightContainer>
                    <Row>
                        <Col md={12} className='mb-2'>
                            <h1 className='d-inline' onClick={() => setCompaniesKey(prev => prev + 1)}>Queue</h1>
                            <Button className={'d-inline ml-2'} onClick={() => handleTutorial()}>Tutorial</Button>
                            {
                                user && user.s_unit === ['CJFK2', 'CJFK1', 'CBOS1'].includes(user.s_unit ) && 
                                <Button className='d-inline ml-2' onClick={() => handleAddDriver()}>Add Driver</Button>
                            }
                            {
                                user && user.i_access_level > 4 && 
                                <Button color={'warning'} className={'ml-2'} onClick={() => setModalTestRecords(true)}>Create Test Records</Button>                                              
                            }
                        </Col>
                    </Row>
                    <Stats 
                        stats={stats}
                        myAssignmentCompany={myAssignmentCompany}
                    />
                    <Row>
                        <Col md={12}>
                            <h4>My Assignments</h4>
                        </Col>
                    </Row>
                    {
                        myAssignmentCompany.awbs.length > 0 ?
                        <div data-testid={'div-assignment-details'}>
                            <Row>
                                <Col md={7}>
                                    <CustomerDetails 
                                        myAssignmentCompany={myAssignmentCompany}
                                        viewMyAssignmentCompany={viewMyAssignmentCompany}
                                    />
                                </Col>
                                <Col md={5}>
                                    <Card style={{borderRadius: '0.75rem', height: '143px'}}>
                                        <CardBody className='custom-card-opacity py-3'>
                                            <Row>
                                                <Col md={12}>
                                                    <h4>Frequency</h4>
                                                    <h6>This customer has visited this warehouse {customerFrequency} times in the 30 days.</h6>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <Row className='mt-4 step-3'>
                                <Col md={12} className={'mt-3'}>
                                    <h4>Task List: {myAssignmentCompany.awbs.length}</h4>
                                </Col>
                                <MyAssignmentsContainer className={'hidden-scroll'}>
                                {
                                    myAssignmentCompany.awbs.map((awb, i) =>
                                        <MyAssignment 
                                            awb={awb}
                                            handleSearchAwb={handleSearchAwb}
                                            key={i}
                                        />
                                    )
                                }
                                </MyAssignmentsContainer>
                            </Row>
                        </div> :
                        <h4 data-testid={'assigned-status'}>
                        {
                            waitingCustomers ?
                                'You are not currently assigned a customer. Please select a customer from the queue selection.' :
                                'There are no customers waiting.'
                        }
                        </h4>
                    }
                </RightContainer>
                <CompaniesContainer>
                    <div className={'step-1'}>
                        <Row>
                            <Col md={12}>
                                {
                                    companyTypes.map((t, i) =>
                                        <button 
                                            key={i} 
                                            className={classnames(`mx-1 my-1 btn`, { 'btn-success': selectedType === t }, { 'btn-outline-dark': selectedType !== t }, { 'mb-1': breakpoint })}
                                            onClick={()=> setSelectedType(t)}
                                            // @ts-ignore
                                            active={(selectedType === t).toString()}
                                            type={'button'}
                                        >
                                            {t}
                                        </button>
                                    )
                                }
                            </Col>
                        </Row>
                        <CompaniesList className='mt-2' data-testid={'div-queue-companies'} key={companiesKey}>
                            <FullWidthTransitionGroup>
                                {
                                    renderCompanies.waitingCompanies.map((c, i) =>
                                        <CSSTransition
                                            key={`${c.s_transaction_id}-${i}`}
                                            timeout={500}
                                            classNames="drop-in"
                                            unmountOnExit
                                        >
                                            <CompanyCard 
                                                company={c}
                                                viewCompany={viewCompany}
                                                user={user}
                                            />
                                        </CSSTransition>
                                    )
                                }
                                {
                                    renderCompanies.processingCompanies.map((c, i) =>
                                        <CSSTransition
                                            key={`${c.s_transaction_id}-${i}`}
                                            timeout={500}
                                            classNames="drop-in"
                                            unmountOnExit
                                        >
                                            <CompanyCard 
                                                company={c}
                                                viewCompany={viewCompany}
                                                user={user}
                                            />
                                        </CSSTransition>
                                    )
                                }
                            </FullWidthTransitionGroup>
                        </CompaniesList>
                    </div>

                    {/* Active Users */}
                    <Row style={{ overflowX: 'scroll'}} className={'pt-2'}>
                        <Col md={12}>
                            <h6 className='mb-0 mt-2 d-inline'>Currently in Counter:</h6>
                            {
                                user.i_access_level >= 3 && 
                                <Button onClick={() => setModalManagerView(true)}>Manager View</Button>
                            }
                        </Col>
                        <ActiveUsersContainer>
                            {
                                Object.keys(activeUsers).map((key, i) => 
                                    renderActiveQueueUser(activeUsers[key], user.s_unit) &&
                                        <ActiveUser 
                                            user={activeUsers[key]}
                                            accessToken={accessToken}
                                            processingAgentsMap={processingAgentsMap}
                                            showName={false}
                                            key={i}
                                        />
                                )
                            }
                        </ActiveUsersContainer>
                    </Row>
                </CompaniesContainer>
            </MainContainer>

            <Formik
                initialValues={initialValues}
                onSubmit={() => null}
            >
                {({ setFieldValue, values, resetForm, isValid, initialValues }) => (
                    <ModalAddDriver 
                        user={user}
                        modal={modalAddDriver}
                        setModal={setModalAddDriver}
                        values={values}
                        setFieldValue={setFieldValue}
                        resetForm={resetForm}
                        setQueueData={setQueueData}
                    />
                )}
            </Formik>

            <ModalViewCompany 
                modal={modal}
                setModal={setModal}
                selectedCompany={selectedCompany}
                selectedType={selectedType}
                isMyAssignment={isMyAssignment}
                myAssignmentCompany={myAssignmentCompany}
                takeOwnership={takeOwnership}
                removeCompanyOwnership={removeCompanyOwnership}
                checkIsWaiting={checkIsWaiting}
                user={user}
                activeUsers={socket.activeUsers}
                processingAgentsMap={processingAgentsMap}
                handleReject={handleReject}
                handleSearchAwb={handleSearchAwb}
            />

            <ManagerView 
                modal={modalManagerView}
                setModal={setModalManagerView}
                activeUsers={activeUsers}
                accessToken={accessToken}
                companiesList={companiesList}
                processingAgentsMap={processingAgentsMap}
                viewCompany={viewCompany}
                user={user}
            />

            <ModalTestRecords 
                modal={modalTestRecords}
                setModal={setModalTestRecords}
                generateTestRecords={generateTestRecords}
            />

            <ModalReject 
                modal={modalReject}
                setModal={setModalReject}
                rejectReason={rejectReason}
                setRejectReason={setRejectReason}
                s_notes={s_notes}
                set_s_notes={set_s_notes}
                reject={reject}
            />

        </Layout>
    );
}

const MainContainer = styled.div`
    --padding-x: 10px;
    display: flex;
    flex-direction: row;
    gap: 25px;

    @keyframes drop-in {
        from {
            transform: translateY(-150%);
        }
        to {
            transform: translateY(0%);
        }
    }

    @media (max-width: 1400px) {
        flex-direction: column;
    }

    .drop-in-enter {
        opacity: 0;
        transform: translateY(-150%);
    }
    .drop-in-enter-active {
        opacity: 1;
        transform: translateY(0%);
        transition: opacity 500ms, transform 500ms;
    }
    .drop-in-exit {
        opacity: 1;
    }
    .drop-in-exit-active {
        opacity: 0;
        transform: translateY(-150%);
        transition: opacity 500ms, transform 500ms;
    }
`;

const FullWidthTransitionGroup = styled(TransitionGroup)`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const RightContainer = styled.div`
    flex: 3;
`;


const CompaniesContainer = styled.div`
    flex: 1;
`;

const CompaniesList = styled.div`
    padding: var(--padding-x) 0;
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    gap: var(--padding-x);
    background-color: #D3D3D3;
    height: 60vh;
    border-radius: 25px;
    padding-left: var(--padding-x);
    padding-right: var(--padding-x);
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* Internet Explorer 10+ */

    &::-webkit-scrollbar { /* WebKit */
        width: 0;
        height: 0;
    }
`;

const MyAssignmentsContainer = styled.div`
    background-color: #D3D3D3;
    margin-left: var(--padding-x);
    margin-right: var(--padding-x);
    padding: var(--padding-x);
    border-radius: 25px;
    min-height: 200px;
    max-height: 300px;
    overflow-y: scroll;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    gap: var(--padding-x);
    flex-wrap: wrap;

    @media (max-width: 1920px) {
        justify-content: space-between;
    }
`;

const ActiveUsersContainer = styled.div`
    display: flex;
    overflow-y: hidden;
    width: 100%;
    /* margin-right: var(--padding-x);
    margin-left: var(--padding-x); */
    padding-left: 20px;
    & > * {
        margin-left: -20px;
    }
`;

export default withRouter(Queue);