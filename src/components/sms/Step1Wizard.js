import React from "react";
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput } from "reactstrap";
import { Wizard, WithWizard, Steps, Step } from 'react-albus';

const Step1Wizard = ({
    handleInput, 
    handleCheckBoxes, 
    resolveReportStartComplete, 
    s_station, 
    s_customer,
    s_incident_location, 
    t_incident, 
    s_investigation_conducted_by, 
    s_investigation_conducted_by_title, 
    d_investigation_conducted, 
    s_investigation_approved_by, 
    s_investigation_approved_by_title, 
    d_investigation_approved,
    b_evidence_witness_statements,
    b_evidence_training_records,
    b_evidence_drug_alcohol_testing_docs,
    b_evidence_external_reports,
    b_evidence_photos,
    b_evidence_cctv_footage,
    b_evidence_other,
}) => {
    return(
        <div className="wizard-basic-step">
            <Form>
                <div className='text-center'>
                    <h1 className='mb-0 pb-0'>Incident Investigation Report</h1>
                    <h4 className='mb-0 pb-0'>INTERNAL USE ONLY</h4>
                    <hr></hr>
                </div>
                <FormGroup className='mb-0' style={{height: '480px', overflowY: 'scroll', overflowX: 'hidden'}}>
                    <WithWizard render={({ next }) => (
                        <div className="form-group position-relative align-left mb-0">
                            <h5>
                                Instructions:
                                General Manager is to complete initial report within 24 hours of incident and submit to Regional Safety Director for incident triage and preliminary review.  Regional Safety Manager will continue to work with the site General Manager until investigation is completed and final report is submitted and approved by the Regional Safety Director
                            </h5>   
                            <div className='row'>
                                <div className='col-6' style={{fontSize: '18px'}}>
                                    <table style={{borderSpacing: '15px', borderCollapse: 'separate'}}>
                                        <tbody>
                                            <tr>
                                                <td>Choice Station / Location</td>
                                                <td><Input type='text' value={s_station} id={'s_station'} onChange={(e) => handleInput(e)} style={{height: '25px', width: '300px'}}></Input></td>
                                            </tr>
                                            <tr>
                                                <td>Customer / Air Carrier Involved</td>
                                                <td><Input type='text' value={s_customer} id={'s_customer'} onChange={(e) => handleInput(e)} style={{height: '25px', width: '300px'}}></Input></td>
                                            </tr>
                                            <tr>
                                                <td>Incident Location</td>
                                                <td>
                                                    <input type='text' id='s_incident_location' value={s_incident_location} onChange={(e) => handleInput(e)} className="form-control" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Incident Date / Time</td>
                                                <td>
                                                <input 
                                                    type='datetime-local' 
                                                    className="form-control" 
                                                    id={'t_incident'}
                                                    onChange={(e) => handleInput(e)}
                                                    // onChange={(e) => handleIdType1Exp(e)}
                                                    defaultValue={t_incident}
                                                    // defaultValue={moment(d_company_driver_id_expiration_1).format('YYYY-MM-DD')}
                                                />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{fontWeight: "bolder"}}>Investigation conducted by</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>Name</td>
                                                <td><Input type='text' value={s_investigation_conducted_by} id={'s_investigation_conducted_by'} onChange={(e) => handleInput(e)} style={{height: '25px', width: '300px'}}></Input></td>
                                            </tr>
                                            <tr>
                                                <td>Title</td>
                                                <td><Input type='text' value={s_investigation_conducted_by_title} id={'s_investigation_conducted_by_title'} onChange={(e) => handleInput(e)} style={{height: '25px', width: '300px'}}></Input></td>
                                            </tr>
                                            <tr>
                                                <td>Date</td>
                                                <td>
                                                    <input 
                                                        type='date' 
                                                        className="form-control" 
                                                        id={'d_investigation_conducted'}
                                                        onChange={(e) => handleInput(e)}
                                                        defaultValue={d_investigation_conducted}
                                                        // defaultValue={moment(d_company_driver_id_expiration_1).format('YYYY-MM-DD')}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{fontWeight: "bolder"}}>Investigation approved by</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>Name</td>
                                                <td><Input type='text' value={s_investigation_approved_by} id={'s_investigation_approved_by'} onChange={(e) => handleInput(e)} style={{height: '25px', width: '300px'}}></Input></td>
                                            </tr>
                                            <tr>
                                                <td>Title</td>
                                                <td><Input type='text' value={s_investigation_approved_by_title} id={'s_investigation_approved_by_title'} onChange={(e) => handleInput(e)} style={{height: '25px', width: '300px'}}></Input></td>
                                            </tr>
                                            <tr>
                                                <td>Date</td>
                                                <td>
                                                    <input 
                                                        type='date' 
                                                        className="form-control" 
                                                        id={'d_investigation_approved'}
                                                        onChange={(e) => handleInput(e)}
                                                        defaultValue={d_investigation_approved}
                                                        // defaultValue={moment(d_company_driver_id_expiration_1).format('YYYY-MM-DD')}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody> 
                                    </table>
                                </div>
                                <div className='col-6 mt-1'>
                                    <h3 className='mt-2'>
                                        Included (check all that apply):
                                    </h3>
                                    <FormGroup className='mb-0' style={{fontSize: '20px'}}>
                                        <CustomInput
                                            type="checkbox"
                                            id="b_evidence_witness_statements"
                                            onClick={(e) => handleCheckBoxes(e)}
                                            checked={b_evidence_witness_statements}
                                            label="Witness Statement(s)"
                                            className="mb-2"
                                        />
                                        <CustomInput
                                            type="checkbox"
                                            id="b_evidence_training_records"
                                            onClick={(e) => handleCheckBoxes(e)}
                                            checked={b_evidence_training_records}
                                            className="mb-2"
                                            label="Applicable Training Record(s)"
                                        />
                                        <CustomInput
                                            type="checkbox"
                                            id="b_evidence_drug_alcohol_testing_docs"
                                            onClick={(e) => handleCheckBoxes(e)}
                                            checked={b_evidence_drug_alcohol_testing_docs}
                                            className="mb-2"
                                            label="Drug and Alcohol Testing Documents"
                                        />
                                        <CustomInput
                                            type="checkbox"
                                            id="b_evidence_external_reports"
                                            onClick={(e) => handleCheckBoxes(e)}
                                            checked={b_evidence_external_reports}
                                            className="mb-2"
                                            label="External Reports (for example: police report, maintenance records, etc.)"
                                        />
                                        <CustomInput
                                            type="checkbox"
                                            id="b_evidence_photos"
                                            onClick={(e) => handleCheckBoxes(e)}
                                            checked={b_evidence_photos}
                                            className="mb-2"
                                            label="Photos"
                                        />
                                        <CustomInput
                                            type="checkbox"
                                            id="b_evidence_cctv_footage"
                                            onClick={(e) => handleCheckBoxes(e)}
                                            checked={b_evidence_cctv_footage}
                                            className="mb-2"
                                            label="CCTV Footage"
                                        />
                                        <CustomInput
                                            type="checkbox"
                                            id="b_evidence_other"
                                            onClick={(e) => handleCheckBoxes(e)}
                                            checked={b_evidence_other}
                                            className="mb-2"
                                            label="Other"
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                    )} />
                </FormGroup>
            </Form>
        </div>
    );
}

export default Step1Wizard;