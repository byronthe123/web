import React, {useState, useEffect, useRef} from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button, Table, Row, Col } from "reactstrap";
import { Wizard, WithWizard, Steps, Step } from 'react-albus';
import axios from 'axios';
import moment from 'moment';


import ModalEditEquipmentRecord from './ModalEditEquipmentRecord';

const Step7Wizard = ({
    i_id,
    user,
    saveReportWithNotification,
    handleInput,
    selectedEmloyee,
    baseApiUrl,
    headerAuthCode,
    createSuccessNotification,
    s_weather_environment_description,
    s_weather_similar_incidents_description
}) => {

    //Add new:
    const [equipmentHistoryData, setEquipmentHistoryData] = useState([]);
    const [s_equipment_id, set_s_equipment_id] = useState('');
    const [s_equipment_type, set_s_equipment_type] = useState('');
    const [s_incident_notes, set_s_incident_notes] = useState('');
    const [s_maintenance_history, set_s_maintenance_history] = useState('');
    const [s_maintenance_item_found, set_s_maintenance_item_found] = useState('');
    //Edit:
    const [editEquipmentRecordId, setEditEquipmentRecordId] = useState(null);
    const [editEquipmentId, setEditEquipmentId] = useState('');
    const [editEquipmentType, setEditEquipmentType] = useState('');
    const [editIncidentNotes, setEditIncidentNotes] = useState('');
    const [editMaintenanceHistory, setEditMaintenanceHistory] = useState('');
    const [editMaintenanceItemFound, setEditMaintenanceItemFound] = useState('');
    //Other
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const editItemsArray = [s_equipment_id, s_equipment_type, s_incident_notes, s_maintenance_history, s_maintenance_item_found];
    const email = user && user.s_email;
    const now = moment().local().format('MM/DD/YYYY hh:mm A');
    const getValuesRef = useRef(null);

    useEffect(() => {
        selectEquipmentHistory();
    }, []);

    
    //unmount:
    // useEffect(() => {
    //     // if (getValuesRef.current) {
    //     //     return () => {
    //     //         saveWeatherAndSimilarIncidentsDescription();
    //     //     }
    //     // }
    //     return () => {
    //         saveWeatherAndSimilarIncidentsDescription();
    //     }
    // }, [])

    const selectEquipmentHistory = () => {
        const i_report_id = i_id;
        i_report_id && 
        axios.post(`${baseApiUrl}/selectSmsEquipment`, {
            i_report_id
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            const data = response.data[0];
            setEquipmentHistoryData(response.data);
        }).catch(error => {

        });
    }
    
    const saveEquipmentHistory = () => {

        // const email = user && user.s_email;
        // const now = moment().local().format('MM/DD/YYYY hh:mm A');

        const i_report_id = i_id;
        const t_created = now;
        const s_created_by = email;

        baseApiUrl && headerAuthCode &&
        axios.post(`${baseApiUrl}/addEquipmentRecord`, {
            i_report_id,
            s_equipment_id,
            s_equipment_type,
            s_incident_notes,
            s_maintenance_history,
            s_maintenance_item_found,
            t_created,
            s_created_by
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setEquipmentHistoryData(response.data);
            resetItems();
        }).catch(error => {

        });
    }

    const enableSaveEquipmentHistory = () => {
        for (let i = 0; i < editItemsArray.length; i++) {
            if (editItemsArray[i].length < 1) {
                return false;
            }
        }
        return true;
    }

    const resetItems = () => {
        const methodsArray = [set_s_equipment_id, set_s_equipment_type, set_s_incident_notes, set_s_maintenance_history, set_s_maintenance_item_found];
        for (let i = 0; i < methodsArray.length; i++) {
            methodsArray[i]('');
        }
    }

    const initializeModalEdit = (id) => {
        const selectedItem = equipmentHistoryData.filter(d => d.id === id)[0];
        setEditEquipmentRecordId(selectedItem.id);
        setEditEquipmentId(selectedItem.s_equipment_id);
        setEditEquipmentType(selectedItem.s_equipment_type);
        setEditIncidentNotes(selectedItem.s_incident_notes);
        setEditMaintenanceHistory(selectedItem.s_maintenance_history);
        setEditMaintenanceItemFound(selectedItem.s_maintenance_item_found);
        setModalEditOpen(!modalEditOpen);
    }

    const editSmsEquipmentRecord = () => {
        const i_report_id = i_id;
        const id = editEquipmentRecordId;
        const s_equipment_id = editEquipmentId;
        const s_equipment_type = editEquipmentType;
        const s_incident_notes = editIncidentNotes;
        const s_maintenance_history = editMaintenanceHistory;
        const s_maintenance_item_found = editMaintenanceItemFound;
        const t_modified = now;
        const s_modified_by = email;

        axios.post(`${baseApiUrl}/editSmsEquipmentRecord`, {
            i_report_id,
            id,
            s_equipment_id,
            s_equipment_type,
            s_incident_notes,
            s_maintenance_history,
            s_maintenance_item_found,
            t_modified,
            s_modified_by
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setEquipmentHistoryData(response.data);
            setModalEditOpen(!modalEditOpen);
            createSuccessNotification('Saved');
        }).catch(error => {

        });
    }

    const deleteEquipmentHistoryRecord = () => {
        const i_report_id = i_id;
        const id = editEquipmentRecordId;

        axios.post(`${baseApiUrl}/deleteEquipmentHistoryRecord`, {
            i_report_id,
            id
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setEquipmentHistoryData(response.data);
            setModalEditOpen(!modalEditOpen);
            createSuccessNotification('Record Deleted');
        }).catch(error => {

        });
    }

    return (
        <WithWizard render={({ next }) => (
            <div className="wizard-basic-step">
                <Form>
                    <div className='text-center'>
                    <h3 className='mb-0 pb-0'>Incident Investigation Report: Equipment History</h3>
                        <hr></hr>
                    </div>
                    <FormGroup style={{height: '480px', overflowY: 'scroll', overflowX: 'hidden'}}>
                        <div className="form-group position-relative align-left mb-0">
                            <Row>
                                <Col md='12' lg='12'>
                                    <h4>Identify any equipment involved. Describe preventative maintenance history and actions (post-incident) taken to remove from service and inspect for mechanical issues.</h4>
                                    <Table striped style={{tableLayout: 'fixed'}}>
                                        <thead>
                                            <tr>
                                                <th width='2%'>#</th>
                                                <th width='10%'>Equipment Type</th>
                                                <th width='10%'>Equipment ID</th>
                                                <th width='18%'>Incident Notes</th>
                                                <th width='19%'>Maintenance History</th>
                                                <th width='19%'>Maintenance Item Found</th>
                                                <th width='6%'>Created</th>
                                                <th width='10%'>Created by</th>
                                                <th width='2%'></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                equipmentHistoryData.map((d, i) => 
                                                    <tr key={i}>
                                                        <td>{i+1}</td>
                                                        <td>{d.s_equipment_type}</td>
                                                        <td>{d.s_equipment_id}</td>
                                                        <td>{d.s_incident_notes}</td>
                                                        <td>{d.s_maintenance_history}</td>
                                                        <td>{d.s_maintenance_item_found}</td>
                                                        <td>{moment(d.t_created).format('MM/DD/YYYY')}</td>
                                                        <td>{d.s_created_by}</td>
                                                        <td>
                                                            <i className="fas fa-edit" onClick={() => initializeModalEdit(d.id)}></i>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </Table> 
                                </Col>
                            </Row>
                            <Row>
                                <Col md='12' lg='12'>
                                    <Table style={{tableLayout: 'fixed'}}>
                                        <thead>

                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th width='2%'>

                                                </th>
                                                <th width='10%'>
                                                    <input type='text' value={s_equipment_type} onChange={(e) => set_s_equipment_type(e.target.value)} style={{width: '100%'}} /> 
                                                </th>
                                                <th width='10%'>
                                                    <input type='text' value={s_equipment_id} onChange={(e) => set_s_equipment_id(e.target.value)} style={{width: '100%'}} /> 
                                                </th>
                                                <th width='18%'>
                                                    <input type='text' value={s_incident_notes} onChange={(e) => set_s_incident_notes(e.target.value)} style={{width: '100%'}} />
                                                </th>
                                                <th width='19%'>
                                                    <input type='text' value={s_maintenance_history} onChange={(e) => set_s_maintenance_history(e.target.value)} style={{width: '100%'}}/> 
                                                </th>
                                                <th width='19%'>
                                                    <input type='text' value={s_maintenance_item_found} onChange={(e) => set_s_maintenance_item_found(e.target.value)} style={{width: '100%'}} /> 
                                                </th>
                                                <th>
                                                    <button onClick={() => saveEquipmentHistory()} type="button" disabled={!enableSaveEquipmentHistory()} className={`btn ${enableSaveEquipmentHistory() ? 'btn-success' : 'btn-danger'}`}>
                                                        <span style={{position: 'relative', top: '-3px', fontWeight: 'bold'}}>Add</span><i className={`ml-2 ${enableSaveEquipmentHistory() ? 'far fa-check-circle' : 'fas fa-times-circle'}`}  style={{fontSize: '20px'}}></i>
                                                    </button>
                                                </th>
                                                <th>

                                                </th>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col md='6' lg='6' className='text-center'>
                                    <h4>Weather and Environment</h4>
                                </Col>
                                <Col md='6' lg='6' className='text-center'>
                                    <h4>Similar Incidents</h4>
                                </Col>
                            </Row>
                            <Row className='px-3 mt-2'>
                                <Col md='6' lg='6' className='pr-4'>
                                    <Row>
                                        <h4>Describe the weather or conditions at the time of the incident.</h4>
                                    </Row>
                                    <Row>
                                        <textarea style={{width: '100%'}} value={s_weather_environment_description} id={'s_weather_environment_description'} onChange={(e) => handleInput(e)}>

                                        </textarea>
                                    </Row>
                                </Col>
                                <Col md='6' lg='6' className='pl-4'>
                                    <Row>
                                        <h4>Describe the weather or conditions at the time of the incident.</h4>
                                    </Row>
                                    <Row>
                                        <textarea style={{width: '100%'}} value={s_weather_similar_incidents_description} id={'s_weather_similar_incidents_description'} onChange={(e) => handleInput(e)}>

                                        </textarea>
                                    </Row>
                                </Col>
                            </Row>  
                        </div>
                    </FormGroup>
                </Form>
                {/* <Button color="success" onClick={() => saveReportWithNotification()} style={{position: 'absolute', right: '40%'}}>
                    Save
                </Button> */}
                <ModalEditEquipmentRecord 
                    open={modalEditOpen}
                    handleModal={() => setModalEditOpen(!modalEditOpen)}
                    editEquipmentId={editEquipmentId}
                    editEquipmentType ={editEquipmentType}
                    editIncidentNotes ={editIncidentNotes}
                    editMaintenanceHistory={editMaintenanceHistory}
                    editMaintenanceItemFound={editMaintenanceItemFound}
                    setEditEquipmentId={setEditEquipmentId}
                    setEditEquipmentType={setEditEquipmentType}
                    setEditIncidentNotes={setEditIncidentNotes}
                    setEditMaintenanceHistory={setEditMaintenanceHistory}
                    setEditMaintenanceItemFound={setEditMaintenanceItemFound}
                    editSmsEquipmentRecord={editSmsEquipmentRecord}
                    deleteEquipmentHistoryRecord={deleteEquipmentHistoryRecord}
                />
            </div>
        )} />
    );    
}

export default Step7Wizard;