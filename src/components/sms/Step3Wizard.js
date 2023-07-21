import React from "react";
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button } from "reactstrap";
import { Wizard, WithWizard, Steps, Step } from 'react-albus';

import Media from './Media';
import DisplayMedia from './DisplayMedia';

const Step3Wizard = ({getFiles, fileInputKey, saveSmsMedia, deleteSmsMedia, updateComments, mediaArray}) => {
    return(
        <WithWizard render={({ next }) => (
            <div className="wizard-basic-step">
                <Form>
                    <div className='text-center'>
                        <h3 className='mb-0 pb-0'>Incident Investigation Report: Media</h3>
                        <hr></hr>
                    </div>
                    <FormGroup style={{height: '480px', overflowY: 'scroll', overflowX: 'hidden'}}>
                        <div className="form-group position-relative align-left mb-0">
                            <div className='row'>
                                <div className='col-3'>
                                    <Media getFiles={getFiles} fileInputKey={fileInputKey} id={1} updateComments={updateComments} />
                                </div>
                                <div className='col-3'>
                                    <Media getFiles={getFiles} fileInputKey={fileInputKey} id={2} updateComments={updateComments} />
                                </div>
                                <div className='col-3'>
                                    <Media getFiles={getFiles} fileInputKey={fileInputKey} id={3} updateComments={updateComments} />
                                </div>
                                <div className='col-3'>
                                    <Media getFiles={getFiles} fileInputKey={fileInputKey} id={4} updateComments={updateComments} />
                                </div>
                            </div>
                        </div>
                        <div>
                    <h3 className='text-center'>Previously Uploaded Media:</h3>
                    <div className='row' style={{overflowY: 'scroll', height: '450px'}}>
                        {mediaArray.map((m, i) => <DisplayMedia mediaObj={m} deleteSmsMedia={deleteSmsMedia} key={i} />)}
                    </div>
                </div>
                    </FormGroup>
                </Form>
                {/* <Button onClick={(e) => saveSmsMedia(e)} color="success" style={{position: 'absolute', right: '40%'}}>
                    Save
                </Button> */}
            </div>
        )} />
    );
}

export default Step3Wizard;