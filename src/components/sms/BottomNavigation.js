import React, { Component } from "react";
import { WithWizard } from 'react-albus';
import { Button } from "reactstrap";

export class BottomNavigation extends Component {

    runStepProcedures = (step) => {
        if (step.id === 'step8') {
            this.props.manageIncidentFactors();
        } else if (step.id === 'step9') {
            this.props.manageRootCauseAnalysisFindings();
        } else if (step.id === 'step10') {
            this.props.manageSmsWhyMethodologyFactors();
        }
    }

    handleNext = (next, steps, step) => {
        this.props.onClickNext(next, steps, step); 
        const {selectedReportId, saveReady} = this.props;
        console.log(`&&&&&&&&&&&&&& RUNNING handleNext &&&&&&&&&&&&&&`);

        // if (selectedReportId && selectedReportId !== null && saveReady && saveReady) {
        if (saveReady && saveReady) {
            console.log(`&&&&&&&&&&&&&& RUNNING saveReportSteps &&&&&&&&&&&&&&`);
          this.props.saveReport();
          this.runStepProcedures(step);  
        }
    }

    handlePrevious = (previous, steps, step) => {
        this.props.onClickPrev(previous, steps, step);
        const {selectedReportId, saveReady} = this.props;
        if (saveReady && saveReady) {
          this.props.saveReport();
          this.runStepProcedures(step);  
        }
    }

    render() {
        return (
            <WithWizard render={({ next, previous, step, steps }) => (
                <div className={"wizard-buttons " + this.props.className}>
                    <Button color="primary"
                        className={"mr-1 " + (steps.indexOf(step) <= 0 ? "disabled" : "")}
                        // onClick={() => { this.props.onClickPrev(previous, steps, step) }}>
                        onClick={() => { this.handlePrevious(previous, steps, step) }}>
                        {this.props.prevLabel}
                    </Button>

                    <Button color="primary"
                        className={(steps.indexOf(step) >= steps.length - 1 || !this.props.resolveReportStartComplete() ? "disabled" : "")}
                        onClick={() => { this.props.resolveReportStartComplete() && this.handleNext(next, steps, step) }}>
                        {this.props.nextLabel}
                    </Button>
                </div>
            )} />
        )
    }
}
