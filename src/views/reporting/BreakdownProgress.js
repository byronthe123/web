import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context';
import { Wizard, Steps, Step } from 'react-albus';
import  { Card, CardBody, Row, Col } from 'reactstrap';
import moment from 'moment';
import TopNavigation from '../../components/wizard-hooks/TopNavigation';

import AppLayout from '../../components/AppLayout';
import useFlightsData from '../../components/reporting/breakdownProgress/useFlightsData';
import FlightOverview from '../../components/reporting/breakdownProgress/FlightOverview';
import FlightUlds from '../../components/reporting/breakdownProgress/FlightUlds';
import UldModal from '../../components/reporting/breakdownProgress/UldModal';
import AwbsModal from '../../components/reporting/breakdownProgress/AwbsModal';
import RackModal from '../../components/reporting/breakdownProgress/RackModal';
import useRackData from '../../components/reporting/breakdownProgress/useRackData';
import useUldData from '../../components/reporting/breakdownProgress/useUldData';
import useStationInfo from '../../components/reporting/breakdownProgress/useStationInfo';
import useLoading from '../../customHooks/useLoading';
import { api } from '../../utils';

const BreakdownProgress = () => {

    const { user, createSuccessNotification, searchAwb } = useContext(AppContext);
    const stationInfo = useStationInfo(user.s_unit);
    const { handleSearchAwb } = searchAwb;
    const { setLoading } = useLoading();
    const [d_arrival_date, set_d_arrival_date] = useState(moment().format('YYYY-MM-DD'));
    const { 
        flights, 
        completePercent, 
        locatedPercent,
        uldsData 
    } = useFlightsData(d_arrival_date, user.s_unit);
    const [selectedFlight, setSelectedFlight] = useState({});
    const [s_flight_id, set_s_flight_id] = useState('');
    const [selectedUld, setSelectedUld] = useState({});
    const [modal, setModal] = useState(false);
    const [rackModal, setRackModal] = useState(false);
    const [awbsModal, setAwbsModal] = useState(false);
    const uldData = useUldData(selectedFlight.i_unique, selectedUld.s_uld, selectedFlight.s_flight_id);
    const [selectedAwb, setSelectedAwb] = useState('');
    const rackData = useRackData(selectedAwb, selectedUld.s_uld, s_flight_id);
    
    const handleSelectFlight = (flight, view=false) => {
        setSelectedFlight(flight);
        set_s_flight_id(`${flight.s_flight_id}/${d_arrival_date}`);
        if (view) {
            setAwbsModal(true);
        }
    }

    const navLogic = (obj) => {
        const { from=null, to=null } = obj;
        if (from === '1' || to === '2') {
            return Object.keys(selectedFlight || {}).length > 0;
        } else {
            setSelectedFlight({});
            return true;
        }
    }

    const topNavClick = (stepItem, push) => navLogic({ to: stepItem.id }) && push(stepItem.id);

    const onClickNext = (goToNext, steps, step, push) => {
        if (navLogic({from: step.id})) {
            goToNext();
        }
    };

    // const resolveEnableNext = (stepItem) => navLogic({ from: stepItem.id });

    const handleViewUld = (item) => {
        setSelectedUld(item);
        setModal(true);
    }

    const handleViewRackData = (awb) => {
        setSelectedAwb(awb);
        setRackModal(true);
    }

    const emailBreakdownReport = async (bodyHtml) => {
        setLoading(true);
        const res = await api('post', 'emailBreakdownReport', {
            bodyHtml,
            emailTo: user.s_email
        });
        setLoading(false);
        if (res.status === 200) {
            createSuccessNotification('Email sent');
        }
    }

    console.log(selectedFlight);
    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'disabled'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Card>
                        <CardBody className="wizard wizard-default">
                            <Wizard>
                                <TopNavigation
                                    className="justify-content-center"
                                    disableNav={false}
                                    topNavClick={topNavClick}
                                />
                                <Row style={{ height: 'calc(100vh - 240px)', overflowY: 'scroll' }}>
                                    <Col md={12}>
                                        <Steps>
                                            <Step id="1" name={'Flight'} desc={''}>
                                                <div className="wizard-basic-step">
                                                    <FlightOverview 
                                                        d_arrival_date={d_arrival_date}
                                                        set_d_arrival_date={set_d_arrival_date}
                                                        completePercent={completePercent}
                                                        locatedPercent={locatedPercent}
                                                        flights={flights}
                                                        uldsData={uldsData}
                                                        handleSelectFlight={handleSelectFlight}
                                                        user={user}
                                                        stationInfo={stationInfo}
                                                        createSuccessNotification={createSuccessNotification}
                                                        onClickNext={onClickNext}
                                                        emailBreakdownReport={emailBreakdownReport}
                                                    />
                                                </div>
                                            </Step>
                                            <Step id="2" name={'ULD'} desc={''}>
                                                <div className="wizard-basic-step">
                                                    <FlightUlds 
                                                        selectedFlight={selectedFlight}
                                                        s_flight_id={s_flight_id}
                                                        handleViewUld={handleViewUld}
                                                        selectedUld={selectedUld}
                                                    />
                                                </div>
                                            </Step>
                                        </Steps>
                                    </Col>
                                </Row>
                            </Wizard>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <UldModal 
                modal={modal}
                setModal={setModal}
                selectedUld={selectedUld}
                s_flight_id={s_flight_id}
                handleViewRackData={handleViewRackData}
                uldData={uldData}
            />

            <AwbsModal 
                modal={awbsModal}
                setModal={setAwbsModal}
                user={user}
                stationInfo={stationInfo}
                selectedFlight={selectedFlight}
                s_flight_id={s_flight_id}
                d_arrival_date={d_arrival_date}
                handleViewRackData={handleViewRackData}
                emailBreakdownReport={emailBreakdownReport}
            />

            <RackModal 
                modal={rackModal}
                setModal={setRackModal}
                selectedAwb={selectedAwb}
                rackData={rackData}
                s_flight_id={s_flight_id}
                handleSearchAwb={handleSearchAwb}
            />  

        </AppLayout>
    );
}

export default BreakdownProgress;