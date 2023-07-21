import React, { useMemo, useRef, useState } from 'react';
import { Row, Col, Input } from 'reactstrap';
import { formatPercent, getRandomColor, api } from '../../../utils';

import ReactTable from '../../custom/ReactTable';
import PolarArea from '../../../components/charts/PolarAreaNew';
import CreateBreakdownReport from './CreateBreakdownReport';
import { renderToString } from 'react-dom/server';
import useStationInfo from './useStationInfo';
import useLoading from '../../../customHooks/useLoading';

export default function FlightOverview ({
    d_arrival_date,
    set_d_arrival_date,
    completePercent,
    locatedPercent,
    flights,
    uldsData,
    handleSelectFlight,
    user,
    stationInfo,
    createSuccessNotification,
    onClickNext,
    emailBreakdownReport
}) {

    const { setLoading } = useLoading();
    const [uldDataMapMain, setUldDataMapMain] = useState(null);

    const chartData = useMemo(() => {
        if (flights && flights.length > 0) {
            const labels = [];
            const data = [];
            const backgroundColor = [];
            for (let i = 0; i < flights.length; i++) {
                const value = Number((flights[i].progress * 100).toFixed(1));
                labels.push(`${flights[i].s_flight_id}${value > 100 ? `+` : ''}`);
                data.push(
                    Math.min(
                        value,
                        100
                    )
                );
                backgroundColor.push(getRandomColor());
            }
            return {
                labels,
                datasets: [{
                    label: 'Breakdown by Flight',
                    data,
                    backgroundColor
                }]
            }
        }
    }, [flights]);

    const reactTableRef = useRef();

    const getUldClosedData = async() => {
        setLoading(true);
        const map = {};

        for (let i = 0; i < flights.length; i++) {
            const { s_flight_id, ulds } = flights[i];
            const uldsArray = ulds.map(u => u.s_uld);
            map[s_flight_id] = {
                ulds: uldsArray,
                closedUldsCount: 0,
                useFlightId: `${s_flight_id}/${d_arrival_date}`
            }
        }

        const res = await api('post', 'breakdownProgressClosedUlds', { map });
        setLoading(false);
        return res.data || [];
    }

    const printBreakdownReport = async(email=false) => {
        const raw = reactTableRef.current.getResolvedState().sortedData;
        if (raw.length > 0) {
            let uldDataMap;
            if (!uldDataMapMain) {
                uldDataMap = await getUldClosedData();
                setUldDataMapMain(uldDataMap);
            } else {
                uldDataMap = uldDataMapMain;
            } 

            const data = raw.map(record => {   
                record._original.uldsCount = record._original.ulds.length;
                record._original.closedUldsCount = uldDataMap[record._original.s_flight_id].closedUldsCount;
                return record._original;
            });

            const sheet = renderToString(
                <CreateBreakdownReport 
                    user={user}
                    d_arrival_date={d_arrival_date}
                    flights={data}
                    uldsData={uldsData}
                    stationInfo={stationInfo}
                    email={email}
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
        <>
            <Row>
                <Col md={12} className={'mb-1'}>
                    <Row>
                        <Col md={12}>
                            <h2>Breakdown Progress Report</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <div className={'float-left'}>
                                <h4 className={'d-inline mr-2'}>Select Date</h4>
                                <Input 
                                    type={'date'} 
                                    value={d_arrival_date}
                                    onChange={(e) => set_d_arrival_date(e.target.value)}
                                    style={{ width: '250px' }} 
                                    className={'d-inline'}
                                />    
                            </div>
                            <div className={'float-right'}>
                                <i 
                                    className="fad fa-envelope-square text-large text-success text-right" 
                                    onClick={() => printBreakdownReport(true)}
                                />
                                <i 
                                    className="fad fa-print ml-4 text-large text-success text-right" 
                                    onClick={() => printBreakdownReport(false)}
                                />
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col md={8}>
                    <ReactTable 
                        data={flights}
                        mapping={[{
                            name: 'Progress',
                            value: 'progress',
                            percent: true,
                            percentDecimal: true,
                            sortMethod: (a, b) => Number.parseInt(a) - Number.parseInt(b)
                        }, {
                            name: 'Unique',
                            value: 'i_unique'
                        }, {
                            name: 'Flight',
                            value: 's_flight_id'
                        }, {
                            name: 'Manifested',
                            value: 'i_actual_piece_count',
                            number: true
                        }, {
                            name: 'Brokendown',
                            value: 'rackPieces',
                            number: true
                        },  {
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
                            function: item => handleSelectFlight(item, true)
                        }]}
                        numRows={10}
                        enableClick={true}
                        handleClick={item => handleSelectFlight(item)}
                        reactTableRef={reactTableRef}
                        // wizardNext={true}
                        // onClickNext={onClickNext}
                    />
                </Col>
                {
                    flights && flights.length > 0 && 
                    <Col md={4}>
                        <Row>
                            <Col md={12} className={'text-center'}>
                                <h4>
                                    {formatPercent(completePercent, true)} flights completed and {formatPercent(locatedPercent, true)} pieces located
                                </h4>
                            </Col>
                        </Row>
                        <Row style={{ height: '450px' }}>
                            <Col md={12}>
                                <PolarArea 
                                    data={chartData}
                                    shadow={true}
                                    addOptions={{
                                        tooltips: {
                                            callbacks: {
                                                label: function(tooltipItem, data) {
                                                    const identifier = data.labels[tooltipItem.index];
                                                    const value = Number(data['datasets'][0]['data'][tooltipItem['index']]);
                                                    const useValue = identifier.includes('+') ? `${value}+` : value;
                                                    return `${data.labels[tooltipItem.index]}: ${useValue}`;
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                }
            </Row>
            <Row className={'mt-3'} style={{ width: '600px' }}>
                <Col md={12}>
                    <h2>ULDs Report</h2>
                    <ReactTable 
                        data={uldsData}
                        mapping={[{
                            name: 'Flight',
                            value: 's_flight_number',
                            mediumWidth: true
                        }, {
                            name: 'Messaged',
                            value: 'b_messaged',
                            mediumWidth: true,
                            number: true
                        }, {
                            name: 'Accepted',
                            value: 'b_accepted',
                            mediumWidth: true,
                            number: true
                        }, {
                            name: 'Opened',
                            value: 'b_opened',
                            mediumWidth: true,
                            number: true
                        }, {
                            name: 'Closed',
                            value: 'b_closed',
                            mediumWidth: true,
                            number: true
                        }, {
                            name: 'Sequence',
                            value: 'i_unique',
                            mediumWidth: true,
                            number: true
                        }]}
                        numRows={10}
                    />
                </Col>
            </Row>
        </>
    );
}