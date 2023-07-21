import React, { Component } from "react";
import { Card, CardBody, Form, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { Wizard, WithWizard, Steps, Step } from 'react-albus';
import {TopNavigation} from '../../TopNavigation';
import {BottomNavigation} from '../../BottomNavigation';
import FoundIac from './FoundIac';
import FoundCcsf from './FoundCcsf';
import Select from 'react-select';
import ShipperType from './ShipperType';

class Basic extends Component {
    constructor(props) {
      super(props);
      this.onClickNext = this.onClickNext.bind(this);
      this.onClickPrev = this.onClickPrev.bind(this);
      this.topNavClick = this.topNavClick.bind(this);
    };
  
    topNavClick(stepItem, push) {
        // console.log(stepItem);
        // console.log(`screened: ${this.props.screened}`);
        // console.log(`screeningType: ${this.props.screeningType}`);
        if(stepItem.id === 'step2') {
            if(this.props.b_screened !== null) {
                push(stepItem.id);
            }
        } else if(stepItem.id === 'step3') {
            if(this.props.screeningType !== null) {
                push(stepItem.id);
            }
        } else {
            push(stepItem.id);
        }
    };
  
    onClickNext(goToNext, steps, step) {
        // console.log(step);
      step.isDone = true;
      if (steps.length - 1 <= steps.indexOf(step)) {
        return;
      }
      goToNext();
    };
  
    onClickPrev(goToPrev, steps, step) {
      if (steps.indexOf(step) <= 0) {
        return;
      }
      goToPrev();
    };

    handleNext = (e, method, next) => {
        method(e);
        next();
    }

    render() {
        const {
            b_screened, 
            handleBscreened, 
            handleScreeningType, 
            screeningType, 
            s_iac, 
            handleIacNum, 
            s_ccsf, 
            handleCcsfNum, 
            s_non_iac, 
            handleNonIac, 
            foundIac, 
            foundCcsf, 
            validIacAlsoCcsf,
            shipperType,
            setShipperType
        } = this.props;
        return (
            <Card>
                <CardBody className="wizard wizard-default" style={{fontSize: '18px'}}>
                    <Wizard>
                        <TopNavigation className="justify-content-center" disableNav={false} topNavClick={this.topNavClick} />
                        <Steps>
                            <Step id="step1" name={'Step 1'} desc={'Screening'}>
                                <div className="wizard-basic-step text-center">
                                    <Form>
                                        <h4>Screening</h4>
                                    <FormGroup>
                                        <WithWizard render={({ next }) => (
                                                <div className="form-group position-relative">
                                                    <div className="custom-control screening-type custom-radio">
                                                        <input type="radio" value={true} checked={b_screened !== null ? b_screened : false} name="screened" onChange={(e) => handleBscreened(e)} onClick={(e) => this.handleNext(e, handleBscreened, next)}
                                                                className="custom-control-input" id="tsaScreeningScreened"/>
                                                        <label className="custom-control-label" htmlFor="tsaScreeningScreened">
                                                            Screened
                                                        </label>
                                                    </div>
                                                    <div className="custom-control screening-type custom-radio">
                                                        <input type="radio" value={false} checked={b_screened !== null ? !b_screened : false} name="screened" onChange={(e) => handleBscreened(e)} onClick={(e) => this.handleNext(e, handleBscreened, next)}
                                                                className="custom-control-input btn btn-secondary" id="tsaScreeningUnscreened"/>
                                                        <label className="custom-control-label" htmlFor="tsaScreeningUnscreened">
                                                            Unscreened
                                                        </label>
                                                    </div>
                                                </div>
                                            )} />
                                        </FormGroup>
                                    </Form>
                                </div>
                            </Step>

                            <Step id="step2" name={"Step 2"} desc={"Type"}>
                                <WithWizard render={({ next }) => (
                                    <div className="wizard-basic-step text-center">
                                            {b_screened ? 
                                                <Form>
                                                    <h4>Screened</h4>
                                                    <FormGroup>
                                                        <div className="form-group position-relative">
                                                            <div className="custom-control screening-type custom-radio">
                                                                <input type="radio" value={'iacTenderCcsf'} checked={screeningType === 'iacTenderCcsf'} name="type" onChange={(e) => handleScreeningType(e)} onClick={(e) => this.handleNext(e, handleScreeningType, next)}
                                                                        className="custom-control-input" id="tsaScreeningScreened" required/>
                                                                <label className="custom-control-label" htmlFor="tsaScreeningScreened">
                                                                    IAC tender CCSF
                                                                </label>
                                                            </div>
                                                            <div className="custom-control screening-type custom-radio">
                                                                <input type="radio" value={'iacAlsoCcsf'} checked={screeningType === 'iacAlsoCcsf'} name="type" onChange={(e) => handleScreeningType(e)} onClick={(e) => this.handleNext(e, handleScreeningType, next)}
                                                                        className="custom-control-input btn btn-secondary" id="tsaScreeningUnscreened"  required/>
                                                                <label className="custom-control-label" htmlFor="tsaScreeningUnscreened">
                                                                    IAC also CCSF
                                                                </label>
                                                            </div>
                                                            <div className="custom-control screening-type custom-radio">
                                                                <input type="radio" value={'interlineTransfer'} checked={screeningType === 'interlineTransfer'} name="type" onClick={(e) => this.handleNext(e, handleScreeningType, next)}
                                                                        className="custom-control-input btn btn-secondary" id="screeningInterlineTransfer"  required/>
                                                                <label className="custom-control-label" htmlFor="screeningInterlineTransfer">
                                                                    Interline Transfer
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </FormGroup>
                                                </Form> :
                                                <Form>
                                                    <h4 className='text-center'>Unscreened</h4>
                                                    <FormGroup>
                                                        <div className="form-group position-relative">
                                                            <div className="custom-control screening-type custom-radio">
                                                                <input type="radio" value={'unscreendIac'} checked={screeningType === 'unscreendIac'} name="type" onClick={(e) => this.handleNext(e, handleScreeningType, next)}
                                                                        className="custom-control-input" id="tsaScreeningScreened" required/>
                                                                <label className="custom-control-label" htmlFor="tsaScreeningScreened">
                                                                    IAC
                                                                </label>
                                                            </div>
                                                            <div className="custom-control screening-type custom-radio">
                                                                <input type="radio" value={'unscreendOthers'} checked={screeningType === 'unscreendOthers'} name="type" onClick={(e) => this.handleNext(e, handleScreeningType, next)}
                                                                        className="custom-control-input btn btn-secondary" id="tsaScreeningUnscreened"  required/>
                                                                <label className="custom-control-label" htmlFor="tsaScreeningUnscreened">
                                                                    Others
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </FormGroup>
                                                </Form>
                                            }
                                    </div>
                                )} />
                            </Step>

                            <Step id="step3" name={"Step 3"} desc={"Number"}>
                                <div className="wizard-basic-step">
                                    <Row>
                                        <Col md={3}>
                                        {
                                            screeningType === 'iacTenderCcsf' ? 
                                                <Form>
                                                    <h4 className='text-center'>IAC Tender CCSF</h4>
                                                    <FormGroup>
                                                        <Label>IAC #:</Label>
                                                        <Input type="text" value={s_iac} onChange={handleIacNum}/>
                                                    </FormGroup>
                                                    <ShipperType 
                                                        shipperType={shipperType}
                                                        setShipperType={setShipperType}
                                                    />
                                                </Form> : screeningType === 'iacAlsoCcsf' ? 
                                                <Form>
                                                    <h4 className='text-center'>IAC Also CCSF</h4>
                                                    <FormGroup>
                                                        <Label>IAC #:</Label>
                                                        <Input type="text" value={s_iac} onChange={handleIacNum}/>
                                                    </FormGroup>
                                                    <FormGroup>                                                      
                                                        <Label>CCSF #:</Label>
                                                        <Input type="text" value={s_ccsf} onChange={handleCcsfNum}/>
                                                    </FormGroup>
                                                    <ShipperType 
                                                        shipperType={shipperType}
                                                        setShipperType={setShipperType}
                                                    />
                                                </Form> : screeningType === 'unscreendIac' ? 
                                                <Form>
                                                    <h4>Unscreened IAC</h4>
                                                    <FormGroup>
                                                        <Label>IAC #:</Label>
                                                        <Input type="text" value={s_iac} onChange={handleIacNum}/>
                                                    </FormGroup>
                                                    <ShipperType 
                                                        shipperType={shipperType}
                                                        setShipperType={setShipperType}
                                                    />
                                                </Form> : screeningType === 'interlineTransfer' ? 
                                                <Form>
                                                    <h4>Interline Transfer</h4>
                                                    <FormGroup>
                                                        <Label>Airline:</Label>
                                                        <Select 
                                                            value={this.props.interlineTransfer}
                                                            options={this.props.airlines}
                                                            onChange={selectedOption => this.props.handleInterlineTransfer(selectedOption)}
                                                        />
                                                    </FormGroup>
                                                </Form> :
                                                <Form>
                                                    <h4>Unscreened Other</h4>
                                                    <FormGroup>
                                                        <Label>Other #:</Label>
                                                        <Input type="text" value={s_non_iac} onChange={handleNonIac}/>
                                                    </FormGroup>
                                                </Form>
                                        }
                                        </Col>
                                        <Col md={9}>
                                        {
                                            foundIac && <FoundIac foundIac={foundIac} validIacAlsoCcsf={validIacAlsoCcsf}/>
                                        }
                                        {
                                            foundCcsf && <FoundCcsf foundCcsf={foundCcsf} validIacAlsoCcsf={validIacAlsoCcsf}/>
                                        }
                                        </Col>
                                    </Row>
                                </div>
                            </Step>
                        </Steps>
                    {/* <BottomNavigation onClickNext={this.onClickNext} onClickPrev={this.onClickPrev} className="justify-content-center" prevLabel={"wizard.prev"} nextLabel={"wizard.next"} /> */}
                    </Wizard>
                </CardBody>
            </Card>
        );
    }
  }
  export default Basic;