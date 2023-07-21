import React, { Component, Fragment } from "react";
import { WithWizard } from 'react-albus';
import { NavLink } from "react-router-dom";
export class TopNavigation extends Component {
  constructor(props) {
    super(props);
    this.getClassName = this.getClassName.bind(this);
    this.itemClick = this.itemClick.bind(this);
  }

  getClassName(steps, step, index, stepItem) {
    if (steps.indexOf(step) === index) {
      return "step-doing";
    } else if (steps.indexOf(step) > index || stepItem.isDone) {
      stepItem.isDone = true;
      return "step-done";
    }
  }

  
  runStepProcedures = (step) => {
    if (step.id === 'step8') {
        this.props.manageIncidentFactors();
    } else if (step.id === 'step9') {
        this.props.manageRootCauseAnalysisFindings();
    } else if (step.id === 'step10') {
        this.props.manageSmsWhyMethodologyFactors();
    }
  }

  itemClick(step, stepItem, push) {
    const {selectedReportId, saveReady} = this.props;
    if (selectedReportId && selectedReportId !== null && saveReady && saveReady) {
      this.props.saveReport();
      this.runStepProcedures(step);  
    }
    if (this.props.disableNav) {
      return;
    }
    this.props.topNavClick(stepItem, push)
  }

  render() {
    return (
      <WithWizard render={({ next, previous, step, steps, go, push }) => (
        <ul style={{fontSize: '20px'}} className={"nav nav-tabs " + this.props.className + (this.props.disableNav ? " disabled" : "")}>
          {
            steps.map((stepItem, index) => {
              if (!stepItem.hideTopNav) {
                return (
                  <li key={index} className={"nav-item " + this.getClassName(steps, step, index, stepItem)}>
                    <NavLink to="#" location={{}} className="nav-link" onClick={() => this.itemClick(step, stepItem, push)}>
                      <span>{stepItem.name}</span>
                      <small>{stepItem.desc}</small>
                    </NavLink>
                  </li>
                )
              } else {
                return <Fragment key={index} />
              }
            })
          }
        </ul>
      )} />
    )
  }
}