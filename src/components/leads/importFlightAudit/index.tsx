import React, { useEffect, useState, useContext, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Input  } from 'reactstrap';
import dayjs from 'dayjs';
import { renderToString } from 'react-dom/server';

import { AppContext } from '../../../context';
import { api, formatCost } from '../../../utils';
import useLoading from '../../../customHooks/useLoading';
import { IMap, IFFM } from '../../../globals/interfaces';
import { AwbsMap, IUniqueFlight, FlightAuditData } from './interfaces';
import Layout from '../../../components/custom/Layout';
import Card from '../../../components/custom/Card';
import ReactTable from '../../../components/custom/ReactTable';
import GeneratePrint from './GeneratePrint';
import ActionIcon from '../../custom/ActionIcon';

const ImportFlightAudit = () => {

    const { user } = useContext(AppContext);
    const { setLoading } = useLoading();
    const [d_arrival_date, set_d_arrival_date] = useState(dayjs().format('YYYY-MM-DD'));
    const [ffms, setFfms] = useState<Array<IFFM>>([]);
    const [s_flight_number, set_s_flight_number] = useState('');
    const [flightAuditData, setFlightAuditData] = useState<FlightAuditData>([]);
    const [totals, setTotals] = useState({
        pcs: 0,
        weight: 0,
        money: 0
    });

    useEffect(() => {
        const importFlightAuditFfms = async () => {
            const res = await api('post', 'importFlightAuditFfms', {
                d_arrival_date,
                s_pou: user.s_destination
            });
    
            setFfms(res.data);
        }

        if (dayjs(d_arrival_date).isValid() && user.s_destination) {
            set_s_flight_number('');
            importFlightAuditFfms();
        }
    }, [d_arrival_date, user.s_destination]);

    const flightsMap: IMap<AwbsMap> = useMemo(() => {
        const map: IMap<AwbsMap> = {};
        for (let i = 0; i < ffms.length; i++) {
            const { s_flight_number, s_mawb, f_weight, i_actual_piece_count  } = ffms[i];
            if (map[s_flight_number] === undefined) {
                map[s_flight_number] = {};
            }
            if (map[s_flight_number][s_mawb] === undefined) {
                map[s_flight_number][s_mawb] = ffms[i];
            } else {
                map[s_flight_number][s_mawb].i_actual_piece_count += i_actual_piece_count;
                map[s_flight_number][s_mawb].f_weight += f_weight || 0;
            }
            map[s_flight_number][s_mawb].f_weight = Number(map[s_flight_number][s_mawb].f_weight.toFixed(1));
        }
        return map;
    }, [ffms]);

    const uniqueFlights:Array<IUniqueFlight> = useMemo(() => {
        const array:Array<IUniqueFlight> = [];
        Object.keys(flightsMap).map((key: string) => array.push({ s_flight_number: key }));
        return array;
    }, [flightsMap]);

    const flightSelected = s_flight_number && s_flight_number.length > 0;

    useEffect(() => {
        const importFlightAuditData = async () => {
            setLoading(true);
            const ffmsMap = flightsMap[s_flight_number];
            const ffms = Object.keys(ffmsMap).map((key: string) => ffmsMap[key]);

            const res = await api('post', 'importFlightAuditData', { ffms });

            const flightAuditData: FlightAuditData = res.data;

            let pcs = 0, weight = 0, money = 0;
            const destinationAwbs = [], otherAwbs = [];

            for (let i = 0; i < flightAuditData.length; i++) {
                const { s_destination, i_actual_piece_count, f_weight, total } = flightAuditData[i];
                if (s_destination === user.s_destination) {
                    destinationAwbs.push(flightAuditData[i]);
                } else {
                    otherAwbs.push(flightAuditData[i]);
                }
                pcs += i_actual_piece_count;
                weight += f_weight;
                money += total;
            }

            destinationAwbs.sort((a, b) => a.total - b.total);
            otherAwbs.sort((a, b) => a.total - b.total);
            const sorted = [...destinationAwbs, ...otherAwbs];

            setFlightAuditData(sorted);
            setTotals({
                pcs, 
                weight: Number(weight.toFixed(1)),
                money
            });
            setLoading(false);
        }
        if (s_flight_number && s_flight_number.length > 0) {
            importFlightAuditData();
        }
    }, [s_flight_number, flightSelected]);

    const s_flight_id = `${s_flight_number}/${d_arrival_date}`;

    const totalInfo = useMemo(() => {
        return `AWB: ${flightAuditData.length} / PC: ${totals.pcs} / WGT: ${totals.weight} / Total: ${formatCost(totals.money)}`;
    }, [flightAuditData, totals]);

    const print = () => {
        const sheet = renderToString(
            <GeneratePrint 
                user={user}
                s_flight_id={s_flight_id}
                totalInfo={totalInfo}
                flightAuditData={flightAuditData}
            />
        );

        const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
        // @ts-ignore
        myWindow.document.body.innerHTML = null;
        // @ts-ignore
        myWindow.document.write(sheet);
    }

    return (
        <Layout>
            <h1>Import Flight Audit</h1>
            <Row>
                <Col md={2}>
                    <Card>
                        <Input 
                            type={'date'} 
                            value={d_arrival_date} 
                            onChange={(e: any) => set_d_arrival_date(e.target.value)}
                        />
                        <ReactTable 
                            data={uniqueFlights}
                            mapping={[{
                                name: 'Flight',
                                value: 's_flight_number'
                            }]}
                            numRows={10}
                            enableClick={true}
                            handleClick={(record: IUniqueFlight) => set_s_flight_number(record.s_flight_number)}
                        />
                    </Card>
                </Col>
                <Col md={10}>
                    <Card>
                        <Row>
                            <Col md={12}>
                                <div className={'float-left'}>
                                    {
                                        flightSelected && 
                                        <>
                                            <h6>Flight ID: {s_flight_id}</h6>
                                            <h6>{totalInfo}</h6>
                                        </>
                                    }
                                </div>
                                <div className={'float-right'}>
                                    {
                                        flightSelected && 
                                        <ActionIcon type={'print'} onClick={() => print()} />
                                    }
                                </div>
                            </Col>
                        </Row>
                        <ReactTable 
                            index={true}
                            data={flightAuditData}
                            mapping={[{
                                name: 'MAWB',
                                value: 's_mawb',
                                s_mawb: true
                            }, {
                                name: 'PC/WGT',
                                values: ['i_actual_piece_count', 'f_weight'],
                                concat: true,
                                operator: '/'
                            }, {
                                name: 'Commodity',
                                value: 's_commodity'
                            }, {
                                name: 'ORI',
                                value: 's_origin'
                            }, {
                                name: 'DES',
                                value: 's_destination'
                            }, {
                                name: 'ISC',
                                value: 'isc',
                                money: true
                            }, {
                                name: 'Storage',
                                value: 'storage',
                                money: true
                            }, {
                                name: 'Total Paid',
                                value: 'total',
                                money: true
                            }, {
                                name: 'Charges',
                                value: 'charges',
                                money: true
                            }]}
                            numRows={10}
                        />
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
}

export default withRouter(ImportFlightAudit);