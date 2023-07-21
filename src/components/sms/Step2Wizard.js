import React from "react";
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button } from "reactstrap";
import { Wizard, WithWizard, Steps, Step } from 'react-albus';
import moment from 'moment';

import NewUserModal from './NewUserModal';
import EditUserModal from './EditUserModal';

const Step2Wizard = ({
    employees,
    handleSelectEmployee,
    selectedEmloyee,
    handleInput,
    handleEmployeeInjury,
    handleAircraftDamage, 
    saveReport,
    saveReportWithNotification,
    s_incident_reference,
    s_incident_type,
    d_incident_date,
    s_incident_station,
    s_station,
    s_employee_shift_start,
    i_employee_hours_on_duty,
    i_employee_hours_worked_in_72,
    s_employee_regular_days_off,
    s_employee_injury_type,
    s_aircraft_damage_type,
    s_airline,
    s_airline_registration,
    s_third_party_incident,
    s_environmental_incident,
    s_vehicle_accident,
    s_incident_summary,
    s_post_incident_actions,
    s_name,
    s_job_title,
    s_department,
    d_date_of_hire,
    newUserModal,
    handleNewUserModal,
    editUserModal,
    handleEditUserModal,
    launchModalCreateUser,
    handleDateOfHire,
    enableCreateUser,
    handleCreateUser,
    handleUpdateUser
}) => {

    return(
        <WithWizard render={({ next }) => (
            <div className="wizard-basic-step">
                <Form>
                    <div className='text-center'>
                        <h3 className='mb-0 pb-0'>Incident Investigation Report: Incident Details</h3>
                        <hr></hr>
                    </div>
                    <FormGroup style={{height: '440px', overflowY: 'scroll', overflowX: 'hidden'}}>
                        <div className="form-group position-relative align-left mb-0">
                            <div className='row'>
                                <div className='col-4'>
                                    <h5 style={{fontWeight: 'bolder'}} className='ml-3 mb-0'>Incident Information</h5>
                                    <table style={{borderSpacing: '15px', borderCollapse: 'separate'}}>
                                        <tbody>
                                            <tr>
                                                <td>Choice Incident Reference</td>
                                                <td><Input value={s_incident_reference} id={'s_incident_reference'} onChange={(e) => handleInput(e)} type='text' style={{height: '25px'}}></Input></td>
                                            </tr>
                                            <tr>
                                                <td>Incident Type</td>
                                                <td>
                                                    <FormGroup className='py-0 mb-0'>
                                                        <select value={s_incident_type} id={'s_incident_type'} onChange={(e) => handleInput(e)} style={{width: '405px', height: '25px'}}>
                                                            <option value="EMPLOYEE INJURY">Employee Injury</option>
                                                            <option value="AIRCRAFT DAMAGE">Aircraft Damage</option>
                                                            <option value="THIRD PARTY INCIDENT">Third Party Incident</option>
                                                            <option value="ENVIRONMENTAL INCIDENT">Environmental Incident</option>
                                                            <option value="VEHICLE ACCIDENT">Vehicle Accident</option>
                                                        </select>
                                                    </FormGroup>                                                                    
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Date
                                                </td>
                                                <td>
                                                    <input 
                                                        type='date' 
                                                        className="form-control py-0" 
                                                        onChange={(e) => handleInput(e)}
                                                        id={'d_incident_date'}
                                                        value={d_incident_date}
                                                        // defaultValue={moment(d_company_driver_id_expiration_1).format('YYYY-MM-DD')}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Incident Station</td>
                                                <td>
                                                    {/* {s_station} */}
                                                    <Input value={s_station} id={'s_incident_station'} type='text' style={{height: '25px'}}></Input>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className='col-8'>
                                    <h5 style={{fontWeight: 'bolder'}} className='mb-2'>Severity of Incident</h5>
                                    <div className='row' style={{fontSize: '16px'}}>
                                        <div className='col-6'>
                                            <h6 className='mb-2'>Employee Injury</h6>
                                                <div className="form-group position-relative">
                                                    <div className="custom-control screening-type custom-radio">
                                                        <input type="radio" value={'FATALITY'} checked={s_employee_injury_type === 'FATALITY'} name="employee_injury" onClick={(e) => handleEmployeeInjury(e)}
                                                                className="custom-control-input" id="fatality"/>
                                                        <label className="custom-control-label" htmlFor="fatality">
                                                            Fatality
                                                        </label>
                                                    </div>
                                                    <div className="custom-control screening-type custom-radio">
                                                        <input type="radio" value={'SEVERE INJURY'} checked={s_employee_injury_type === 'SEVERE INJURY'} name="employee_injury" onClick={(e) => handleEmployeeInjury(e)}
                                                                className="custom-control-input btn btn-secondary" id="severeInjury"/>
                                                        <label className="custom-control-label" htmlFor="severeInjury">
                                                            Severe Injury (i.e. amputation, fracture, hospitalization, loss of eye)
                                                        </label>
                                                    </div>
                                                    <div className="custom-control screening-type custom-radio">
                                                        <input type="radio" value={'LOST TIME INJURY 3 DAYS OR GREATER'} checked={s_employee_injury_type === 'LOST TIME INJURY 3 DAYS OR GREATER'} name="employee_injury" onClick={(e) => handleEmployeeInjury(e)}
                                                                className="custom-control-input btn btn-secondary" id="lostTimeInjury3Plus"/>
                                                        <label className="custom-control-label" htmlFor="lostTimeInjury3Plus">
                                                            Lost Time Injury (3 days or greater)
                                                        </label>
                                                    </div>
                                                    <div className="custom-control screening-type custom-radio">
                                                        <input type="radio" value={'LOST TIME INJURY LESS THAN 3 DAYS'} checked={s_employee_injury_type === 'LOST TIME INJURY LESS THAN 3 DAYS'} name="employee_injury" onClick={(e) => handleEmployeeInjury(e)}
                                                                className="custom-control-input btn btn-secondary" id="lostTimeInjury3Less"/>
                                                        <label className="custom-control-label" htmlFor="lostTimeInjury3Less">
                                                            Lost Time Injury (less than 3 days)
                                                        </label>
                                                    </div>
                                                    <div className="custom-control screening-type custom-radio">
                                                        <input type="radio" value={'FIRST AID ONLY NO LOST TIME'} checked={s_employee_injury_type === 'FIRST AID ONLY NO LOST TIME'} name="employee_injury" onClick={(e) => handleEmployeeInjury(e)}
                                                                className="custom-control-input btn btn-secondary" id="firstAidInjury"/>
                                                        <label className="custom-control-label" htmlFor="firstAidInjury">
                                                            First Aid Only (No lost time)
                                                        </label>
                                                    </div>
                                                </div>
                                        </div>
                                        <div className='col-6'>
                                            <h6 className='mb-2'>Aircraft Damage</h6>
                                            <div className="form-group position-relative" style={{fontSize: '16px'}}>
                                                <div className="custom-control screening-type custom-radio">
                                                    <input type="radio" value={'FATALITY'} checked={s_aircraft_damage_type === 'FATALITY'} name="aircraft_damage" onClick={(e) => handleAircraftDamage(e)}
                                                            className="custom-control-input" id="fatalityAircraft"/>
                                                    <label className="custom-control-label" htmlFor="fatalityAircraft">
                                                        Fatality
                                                    </label>
                                                </div>
                                                <div className="custom-control screening-type custom-radio">
                                                    <input type="radio" value={'SEVERE INJURY'} checked={s_aircraft_damage_type === 'SEVERE INJURY'} name="aircraft_damage" onClick={(e) => handleAircraftDamage(e)}
                                                            className="custom-control-input btn btn-secondary" id="severeInjuryAircraft"/>
                                                    <label className="custom-control-label" htmlFor="severeInjuryAircraft">
                                                        Severe Injury (i.e. amputation, fracture, hospitalization, loss of eye)
                                                    </label>
                                                </div>
                                                <div className="custom-control screening-type custom-radio">
                                                    <input type="radio" value={'LOST TIME INJURY 3 DAYS OR GREATER'} checked={s_aircraft_damage_type === 'LOST TIME INJURY 3 DAYS OR GREATER'} name="aircraft_damage" onClick={(e) => handleAircraftDamage(e)}
                                                            className="custom-control-input btn btn-secondary" id="lostTimeInjury3PlusAircraft"/>
                                                    <label className="custom-control-label" htmlFor="lostTimeInjury3PlusAircraft">
                                                        Lost Time Injury (3 days or greater)
                                                    </label>
                                                </div>
                                                <div className="custom-control screening-type custom-radio">
                                                    <input type="radio" value={'LOST TIME INJURY LESS THAN 3 DAYS'} checked={s_aircraft_damage_type === 'LOST TIME INJURY LESS THAN 3 DAYS'} name="aircraft_damage" onClick={(e) => handleAircraftDamage(e)}
                                                            className="custom-control-input btn btn-secondary" id="lostTimeInjury3LessAircraft"/>
                                                    <label className="custom-control-label" htmlFor="lostTimeInjury3LessAircraft">
                                                        Lost Time Injury (less than 3 days)
                                                    </label>
                                                </div>
                                                <div className="custom-control screening-type custom-radio">
                                                    <input type="radio" value={'FIRST AID ONLY NO LIST TIME'} checked={s_aircraft_damage_type === 'FIRST AID ONLY NO LIST TIME'} name="aircraft_damage" onClick={(e) => handleAircraftDamage(e)}
                                                            className="custom-control-input btn btn-secondary" id="firstAidInjuryAircraft"/>
                                                    <label className="custom-control-label" htmlFor="firstAidInjuryAircraft">
                                                        First Aid Only (No lost time)
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-12'>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Airline</td>
                                                <td><Input type='text' value={s_airline} id={'s_airline'} onChange={(e) => handleInput(e)} style={{height: '25px', width: '405px'}}></Input></td>
                                            </tr>
                                            <tr>
                                                <td>Registration #</td>
                                                <td><Input type='text' value={s_airline_registration} id={'s_airline_registration'} onChange={(e) => handleInput(e)} style={{height: '25px', width: '405px'}}></Input></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className='mt-3' style={{fontSize: '16px'}}>
                                        <tbody>
                                            <tr>
                                                <td>Third Party Incident</td>
                                                <td><Input type='text' value={s_third_party_incident} id={'s_third_party_incident'} onChange={(e) => handleInput(e)} style={{height: '25px'}}></Input></td>
                                            </tr>
                                            <tr>
                                                <td>Environmetal Incident</td>
                                                <td><Input type='text' value={s_environmental_incident} id={'s_environmental_incident'} onChange={(e) => handleInput(e)} style={{height: '25px'}}></Input></td>
                                            </tr>
                                            <tr>
                                                <td>Vehicle Accident</td>
                                                <td><Input type='text' value={s_vehicle_accident} id={'s_vehicle_accident'} onChange={(e) => handleInput(e)} style={{height: '25px', width: '150vh'}}></Input></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <h5 style={{fontWeight: 'bolder'}} className='mt-3'>Summary</h5>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <h6 className='mb-2'>
                                                Give a high-level overview of the incident (who/what equipment was involved, severity of injury/damage, investigation methodology, etc.)
                                            </h6>
                                            <textarea value={s_incident_summary} id={'s_incident_summary'} onChange={(e) => handleInput(e)} style={{width: '100%', height: '100%'}}>

                                            </textarea>
                                        </div>
                                        <div className='col-6'>
                                            <h6 className='mb-2'>
                                                Identify what was done to ensure immediate safety, securing the scene for investigation and the immediate notifications made.
                                            </h6>
                                            <textarea className='mt-0' value={s_post_incident_actions} id={'s_post_incident_actions'} onChange={(e) => handleInput(e)} style={{width: '100%', height: '100%', minHeight: '110px'}}>

                                            </textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="custom-control screening-type custom-radio">
                                <input type="radio" value={'iacAlsoCcsf'} checked={screeningType === 'iacAlsoCcsf'} name="type" onChange={(e) => handleScreeningType(e)} onClick={next}
                                        className="custom-control-input btn btn-secondary" id="tsaScreeningUnscreened"  required/>
                                <label className="custom-control-label" htmlFor="tsaScreeningUnscreened">
                                    IAC also CCSF
                                </label>
                            </div> */}
                        </div>
                    </FormGroup>
                </Form>

                <NewUserModal 
                    open={newUserModal}
                    handleNewUserModal={handleNewUserModal}
                    s_name={s_name}
                    s_job_title={s_job_title}
                    s_department={s_department}
                    d_date_of_hire={d_date_of_hire}
                    handleInput={handleInput}
                    handleDateOfHire={handleDateOfHire}
                    enableCreateUser={enableCreateUser}
                    handleCreateUser={handleCreateUser}
                />

                <EditUserModal 
                    open={editUserModal}
                    handleEditUserModal={handleEditUserModal}
                    launchModalCreateUser={launchModalCreateUser}
                    s_name={s_name}
                    s_job_title={s_job_title}
                    s_department={s_department}
                    d_date_of_hire={d_date_of_hire}
                    handleInput={handleInput}
                    handleDateOfHire={handleDateOfHire}
                    enableCreateUser={enableCreateUser}
                    handleCreateUser={handleCreateUser}
                    handleUpdateUser={handleUpdateUser}
                    selectedEmloyee={selectedEmloyee}
                />
                {/* <Button onClick={() => saveReportWithNotification()} color="success" style={{position: 'relative', top: '42px', left: '950px'}}>
                    Save
                </Button> */}
            </div>
        )} />
    );
}

export default Step2Wizard;