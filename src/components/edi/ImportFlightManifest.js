import React, { useEffect, useState, Fragment } from 'react';
import { Row, Col, Card, CardBody, Input, Table, Button, ButtonGroup } from 'reactstrap';
import GenerateImportFlightManifest from './GenerateImportFlightManifest';
import { api } from '../../utils';
import _ from 'lodash';
import { renderToString } from 'react-dom/server';
import useLoading from '../../customHooks/useLoading';
import useUser from '../../customHooks/useUser';
import moment from 'moment';
import ReactTable from '../custom/ReactTable';
import manifestColumns from './manifestColumns';
import renderRow from './renderRow';

const useFlights = (d_arrival_date, s_destination, activeFirstTab) => {
    const [flights, setFlights] = useState([]);
    const { setLoading } = useLoading();

    useEffect(() => {
        const getFlights = async (d_arrival_date) => {
            setLoading(true);
            const res = await api('post', `importManifestFlights`, {
                d_arrival_date, 
                s_destination
            });
            setLoading(false);

            if (res.status === 200) {
                setFlights(res.data);
            }
        }
        if (
            d_arrival_date.length > 0 && 
            s_destination && 
            moment(d_arrival_date).isValid() && 
            activeFirstTab === '2'
        ) {
            getFlights(d_arrival_date);
        }
    }, [d_arrival_date, s_destination, activeFirstTab]);

    return flights;
}

const useManifestData = (s_flight_id) => {
    console.log(s_flight_id);
    const [dataMap, setDataMap] = useState([]);
    const [s_pol, set_s_pol] = useState('');
    const { setLoading } = useLoading();
    const [totalPcs, setTotalPcs] = useState(0);
    const [totalWgt, setTotalWgt] = useState(0);
    const [totalVol, setTotalVol] = useState(0);
    const [totalAwbs, setTotalAwbs] = useState(0);

    useEffect(() => {
        const getData = async(s_flight_id) => {
            setLoading(true);
            const res = await api('post', 'importManifestData', { s_flight_id });
            setLoading(false);

            if (res.status === 200) {
                const { data } = res;
                console.log(data);

                const map = {};
                const awbsMap = {};
                let _totalPcs = 0, _totalWgt = 0, _totalVol = 0;
        
                for (let i = 0; i < data.length; i++) {
                    const current = data[i];
                    const s_uld = _.get(current, 's_uld', 'BULK');
                    _totalPcs += _.get(current, 'i_actual_piece_count', 0);
                    _totalWgt += _.get(current, 'f_weight', 0);
                    _totalVol += Number(_.get(current, 's_volume', 0));
                    awbsMap[current.s_mawb] = true;
        
                    if (map[s_uld] === undefined) {
                        map[s_uld] = {
                            totalPieces: current.i_actual_piece_count,
                            totalWeight: _.get(current, 'f_weight', 0),
                            totalVolume: Number(_.get(current, 's_volume', 0)),
                            awbs: [
                                current
                            ]
                        }
                    } else {
                        map[s_uld].totalPieces += current.i_actual_piece_count;
                        map[s_uld].totalWeight += current.f_weight;
                        map[s_uld].totalVolume += Number(_.get(current, 's_volume', 0));
                        map[s_uld].awbs.push(current)
                    }
                }

                setDataMap(map);
                set_s_pol(_.get(data, '[0].s_pol', null));
                setTotalPcs(_totalPcs);
                setTotalWgt(_totalWgt.toFixed(1));
                setTotalVol(_totalVol.toFixed(1));
                setTotalAwbs(Object.keys(awbsMap).length);
            }
        };

        if (s_flight_id && s_flight_id.length > 0) {
            getData(s_flight_id);
        }
    
    }, [s_flight_id]);

    console.log(dataMap);

    return {
        dataMap, 
        s_pol,
        totalPcs,
        totalWgt,
        totalVol,
        totalAwbs
    };
}

const printManifest = (
    user, 
    dataMap, 
    s_flight_id, 
    d_arrival_date, 
    s_pol, 
    printConsignee,   
    totalPcs, 
    totalWgt, 
    totalVol,
    totalAwbs
) => {
    const sheet = renderToString(
        <GenerateImportFlightManifest 
            user={user}
            dataMap={dataMap}
            s_flight_id={s_flight_id}
            d_arrival_date={d_arrival_date}
            s_pol={s_pol}
            printConsignee={printConsignee}
            totalPcs={totalPcs} 
            totalWgt={totalWgt}
            totalVol={totalVol}
            totalAwbs={totalAwbs}
        />
    );

    const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
    myWindow.document.body.innerHTML = null;
    myWindow.document.write(sheet);
}

