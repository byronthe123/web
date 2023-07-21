import React, { useState, useRef, useEffect } from 'react';
import ReactTable from '../../custom/ReactTable';
import { Row, Col, Button } from 'reactstrap';
import employeesTableMapping from './employeesTableMapping';
import readingSignsTableMapping from './readingSignsTableMapping';
import { Wizard, Steps, Step } from 'react-albus';
import TopNavigation from '../../../components/wizard-hooks/TopNavigation';
import BottomNavigation from '../../../components/wizard-hooks/BottomNavigation';
import ModalManageAssigned from './ModalManageAssigned';
import { api, asyncHandler, deleteLocalValue } from '../../../utils';
import Axios from 'axios';
import Tour from 'reactour';
import CreateReport from './CreateReport';
import { renderToString } from 'react-dom/server';
// import BottomNavigation from '../components/wizard-hooks/BottomNavigation';

export default ({
    employees,
    setEmployees,
    baseApiUrl,
    headerAuthCode,
    user,
    readingSigns,
    readingSignRecords,
    createSuccessNotification
}) => {

    const [readingSignRecord, setReadingSignRecord] = useState({});
    const [useEmployees, setUseEmployees] = useState([]);
    const [assigned, setAssigned] = useState([]);

    useEffect(() => {
        const assigned = readingSignRecords.filter(rs => rs.readingSignId === readingSignRecord._id);
        setAssigned(assigned);
        const map = {};
        assigned.map(a => map[a.userEmail] = true);
        const useEmployees = employees.filter(e => !map[e.s_email]);
        setUseEmployees(useEmployees);
    }, [employees, readingSignRecord, readingSignRecords]);

    useEffect(() => {
        const copy = Object.assign([], useEmployees);
        copy.map(c => c.selected = false);
        setUseEmployees(copy);
    }, [readingSignRecord]);

    const reactTableRef = useRef();

    const handleSelectUser = (s_email) => {
        const copy = Object.assign([], useEmployees);
        const index = copy.findIndex(c => c.s_email === s_email);
        copy[index].selected = !copy[index].selected;
        setEmployees(copy);
    }

    const selectAll = () => {
        const recordsToSelect = reactTableRef.current.getResolvedState().sortedData;
        const map = {};
        recordsToSelect.map(r => map[r._original.s_email] = true);
        const copy = Object.assign([], useEmployees);
        copy.map(e => e.selected = (map[e.s_email] || false));
        setEmployees(copy);
    }

    const selectNone = () => {
        const copy = Object.assign([], useEmployees);
        copy.map(c => c.selected = false);
        setEmployees(copy);
    }

    const assignReadingSigns = asyncHandler(async() => {
        const selected = [];

        for (let i = 0; i < useEmployees.length; i++) {
            if (useEmployees[i].selected) {
                selected.push({
                    readingSignId: readingSignRecord._id,
                    userEmail: useEmployees[i].s_email,
                    fullName: `${useEmployees[i].s_first_name} ${useEmployees[i].s_last_name}`,
                    assignedBy: user.s_email
                });
            }
        }

        const res = await Axios.post(`${baseApiUrl}/assignReadingSigns`, {
            data: selected
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        //setAssigned(res.data);
        const newAssigned = res.data;

        const previousAssignedMap = {};

        for (let i = 0; i < assigned.length; i++) {
            previousAssignedMap[assigned[i]._id] = true;
        }

        for (let i = 0; i < newAssigned.length; i++) {
            if (previousAssignedMap[newAssigned[i]._id] === undefined) {
                readingSignRecords.push(newAssigned[i]);
            }   
        }

        selectNone();
        createSuccessNotification('Assigned');
    });

    const enableAssign = () => useEmployees.filter(e => e.selected).length > 0;

    const [modalManageAssigned, setModalManageAssigned] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState({});

    const handleSelectAssignment = (record) => {
        setSelectedAssignment(record);
        setModalManageAssigned(true);
    }

    const unassignReadingSign = asyncHandler(async() => {
        await Axios.delete(`${baseApiUrl}/unassignReadingSign/${selectedAssignment._id}`, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }    
        });
        deleteLocalValue(assigned, setAssigned, selectedAssignment._id, '_id');
        setModalManageAssigned(false);
        createSuccessNotification('Unassigned');
    });

    const resolveEnableNext = (step) => {
        console.log(step);
        if (step.id === '1') {
            return true;
        } else if (step.id === '2') {
            if (readingSignRecord && readingSignRecord._id && readingSignRecord._id.length > 0) {
                return true;
            }
        }
    };

    const topNavClick = (stepItem, push) => {
        console.log(resolveEnableNext(stepItem))
        if (resolveEnableNext(stepItem)) {
            push(stepItem.id);
        }
    };

    const onClickNext = (goToNext, steps, step, push) => {
        console.log(steps);
        step.isDone = true;
        if (steps.length - 1 <= steps.indexOf(step)) {
            return;
        } else if (!resolveEnableNext(step)) {
            step.disabled = true;
            return;
        } else {
            step.disabled = false;

            console.log(step);

            if (step.id === '1' && tutorialStep === 2) {
                setTutorialStep(3);
            }

            goToNext();
        }
    };
    
    const onClickPrev = (goToPrev, steps, step, push) => {
        if (steps.indexOf(step) <= 0) {
            return;
        }

        goToPrev();
    };

    const resolveNextBottomNav = (step) => {
        if (step.id === '1') {
            return readingSignRecord && readingSignRecord._id && readingSignRecord._id.length > 0;
        }
    }

    const [runTutorial, setRunTutorial] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(0);
    const [tutorialKey, setTutorialKey] = useState(0);

    const handleTutorial = () => {
        if (!runTutorial) {
            setReadingSignRecord({});
            setTutorialStep(0);
            setTutorialKey(tutorialKey+1);
        }
    }

    useEffect(() => {
        if (tutorialKey > 0) {
            setRunTutorial(true);
        }
    }, [tutorialKey]);

    // Tour
    const steps = [
        {
            selector: '.tutorial-intro',
            content: 'In this tutorial we will show you how to assign an existing read and sign to multiple agents.',
        },
        {
            selector: '.step-1',
            content: '1. Click to select an existing Read and Sign.',
        },
        {
            selector: '.step-2',
            content: '2. Click Next.',
        }, 
        {
            selector: '.step-3',
            content: '3. Here you can filter agents by name, title or department. Click here to select the agents that you want to assign.'
        },
        {
            selector: '.step-4',
            content: '4. If you filter the list below, you can click select all to assign all agents currently displayed.'
        },
        {
            selector: '.step-5',
            content: '5. Once you are done select assign.'
        }
    ];

    useEffect(() => {
        if (tutorialStep === 1 && readingSignRecord && readingSignRecord._id) {
            setTutorialStep(2);
        }
    }, [readingSignRecord, tutorialStep]);

    const [stationInfo, setStationInfo] = useState({});

    const getStationInfo = async() => {
        const res = await api('get', `selectStationInfo/${user.s_unit}`);
        return res.data;
    }

    const resolveCreatorProfile = async(createdBy) => {
        const res = await api('get', `userProfile/${createdBy}`);
        return res.data;
    }

    const printReport = asyncHandler(async() => {

        let useStationInfo = stationInfo;

        if (Object.keys(useStationInfo).length === 0) {
            useStationInfo = await getStationInfo();
        }

        const creatorProfile = await resolveCreatorProfile(readingSignRecord.createdBy);
        const { s_first_name, s_last_name } = creatorProfile;
        const creatorName = `${s_first_name} ${s_last_name}`;

        let numAck = 0;
        for (let i = 0; i < assigned.length; i++) {
            if (assigned[i].acknowledged) {
                numAck++;
            }
        } 

        const report = renderToString(
            <CreateReport 
                readingSignRecord={readingSignRecord}
                assigned={assigned}
                numAck={numAck}
                stationInfo={useStationInfo}
                creatorName={creatorName}
            />
        );

        const printWindow = window.open('', 'MsgWindow', 'width=1920,height=1080');
        printWindow.document.write(report);
    });

    return (
        <Row>
            <Tour 
                steps={steps}
                isOpen={runTutorial}
                onRequestClose={() => setRunTutorial(false)}
                goToStep={tutorialStep}
                startAt={0}
                nextStep={() => setTutorialStep(tutorialStep + 1)}
            />
            <Col md={12}>
                <Wizard 
                    render={({ step, steps, next, previous, push }) => (
                        <div className="wizard wizard-default">
                            <TopNavigation
                                className="justify-content-center mb-4"
                                disableNav={false}
                                topNavClick={topNavClick}
                            />
                            <div className={'text-center tutorial-intro mx-auto'} style={{ width: '50px' }}></div>
                            <Steps>
                                <Step id={'1'} name={'Select Reading Sign'}>
                                    <div className={'step-1'}>
                                        <ReactTable 
                                            data={readingSigns}
                                            mapping={readingSignsTableMapping}
                                            numRows={10}
                                            index={true}
                                            enableClick={true}
                                            handleClick={(item) => setReadingSignRecord(item)}
                                        />
                                    </div>
                                </Step>
                                <Step id={'2'} name={'Select Employees'}>
                                    <Row>
                                        <Col md={6} className={'step-3'} style={{ height: '500px' }}>
                                            <Row className={'mb-1'}>
                                                <Col md={12}>
                                                    <div className={'float-left'}>
                                                        <h4 className={'d-inline mr-2'}>Select Employees</h4>
                                                        <Button onClick={() => selectAll()} className={'d-inline mr-2 step-4'}>Select All</Button>
                                                        <Button onClick={() => selectNone()} className={'d-inline mr-2'} color={'danger'}>Select None</Button>
                                                    </div>
                                                    <Button onClick={() => assignReadingSigns()} className={'float-right step-5'} disabled={!enableAssign()}>Assign</Button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={12}>
                                                    <div>
                                                        <ReactTable 
                                                            data={useEmployees}
                                                            mapping={employeesTableMapping}
                                                            numRows={10}
                                                            index={true}
                                                            enableClick={true}
                                                            handleClick={(user) => handleSelectUser(user.s_email)}
                                                            reactTableRef={reactTableRef}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={6}>
                                            <h4 className={'mb-3'}>Already Assigned to {readingSignRecord.title}</h4>
                                            <ReactTable 
                                                data={assigned}
                                                mapping={[
                                                    {
                                                        name: 'Name',
                                                        value: 'fullName'
                                                    },
                                                    {
                                                        name: 'Acknowledged',
                                                        value: 'acknowledged',
                                                        boolean: true
                                                    },
                                                    {
                                                        name: 'Assigned By',
                                                        value: 'assignedBy',
                                                        email: true
                                                    },
                                                    {
                                                        name: 'Assigned Date',
                                                        value: 'updatedAt',
                                                        datetime: true,
                                                        utc: true
                                                    }
                                                ]}
                                                numRows={10}
                                                index={true}
                                                enableClick={true}
                                                handleClick={(assignment) => handleSelectAssignment(assignment)}
                                            />
                                        </Col>
                                    </Row>
                                </Step>
                            </Steps>
                            <Row>
                                <Col md={12} className={'mt-2'}>
                                    <button className={'btn btn-purple'} onClick={() => handleTutorial()}>Tutorial</button>
                                    <Button disabled={Object.keys(readingSignRecord).length === 0} className={'ml-2'} onClick={() => printReport()}>Print</Button>
                                </Col>
                            </Row>
                            <BottomNavigation
                                onClickNext={onClickNext}
                                onClickPrev={onClickPrev}
                                className="justify-content-center step-2"
                                prevLabel={'Back'}
                                nextLabel={'Next'}
                                resolveEnableNext={resolveNextBottomNav}
                            />
                        </div>
                    )}
                ></Wizard>

                <ModalManageAssigned 
                    modal={modalManageAssigned}
                    setModal={setModalManageAssigned}
                    readingSignRecord={readingSignRecord}
                    selectedAssignment={selectedAssignment}
                    unassignReadingSign={unassignReadingSign}
                />

            </Col>
        </Row>
    );
}