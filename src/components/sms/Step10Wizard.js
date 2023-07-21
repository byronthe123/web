import React from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button, Col, Row } from "reactstrap";
import { Wizard, WithWizard, Steps, Step } from 'react-albus';


const Step10Wizard = ({
    handleInput,
    s_incident_cause,
    s_investigation_conclusion,
    whyFactorsArray,
    updateWhyFactorsArray,
    addWhyFactorsArray,
    deleteWhyFactorsArray
}) => {
    return (
        <WithWizard render={({ next }) => (
            <div className="wizard-basic-step">
                <Form>
                    <div className='text-center'>
                    <h3 className='mb-0 pb-0'>Incident Investigation Report: Why Methodology Factors</h3>
                        <hr></hr>
                    </div>
                    <FormGroup style={{height: '480px', overflowY: 'scroll', overflowX: 'hidden'}}>
                        <div className="form-group position-relative align-left mb-0">
                            <div className='row'>
                                <div className='col-12'>
                                    <FormGroup className='py-0 mb-0'>
                                        <h3 className='text-center'>Using the “5 Why” methodology, identify the causal factor for findings of the unsafe act or condition that was responsible for the incident.  For multiple findings, it will be necessary to complete an RCA for each finding.</h3>
                                            <Row>
                                                <Col md='12' lg='12'>
                                                    <h4>Clearly state what caused the accident/incident</h4>
                                                </Col>
                                                <Col md='12' lg='12'>
                                                    <textarea id={'s_incident_cause'} value={s_incident_cause} onChange={(e) => handleInput(e)} style={{width: '100%'}}></textarea>
                                                </Col>
                                            </Row>
                                            <Row className='my-5'>
                                                <Col md='12' lg='12'>
                                                    <h4>Why Factors:</h4>
                                                </Col>
                                                {
                                                    whyFactorsArray && whyFactorsArray.map((f, i) => 
                                                        <>
                                                            <Col md='12' lg='12'>
                                                                <h5>{i+1}. Why did this occur?</h5>
                                                            </Col> 
                                                            <Col md='11' lg='11'>
                                                                <textarea key={i} value={f.s_why_factor} onChange={(e) => updateWhyFactorsArray(i, e.target.value)} style={{width: '100%'}}></textarea>
                                                            </Col>
                                                            <Col md='1' lg='1'>
                                                                <i onClick={() => deleteWhyFactorsArray(i)} className="fas fa-trash my-2" style={{fontSize: '24px'}}></i>
                                                            </Col>
                                                        </>
                                                    )
                                                }
                                                <Col md='12' lg='12'>
                                                    <Button color="success" onClick={(e) => addWhyFactorsArray(e)}>
                                                        Add New Factor
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md='12' lg='12'>
                                                    <h2>Conclusions to Investigation.</h2>
                                                </Col>
                                                <Col md='12' lg='12'>
                                                    <h4>Provide clear and accurate conclusions of the investigation that are supported by the findings and root cause of the accident.</h4>
                                                </Col>
                                                <Col md='12' lg='12'>
                                                    <textarea id={'s_investigation_conclusion'} value={s_investigation_conclusion} onChange={(e) => handleInput(e)} style={{width: '100%'}}></textarea>
                                                </Col>
                                            </Row>
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

export default Step10Wizard;