import React, {Fragment, useState, useEffect, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { Row, Col, Input, Button  } from "reactstrap";
import axios from 'axios';
import ReactTable from '../../components/custom/ReactTable';
import moment from 'moment';

import AppLayout from '../../components/AppLayout';

import healthCheckMapping from '../../components/managers/healthCheck/healthCheckMapping';
import GenerateReport from '../../components/managers/healthCheck/GenerateReport';
import ModalDistanceImagery from '../../components/managers/healthCheck/ModalDistanceImagery';

const HealthCheck = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, createSuccessNotification, eightyWindow, width
}) => {

    const [healthCheckData, setHealthCheckData] = useState([]);
    const [stationData, setStationData] = useState([]);
    const [d_start_date, set_d_start_date] = useState(moment().subtract(7, 'days').format('YYYY-MM-DD'));
    const [d_end_date, set_d_end_date] = useState(moment().format('YYYY-MM-DD'));
    const [selectedItem, setSelectedItem] = useState({});
    const [modalDistanceImagery, setModalDistanceImagery] = useState(false);


    useEffect(() => {
        if (user && user.s_unit) {
            const getHealthCheckData = async () => {
                const data = {
                    d_start_date,
                    d_end_date,
                    s_unit: user.s_unit
                }
                try {
                    const response = await axios.post(`${baseApiUrl}/getHealthCheckData`, {
                        data
                    }, {
                        headers: {
                            Authorization: `Bearer ${headerAuthCode}`
                        }
                    });

                    if (response.status === 200) {
                        console.log(response.data);
                        const { healthCheckData, stationData } = response.data;
                        setHealthCheckData(healthCheckData);
                        setStationData(stationData[0]);
                    }
                } catch (err) {
                    alert(err);
                }
            }
            getHealthCheckData();
        }
    }, [user, d_start_date, d_end_date]);

    const printReport = () => {
        const printDoc = renderToString(
            <GenerateReport 
                data={healthCheckData}
                stationData={stationData}
            />
        );

        const printWindow = window.open('', 'MsgWindow', 'width=1920, height=1080');
        printWindow.document.write(printDoc);
    }

    const displayDistanceImagery = (item) => {
        setSelectedItem(item);
        setModalDistanceImagery(true);
    }

    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md={12}>
                            <Row>
                                <Col md={12}>
                                    <h4>Select Date Range:</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <input type='date' value={d_start_date} onChange={(e) => set_d_start_date(e.target.value)} className='mr-2' style={{ display: 'inline' }} /> to
                                    <input type='date' value={d_end_date} onChange={(e) => set_d_end_date(e.target.value)} className='ml-2 mr-5' style={{ display: 'inline' }} />
                                    <Button onClick={() => printReport()}>Generate Report</Button>
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col md={12}>
                                    <ReactTable 
                                        data={healthCheckData}
                                        index={true}
                                        enableClick={true}
                                        handleClick={displayDistanceImagery}
                                        mapping={healthCheckMapping}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>

            <ModalDistanceImagery 
                modal={modalDistanceImagery}
                setModal={setModalDistanceImagery}
                selectedItem={selectedItem}
            />

            

        </AppLayout>
    );
}

export default withRouter(HealthCheck);