const RenderTable = (dataMap, key, printConsignee) => {
    return (
        <Fragment>
            <Row className={'bg-primary mx-1'}>
                <Col md={2} className={'ml-2'}>
                    <h5>{key}</h5>
                </Col>
                <Col md={6}>
                    <span>
                        Pieces: {dataMap[key].totalPieces},
                        Weight: {dataMap[key].totalWeight.toFixed(1)},
                        Volume: {dataMap[key].totalVolume.toFixed(2)}
                    </span>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Table striped>
                        <thead>
                            <tr className={'table-success'}>
                                {
                                    manifestColumns.map(c => renderRow(printConsignee, c.name) && (
                                        <th>{c.name}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataMap[key].awbs.map(awb => (
                                    <tr>
                                        {
                                            manifestColumns.map(c => renderRow(printConsignee, c.name) && (
                                                <td style={{ textAlign: ['Pieces', 'Weight'].indexOf(c.name) !== -1 ? 'right' : 'left' }}>
                                                    { 
                                                        c.name === 'Routing' ?
                                                            `${awb.s_origin}/${awb.s_destination}` :
                                                        c.value === 'f_weight' ? 
                                                            awb[c.value].toFixed(2) :
                                                        c.name === 'Pieces' ?
                                                            awb.s_pieces_type === 'TOTAL_CONSIGNMENT' ?
                                                                awb.i_actual_piece_count :
                                                                `${awb.i_actual_piece_count}/${awb.i_pieces_total}` :
                                                        awb[c.value] || ''
                                                    }
                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Fragment>
    );
}

export default function ImportFlightManifest ({ activeFirstTab }) {

    const { user } = useUser();

    const [d_arrival_date, set_d_arrival_date] = useState(moment().format('YYYY-MM-DD'));
    const flights = useFlights(d_arrival_date, user.s_destination, activeFirstTab);

    const [s_flight_id, set_s_flight_id] = useState('');
    const { dataMap, s_pol, totalPcs, totalWgt, totalVol, totalAwbs } = useManifestData(s_flight_id);

    const [printConsignee, setPrintConsignee] = useState(false);

    const handleSelectFlight = (flight) => {
        set_s_flight_id(flight.s_flight_id);
    }

    return (
        <Row>
            <Col md={12}>
                <Row className={'mb-2'}>
                    <Col md={12}>
                        <button 
                            onClick={() => setPrintConsignee(!printConsignee)}
                            className={`btn ${printConsignee ? 'btn-success' : 'btn-grey'}`}
                        >
                            Consignee
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                            <CardBody>
                                <h6>Flights</h6>
                                <Input type={'date'} value={d_arrival_date} onChange={(e) => set_d_arrival_date(e.target.value)} />
                                <ReactTable 
                                    data={flights}
                                    mapping={[{
                                        name: 'Flight',
                                        value: 's_flight_number'
                                    }, {
                                        name: 'POL',
                                        value: 's_pol'
                                    }, {
                                        name: 'POU',
                                        value: 's_pou'
                                    }]}
                                    numRows={8}
                                    handleClick={(item) => handleSelectFlight(item)}
                                />
                            </CardBody>
                        </Card>
                    </Col>  
                    <Col md={9}>
                        {
                            (dataMap && Object.keys(dataMap).length > 0) && 
                                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                                    <CardBody style={{ maxHeight: '68vh', overflowY: 'scroll' }}>
                                        <Row>
                                            <Col md={12}>
                                                <h6 className={'float-left'}>Preview</h6>
                                                <Button 
                                                    className={'float-right'}
                                                    onClick={() => printManifest(
                                                        user, 
                                                        dataMap, 
                                                        s_flight_id, 
                                                        d_arrival_date,
                                                        s_pol,
                                                        printConsignee,
                                                        totalPcs, 
                                                        totalWgt, 
                                                        totalVol,
                                                        totalAwbs
                                                    )}
                                                >
                                                    Print
                                                </Button>
                                            </Col>
                                        </Row>
                                        {
                                            Object.keys(dataMap).map(key => (
                                                RenderTable(dataMap, key, printConsignee)
                                            ))
                                        }
                                    </CardBody>
                                </Card>
                        }
                    </Col>  
                </Row>
            </Col>
        </Row>
    );
}

