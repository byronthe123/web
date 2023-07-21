import React from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button, Col, Row } from "reactstrap";
import { Wizard, WithWizard, Steps, Step } from 'react-albus';

import EmployeeSafetyHistory from './EmployeeSafetyHistory';

const Step9Wizard = ({
    handleInput,
    rcaFindingsArray,
    updateRcaFindingsArray,
    addRcaFindingsArray,
    deleteRcaFindingsArray
}) => {
    return (
        <WithWizard render={({ next }) => (
            <div className="wizard-basic-step">
                <Form>
                    <div className='text-center'>
                    <h3 className='mb-0 pb-0'>Incident Investigation Report: Root Cause Analysis Findings</h3>
                        <hr></hr>
                    </div>
                    <FormGroup style={{height: '480px', overflowY: 'scroll', overflowX: 'hidden'}}>
                        <div className="form-group position-relative align-left mb-0">
                            <div className='row'>
                                <div className='col-12'>
                                    <FormGroup className='py-0 mb-0'>
                                        <h3 className='text-center'>Identify each individual finding that contributed to the incident.  Root Cause Analysis (RCA)</h3>
                                        {
                                            rcaFindingsArray && rcaFindingsArray.length === 0 && <h4 className='text-center'>None added - please click the button to add a new RCA Finding.</h4>
                                        }
                                        {
                                            rcaFindingsArray && rcaFindingsArray.map((f, i) =>
                                                <Row>
                                                    <Col md='1' lg='1'>
                                                        <h4>Finding {i+1}</h4>
                                                    </Col>
                                                    <Col md='10' lg='10'>
                                                        <textarea key={i} value={f.s_finding} onChange={(e) => updateRcaFindingsArray(i, e.target.value)} style={{width: '100%'}}></textarea>
                                                    </Col>
                                                    <Col md='1' lg='1'>
                                                        <i onClick={() => deleteRcaFindingsArray(i)} className="fas fa-trash my-2" style={{fontSize: '24px'}}></i>
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                        <Button color='success' onClick={(e) => addRcaFindingsArray(e)}>Add New</Button> 
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                    </FormGroup>
                </Form>
                {/* <Button color="success" onClick={() => saveReportWithNotification()} style={{position: 'absolute', right: '40%'}}>
                    Save
                </Button> */}
            </div>
        )} />
    );    
}

export default Step9Wizard;