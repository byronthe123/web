import React, { useMemo } from 'react';
import { Row, Col } from 'reactstrap';
import ReactTable from '../../custom/ReactTable';
import _ from 'lodash';
import { formatPercent, getRandomColor } from '../../../utils';

import PolarArea from '../../../components/charts/PolarAreaNew';

export default function FlightUlds ({
    selectedFlight,
    s_flight_id,
    handleViewUld
}) {

    const chartData = useMemo(() => {
        const ulds = _.get(selectedFlight, 'ulds', []);
        if (ulds.length > 0) {
            const labels = [];
            const data = [];
            const backgroundColor = [];
            for (let i = 0; i < ulds.length; i++) {
                labels.push(ulds[i].s_uld);
                data.push(
                    Math.min(
                        Number((ulds[i].progress * 100).toFixed(0)), 
                        100
                    )
                );
                backgroundColor.push(getRandomColor());
            }
            return {
                labels,
                datasets: [{
                    label: 'Breakdown by ULDs',
                    data,
                    backgroundColor
                }]
            }
        }
    }, [selectedFlight]);

    return (
        <>
            <Row>
                <Col md={4}>
                    <h4>Breakdown by ULD for Flight {s_flight_id}</h4>
                </Col>
            </Row>
            <Row>
                <Col md={8}>
                    <ReactTable 
                        data={_.get(selectedFlight, 'ulds', [])}
                        mapping={[{
                            name: 'Progress',
                            value: 'progress',
                            percent: true,
                            sortMethod: (a, b) => Number.parseInt(a) - Number.parseInt(b)
                        }, {
                            name: 'ULD',
                            value: 's_uld'
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
                            function: item => handleViewUld(item)
                        }]}
                        numRows={10}
                    />
                </Col>
                {
                    selectedFlight && _.get(selectedFlight, 'ulds', []).length > 0 && 
                    <Col md={4}>
                        <Row>
                            <Col md={12} className={'text-center'}>
                                <h4>{formatPercent(selectedFlight.progress)} completed</h4>
                            </Col>
                        </Row>
                        <Row style={{ height: '450px' }}>
                            <Col md={12}>
                                <PolarArea 
                                    data={chartData}
                                    shadow={true}
                                />
                            </Col>
                        </Row>
                    </Col>
                }
            </Row>
        </>
    );
}

// , {
//     name: '',
//     value: 'fas fa-expand-arrows-alt',
//     icon: true,
//     function: item => handleViewUld(item)
// }
