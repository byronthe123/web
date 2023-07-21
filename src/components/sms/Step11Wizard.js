import React, {useState, useRef, useEffect} from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button, Table, Row, Col } from "reactstrap";
import { Wizard, WithWizard, Steps, Step } from 'react-albus';
import axios from 'axios';
import moment from 'moment';

import ModalEditCorrectivePreventativeActions from './ModalEditCorrectivePreventativeActions';
import ModalConfirmDeleteRecord from './ModalConfirmDeleteRecord';

const Step11Wizard = ({
    i_id,
    user,
    handleInput,
    saveReportWithNotification,
    baseApiUrl,
    headerAuthCode,
    createSuccessNotification
}) => {

    const [correctiveActions, setCorrectiveActions] = useState([]);
    const [preventativeActions, setPreventativeActions] = useState([]);

    //Corrective:
    const [s_corrective_action, set_s_corrective_action] = useState('');
    const [s_corrective_owner, set_s_corrective_owner] = useState('');
    const [d_corrective_target_date, set_d_corrective_target_date] = useState('');
    const [s_corrective_status_remarks, set_s_corrective_status_remarks] = useState('');

    //Preventative:
    const [s_preventative_action, set_s_preventative_action] = useState('');
    const [s_owner, set_s_owner] = useState('');
    const [d_target_date, set_d_target_date] = useState('');
    const [s_status_remarks, set_s_status_remarks] = useState('');

    //Edit
    const [editType, setEditType] = useState(null);
    const [editRecordId, setEditRecordId] = useState(null);
    const [editAction, setEditAction] = useState('');
    const [editOwner, setEditOwner] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);

    //Delete
    const [deleteId, setDeleteId] = useState(null);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [deleteUrl, setDeleteUrl] = useState('');
    const [modalConfirmDeletionOpen, setModalConfirmDeletion] = useState(false);

    useEffect(() => {
        if (deleteId !== null) {
            let searchArray;

            if (isCorrective()) {
                searchArray = correctiveActions;
                setDeleteUrl('deleteSmsCorrectiveAction');
            } else {
                searchArray = preventativeActions;
                setDeleteUrl('deleteSmsPreventativeAction');
            }
    
            const record = searchArray.filter(a => a.id === deleteId)[0];
    
            setRecordToDelete(record);
            setEditModalOpen(false);
            setModalConfirmDeletion(true);    
        }
    }, [deleteId]);

    const selectSmsCorrectiveAndPreventativeAction = () => {
        const i_report_id = i_id;
        axios.post(`${baseApiUrl}/selectSmsCorrectiveAndPreventativeAction`, {
            i_report_id
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            console.log(response);
            const {correctiveActions, preventativeActions} = response.data;
            setCorrectiveActions(correctiveActions);
            setPreventativeActions(preventativeActions);
        }).catch(error => {

        });
    }

    useEffect(() => {
        selectSmsCorrectiveAndPreventativeAction();
    }, []);

    const addSmsCorrectiveAction = () => {
        const i_report_id = i_id;
        const s_owner = s_corrective_owner;
        const d_target_date = d_corrective_target_date;
        const s_status_remarks = s_corrective_status_remarks;

        axios.post(`${baseApiUrl}/addSmsCorrectiveAction`, {
            i_report_id,
            s_corrective_action,
            s_owner,
            d_target_date,
            s_status_remarks
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setCorrectiveActions(response.data);
            resetCorrectiveFields();
        }).catch(error => {

        });
    }

    const enableSaveSmsCorrectiveAction = () => {
        const checkArray = [s_corrective_action, s_corrective_owner, d_corrective_target_date, s_corrective_status_remarks];
        for (let i = 0; i < checkArray.length; i++) {
            if (checkArray[i].length === 0) {
                return false;
            }
        }
        return true;
    }

    const resetCorrectiveFields = () => {
        set_s_corrective_action('');
        set_s_corrective_owner('');
        set_d_corrective_target_date('');
        set_s_corrective_status_remarks('');
    }

    const addSmsPreventativeAction = () => {
        const i_report_id = i_id;
        axios.post(`${baseApiUrl}/addSmsPreventativeAction`, {
            i_report_id,
            s_preventative_action,
            s_owner,
            d_target_date,
            s_status_remarks
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setPreventativeActions(response.data);
            resetPreventativeFields();
        }).catch(error => {

        });
    }

    const enableSaveSmsPreventativeAction = () => {
        const checkArray = [s_preventative_action, s_owner, d_target_date, s_status_remarks];
        for (let i = 0; i < checkArray.length; i++) {
            if (checkArray[i].length === 0) {
                return false;
            }
        }
        return true;
    }

    const resetPreventativeFields = () => {
        set_s_preventative_action('');
        set_s_owner('');
        set_d_target_date('');
        set_s_status_remarks('');
    }

    const initializeEditRecord = (recordId, editType) => {
        let searchRecords;
        let actionPropName;

        if (editType.toLowerCase() === 'corrective') {
            searchRecords = correctiveActions;
            actionPropName = 's_corrective_action';
        } else {
            searchRecords = preventativeActions;
            actionPropName = 's_preventative_action';
        }

        const selectedRecord = searchRecords.filter(r => r.id === recordId)[0];

        setEditRecordId(recordId);
        setEditType(editType.toLowerCase());
        setEditAction(selectedRecord[actionPropName]);
        setEditOwner(selectedRecord.s_owner);
        setEditDate(moment(selectedRecord.d_target_date).format('YYYY-MM-DD'));
        setEditStatus(selectedRecord.s_status_remarks);
        setEditModalOpen(true);
    }

    const isCorrective = () => {
        return editType && editType !== null && editType.toLowerCase() === 'corrective';
    }

    const updateRecord = () => {

        const url = isCorrective() ? 'updateSmsCorrectiveAction' : 'updateSmsPreventativeAction';
        const id = editRecordId;
        const i_report_id = i_id;
        const s_corrective_action = editAction;
        const s_preventative_action = editAction;
        const s_owner = editOwner;
        const d_target_date = editDate;
        const s_status_remarks = editStatus;

        const data = {
            id,
            i_report_id,
            s_owner,
            d_target_date,
            s_status_remarks
        }

        if (isCorrective()) {
            data.s_corrective_action = s_corrective_action;
        } else {
            data.s_preventative_action = s_preventative_action;
        }

        axios.post(`${baseApiUrl}/${url}`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            if (isCorrective()) {
                setCorrectiveActions(response.data);
            } else {
                setPreventativeActions(response.data);
            }

            createSuccessNotification('Record Updated');
            setEditModalOpen(false);
        }).catch(error => {

        });
    }

    const deleteRecord = () => {
        const id = deleteId;
        const i_report_id = i_id;
        axios.post(`${baseApiUrl}/${deleteUrl}`, {
            id,
            i_report_id
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            if (isCorrective()) {
                setCorrectiveActions(response.data);
            } else {
                setPreventativeActions(response.data);
            }
            setModalConfirmDeletion(false);
            createSuccessNotification('Record Deleted');
        }).catch(error => {

        });
    }

    return (
        <WithWizard render={({ next }) => (
            <div className="wizard-basic-step">
                <Form>
                    <div className='text-center'>
                    <h3 className='mb-0 pb-0'>Incident Investigation Report: Corrective and Preventative Actions</h3>
                        <hr></hr>
                    </div>
                    <FormGroup style={{height: '480px', overflowY: 'scroll', overflowX: 'hidden'}}>
                        <div className="form-group position-relative align-left mb-0">
                            <Card className='mb-2' style={{borderRadius: '0.75rem'}}>
                                {/* <CardBody className={`custom-card py-2 ${halfWindow() ? 'px-1' : 'px-3'}`}> */}
                                <CardBody className={`custom-card py-2 px-2`}>
                                    <Row>
                                        <Col md='12' lg='12'>
                                            <h4>Please provide all immediate corrective actions taken to remove the identified cause of the accident, i.e. repairs to equipment, removal from service, etc.</h4>
                                        </Col>
                                    </Row>
                                    <Row className='mx-2'>
                                        <Table style={{tableLayout: 'fixed'}}>
                                            <thead>
                                                <tr>
                                                    <th style={{width: '45%'}}>Corrective Action</th>
                                                    <th style={{width: '15%'}}>Owner</th>
                                                    <th style={{width: '15%'}}>Target Date</th>
                                                    <th style={{width: '20%'}}>Status/Remarks</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    correctiveActions.map((a, i) =>
                                                        <tr key={i}>
                                                            <td>{a.s_corrective_action}</td>
                                                            <td>{a.s_owner}</td>
                                                            <td>{moment(a.d_target_date).format('MM/DD/YYYY')}</td>
                                                            <td>{a.s_status_remarks}</td>
                                                            <td>
                                                                <i className="fas fa-edit" onClick={() => initializeEditRecord(a.id, 'Corrective')}></i>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                <tr>
                                                    <td>
                                                        <input type='text' style={{width: '100%'}} value={s_corrective_action} onChange={(e) => set_s_corrective_action(e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type='text' value={s_corrective_owner} onChange={(e) => set_s_corrective_owner(e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type='date' value={d_corrective_target_date} onChange={(e) => set_d_corrective_target_date(e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type='text' value={s_corrective_status_remarks} onChange={(e) => set_s_corrective_status_remarks(e.target.value)} />
                                                    </td>
                                                    <td className='pl-0'>
                                                        <button onClick={() => addSmsCorrectiveAction()} type="button" disabled={!enableSaveSmsCorrectiveAction()} className={`btn ${enableSaveSmsCorrectiveAction() ? 'btn-success' : 'btn-danger'}`}>
                                                            <span style={{fontWeight: 'bold'}}>Add</span><i className={`ml-2 ${enableSaveSmsCorrectiveAction() ? 'far fa-check-circle' : 'fas fa-times-circle'}`}  style={{fontSize: '20px'}}></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Row>
                                </CardBody>
                            </Card>
                        </div>

                        <div className="form-group position-relative align-left mb-0">
                            <Card className='mb-2' style={{borderRadius: '0.75rem'}}>
                                {/* <CardBody className={`custom-card py-2 ${halfWindow() ? 'px-1' : 'px-3'}`}> */}
                                <CardBody className={`custom-card py-2`}>
                                    <Row>
                                        <Col md='12' lg='12'>
                                            <h4>Please provide all immediate corrective actions taken to remove the identified cause of the accident, i.e. repairs to equipment, removal from service, etc.</h4>
                                        </Col>
                                    </Row>
                                    <Row className='mx-2'>
                                        <Table style={{tableLayout: 'fixed'}}>
                                            <thead>
                                                <tr>
                                                    <th style={{width: '45%'}}>Corrective Action</th>
                                                    <th style={{width: '15%'}}>Owner</th>
                                                    <th style={{width: '15%'}}>Target Date</th>
                                                    <th style={{width: '20%'}}>Status/Remarks</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    preventativeActions.map((a, i) =>
                                                        <tr key={i}>
                                                            <td>{a.s_preventative_action}</td>
                                                            <td>{a.s_owner}</td>
                                                            <td>{moment(a.d_target_date).format('MM/DD/YYYY')}</td>
                                                            <td>{a.s_status_remarks}</td>
                                                            <td>
                                                                <i className="fas fa-edit" onClick={() => initializeEditRecord(a.id, 'Preventative')}></i>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                <tr>
                                                    <td>
                                                        <input type='text' style={{width: '100%'}} value={s_preventative_action} onChange={(e) => set_s_preventative_action(e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type='text' value={s_owner} onChange={(e) => set_s_owner(e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type='date' value={d_target_date} onChange={(e) => set_d_target_date(e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type='text' value={s_status_remarks} onChange={(e) => set_s_status_remarks(e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <button onClick={() => addSmsPreventativeAction()} type="button" disabled={!enableSaveSmsPreventativeAction()} className={`btn ${enableSaveSmsPreventativeAction() ? 'btn-success' : 'btn-danger'}`}>
                                                            <span style={{position: 'relative', top: '-3px', fontWeight: 'bold'}}>Add</span><i className={`ml-2 ${enableSaveSmsPreventativeAction() ? 'far fa-check-circle' : 'fas fa-times-circle'}`}  style={{fontSize: '20px'}}></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Row>
                                </CardBody>
                            </Card>
                        </div>
                    </FormGroup>
                </Form>
                <ModalEditCorrectivePreventativeActions
                    open={editModalOpen}
                    handleModal={setEditModalOpen}
                    editType={editType}
                    editAction={editAction}
                    setEditAction={setEditAction}
                    editOwner={editOwner}
                    setEditOwner={setEditOwner}
                    editDate={editDate}
                    setEditDate={setEditDate}
                    editStatus={editStatus}
                    setEditStatus={setEditStatus}
                    updateRecord={updateRecord}
                    setDeleteId={setDeleteId}
                    editRecordId={editRecordId}
                />
                <ModalConfirmDeleteRecord
                    open={modalConfirmDeletionOpen}
                    handleModal={setModalConfirmDeletion}
                    recordToDelete={recordToDelete}
                    isCorrective={isCorrective}
                    deleteRecord={deleteRecord}
                />
                {/* <Button color="success" onClick={() => saveReportWithNotification()} style={{position: 'absolute', right: '40%'}}>
                    Save
                </Button> */}
            </div>
        )} />
    );
}

export default Step11Wizard;