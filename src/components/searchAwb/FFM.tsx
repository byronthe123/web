import React, { useState, useEffect } from 'react';
import { Row, Col, Input } from 'reactstrap';
import _ from 'lodash';
import { IMap, IFFM } from '../../globals/interfaces';
import ReactTable from '../custom/ReactTable';

import Header from './Header';

interface Props {
    data: Array<IFFM>,
    toggle: () => void;
}

interface IFlightId {
    [i_unique: number]: boolean
}

export default function FFM ({
    data,
    toggle
}: Props) {

    const [filteredData, setFilteredData] = useState<Array<IFFM>>([]);
    const [flightIds, setFlightIds] = useState<IMap<IFlightId>>({});
    const [selectedFlight, setSelectedFlight] = useState<IFlightId>({});
    const [s_flight_id, set_set_flight_id] = useState('');
    const [i_unique, set_i_unique] = useState(0);
    const [flightPieces, setFlightPieces] = useState(0);
    const [flightWeight, setFlightWeight] = useState(0);

    useEffect(() => {
        if (data.length > 0) {
            set_set_flight_id(data[0].s_flight_id);
            set_i_unique(data[0].i_unique);

            const flightIdsMap: IMap<IFlightId> = {};

            for (let i = 0; i < data.length; i++) {
                const { s_flight_id, i_unique } = data[i];
                if (flightIdsMap[s_flight_id] === undefined) {
                    flightIdsMap[s_flight_id] = {
                        [i_unique]: true
                    }
                } else {
                    flightIdsMap[s_flight_id][i_unique] = true;
                }
            }

            setFlightIds(flightIdsMap);
            for (let key in flightIdsMap) {
                setSelectedFlight(flightIdsMap[key]);
                set_set_flight_id(key);
                break;
            }
        }
    }, [data]);

    useEffect(() => {
        const _filteredData = data.filter(d => d.s_flight_id === s_flight_id && Number(d.i_unique) === Number(i_unique));
        setFilteredData(_filteredData);

        let pcs = 0, weight = 0;
        for (let i = 0; i < _filteredData.length; i++) {
            const { i_actual_piece_count, f_weight } = _filteredData[i];
            pcs += i_actual_piece_count;
            weight += f_weight;
        }

        setFlightPieces(pcs);
        setFlightWeight(Number(weight.toFixed(2)));
    }, [data, s_flight_id, i_unique]);

    const handleSelectFlightId = (s_flight_id: string, flight: IFlightId) => {
        set_set_flight_id(s_flight_id);
        setSelectedFlight(_.cloneDeep(flight));
    }

    useEffect(() => {
        const { length } = Object.keys(selectedFlight);
        let i = 0;
        for (let key in selectedFlight) {
            if (i === length - 1) {
                set_i_unique(Number(key));
                break;
            }
            i++;
        }
    }, [selectedFlight]);

    return (
        <Row>
            <Col md={12}>
                <Row className={'mb-2'}>
                    <Col md={12}>
                        <Header 
                            title={`MAWB Manifested on ${Object.keys(flightIds).length} flights.`}
                            navigation={{
                                path: '/EOS/Operations/EDI/EdiFFM',
                                toggle: () => toggle()
                            }}
                        />
                    </Col>
                    <Col md={12}>
                        <h6 className={'d-inline mr-2'}>Flight</h6>
                        <Input type={'select'} className={'mr-2 d-inline'} onChange={(e: any) => handleSelectFlightId(e.target.value, flightIds[e.target.value])} style={{ width: '200px' }}>
                            {
                                Object.keys(flightIds).map((key, i) => (
                                    <option 
                                        key={i}
                                        value={key}
                                    >
                                        {key}
                                    </option>
                                ))
                            }
                        </Input>
                        <h6 className={'d-inline mr-2'}>Serial:</h6>
                        <Input 
                            type={'select'} 
                            className={'mr-2 d-inline'} 
                            onChange={(e: any) => set_i_unique(e.target.value)} style={{ width: '100px' }}
                            value={i_unique}
                        >
                            {
                                Object.keys(selectedFlight).map((key, i) => (
                                    <option 
                                        key={i}
                                        value={key}
                                    >
                                        {key}
                                    </option>
                                ))
                            }
                        </Input>
                        <h6 className={'d-inline'}>{flightPieces} manifested on this flight with total weight of {flightWeight} KG</h6>
                    </Col>
                </Row>
                <ReactTable 
                    data={filteredData}
                    mapping={[{
                        name: 'ULD',
                        value: 's_uld',
                        customWidth: 183
                    }, {
                        name: 'PC',
                        value: 'i_actual_piece_count',
                        number: true
                    }, {
                        name: 'Type',
                        value: 's_pieces_type',
                        substring: true,
                        count: 1,
                        customWidth: 53
                    }, {
                        name: 'Weight',
                        value: 'f_weight',
                        number: true
                    }, {
                        name: 'SHC',
                        value: 's_special_handling_code'
                    }, {
                        name: 'ORI',
                        value: 's_origin'
                    }, {
                        name: 'POL',
                        value: 's_pol'
                    }, {
                        name: 'POU',
                        value: 's_pou'
                    }, {
                        name: 'DES',
                        value: 's_destination'
                    }, {
                        name: 'Sent',
                        value: 't_created',
                        monthDay: true,
                        utc: true
                    }, {
                        name: 'Accepted',
                        value: 't_user_accepted_uld',
                        monthDay: true,
                        utc: true
                    }, {
                        name: 'Opened',
                        value: 't_user_opened_uld',
                        monthDay: true,
                        utc: true
                    }, {
                        name: 'Closed',
                        value: 't_user_closed_uld',
                        monthDay: true,
                        utc: true
                    }, {
                        name: 'Modified by',
                        value: 's_modified_by',
                        email: true
                    }]}
                    numRows={10}
                />
            </Col>
        </Row>
    );
}