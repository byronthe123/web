import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';
import { renderToString } from 'react-dom/server';

import ReactTable from "../../custom/ReactTable";
import CreateBreakdownReport from './CreateBreakdownReport';
import { Button } from 'reactstrap';
import BreakdownByHawb from './BreakdownByHawb';
import ReactTooltip from 'react-tooltip';

export default function FlightAwbs ({
    d_arrival_date,
    selectedFlight,
    handleViewRackData,
    user,
    stationInfo,
    emailBreakdownReport,
    s_flight_id
}) {

    const [flightsAwbs, setFlightAwbs] = useState([]);
    const [viewBreakdownByHawb, setViewBreakdownByHawb] = useState(false);
    const reactTableRef = useRef();

    useEffect(() => {
        const awbsMap = {};
        const flightCopy = _.cloneDeep(selectedFlight);
        const { ulds } = flightCopy;
    
        for (let i = 0; i < ulds.length; i++) {
            const { awbs, i_unique, s_flight_id } = ulds[i];
            for (let j = 0; j < awbs.length; j++) {
                awbs[j].i_unique = i_unique;
                awbs[j].s_flight_id = s_flight_id;
                const { s_mawb } = awbs[j];
    
                if (!awbsMap[s_mawb]) {
                    awbsMap[s_mawb] = awbs[j];
                } else {
                    const props = [
                        'i_actual_piece_count',
                        'rackPieces',
                        'locatedPieces',
                        'deliveredPcs'
                    ]
    
                    props.map(prop => {
                        awbsMap[s_mawb][prop] += parseInt(awbs[j][prop]);
                    });
                }
            }
        }
    
        const awbsArray = [];
    
        for (let key in awbsMap) {
            awbsMap[key].discrepancy = awbsMap[key].rackPieces - awbsMap[key].i_actual_piece_count;
            awbsMap[key].progress = awbsMap[key].rackPieces / awbsMap[key].i_actual_piece_count;
            awbsArray.push(awbsMap[key]);
        }
        setFlightAwbs(awbsArray);
    }, [selectedFlight]);

    const printBreakdownAwbsReport = async(email=false) => {
        const raw = reactTableRef.current.getResolvedState().sortedData;
        if (raw.length > 0) {
            const data = raw.map(record => record._original);

            const sheet = renderToString(
                <CreateBreakdownReport 
                    user={user}
                    d_arrival_date={d_arrival_date}
                    flights={data}
                    stationInfo={stationInfo}
                    email={email}
                    awbReport={true}
                />
            );

            if (email) {
                await emailBreakdownReport(sheet);
            } else {
                const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
                myWindow.document.body.innerHTML = null;
                myWindow.document.write(sheet);
            }
        }
    }

    return (
        <Row>
            <ReactTooltip />
            <Col md={12}>
                <i 
                    className="fad fa-envelope-square text-large text-success text-right hover" 
                    onClick={() => printBreakdownAwbsReport(true)}
                    data-tip={'Email report'}
                />
                <i 
                    className="fad fa-print ml-4 text-large text-success text-right hover" 
                    onClick={() => printBreakdownAwbsReport(false)}
                    data-tip={'Print report'}
                />
                <i 
                    className="fa-duotone fa-file-chart-column text-large text-success ml-4 hover" 
                    onClick={() => setViewBreakdownByHawb(true)}
                    data-tip={'View Breakdown by HAWB'}
                />
            </Col>
            <Col md={12}>
                <ReactTable 
                    data={flightsAwbs}
                    mapping={[{
                        name: 'Progress',
                        value: 'progress',
                        percent: true,
                        sortMethod: (a, b) => Number.parseInt(a) - Number.parseInt(b)
                    }, {
                        name: 'MAWB',
                        value: 's_mawb',
                        s_mawb: true
                    }, {
                        name: 'Manifested',
                        value: 'i_actual_piece_count',
                        number: true
                    }, {
                        name: 'Brokendown',
                        value: 'rackPieces',
                        number: true
                    }, {
                        name: 'Under',
                        value: '',
                        breakdownUnder: true,
                        number: true
                    }, {
                        name: 'Over',
                        value: '',
                        breakdownOver: true,
                        number: true
                    }, {
                        name: 'Delivered',
                        value: 'deliveredPcs',
                        number: true
                    }, {
                        name: '',
                        value: 'far fa-expand-arrows',
                        icon: true,
                        function: item => handleViewRackData(item.s_mawb)
                    }]}
                    numRows={10}
                    locked={true}
                    reactTableRef={reactTableRef}
                />
            </Col>
            <BreakdownByHawb 
                modal={viewBreakdownByHawb}
                setModal={setViewBreakdownByHawb}
                s_flight_id={s_flight_id}
                stationInfo={stationInfo}
                user={user}
            />
        </Row>
    );
}