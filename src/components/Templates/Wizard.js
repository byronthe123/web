import React, { useContext } from 'react';
import { AppContext } from '../../context';
import { withRouter } from 'react-router';
import { Wizard, Steps, Step } from 'react-albus';
import  { Card, CardBody } from 'reactstrap';
import BottomNavigation from '../../components/wizard-hooks/BottomNavigation';
import TopNavigation from '../../components/wizard-hooks/TopNavigation';

import AppLayout from '../../components/AppLayout';
import FlightOverview from '../../components/reporting/breakdownProgress/FlightOverview';

const BreakdownProgress = () => {

    const { user } = useContext(AppContext);
 
    const topNavClick = (stepItem, push) => {
        push(stepItem.id);
    };
    
    const onClickNext = (goToNext, steps, step) => {
        step.isDone = true;
        if (steps.length - 1 <= steps.indexOf(step)) {
          return;
        }
        goToNext();
    };
    
    const onClickPrev = (goToPrev, steps, step) => {
        if (steps.indexOf(step) <= 0) {
          return;
        }
        goToPrev();
    };

    const resolveEnableNext = () => {}
    
    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Card>
                        <CardBody className="wizard wizard-default">
                            <Wizard>
                                <TopNavigation
                                    className="justify-content-center"
                                    disableNav={false}
                                    topNavClick={topNavClick}
                                />
                                <Steps>
                                    <Step id="step1" name={'Step 1'} desc={''}>
                                        <div className="wizard-basic-step">
                                            <FlightOverview 
                                                user={user}
                                            />
                                        </div>
                                    </Step>
                                    <Step id="step2" name={'Step 2'} desc={''}>
                                        <div className="wizard-basic-step">

                                        </div>
                                    </Step>
                                    <Step id="step3" name={'Step 3'} desc={''}>
                                        <div className="wizard-basic-step">

                                        </div>
                                    </Step>
                                    <Step id="step4" name={'Step 4'} desc={''}>
                                        <div className="wizard-basic-step text-center">

                                        </div>
                                    </Step>
                                </Steps>
                                <BottomNavigation
                                    onClickNext={onClickNext}
                                    onClickPrev={onClickPrev}
                                    className="justify-content-center"
                                    prevLabel={'Back'}
                                    nextLabel={'Next'}
                                    resolveEnableNext={resolveEnableNext}
                                />
                            </Wizard>
                        </CardBody>
                    </Card>
                </div>
            </div>

        </AppLayout>
    );
}

export default withRouter(BreakdownProgress);