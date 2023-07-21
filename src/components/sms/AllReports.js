import React, {Fragment} from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput } from "reactstrap";
import { Wizard, WithWizard, Steps, Step } from 'react-albus';

import ReportsTable from './ReportsTable';

const AllReports = ({reports, selectReport, selectedReportId, startNewReport, onClickNext}) => {

    const handleNewReport = (next, steps, step) => {
        startNewReport(() => {
            onClickNext(next, steps, step)
        });
    }

    return (
        <div className="wizard-basic-step" style={{fontSize: '14px'}}>
            <Form>
                <div className='text-center'>
                    <h1 className='mb-0 pb-0'>Incident Investigation Report</h1>
                    <h4 className='mb-0 pb-0'>INTERNAL USE ONLY</h4>
                    <hr></hr>
                </div>
                <FormGroup className='mb-0'>
                    <WithWizard render={({ next, step, steps  }) => (
                        <div className="form-group position-relative align-left mb-0">
                            <h5>
                                Instructions:
                                General Manager is to complete initial report within 24 hours of incident and submit to Regional Safety Director for incident triage and preliminary review.  Regional Safety Manager will continue to work with the site General Manager until investigation is completed and final report is submitted and approved by the Regional Safety Director
                            </h5> 
                            <ReportsTable reports={reports} selectReport={selectReport} selectedReportId={selectedReportId} />  
                            <button onClick={() => handleNewReport(next, steps, step)}>New</button>
                        </div>
                    )} />
                </FormGroup>
            </Form>
        </div>
    );
}

export default AllReports;