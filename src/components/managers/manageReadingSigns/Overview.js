import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import Pie from '../../charts/Pie';
import BarNew from '../../charts/BarNew';
import Bar from '../../charts/Bar';   
// import { ThemeColors } from '../helpers/ThemeColors';
import { ThemeColors } from '../../helpers/ThemeColors';
import moment from 'moment';
const colors = ThemeColors();

export default ({
    readingSigns,
    readingSignRecords
}) => {

    const [acknowledged, setAcknowledged] = useState({});
    const [departmentBreakdown, setDepartmentBreakdown] = useState({});
    const [acknowledgedByDay, setAcknowledgedByDay] = useState({});

    const resolveAcknowledged = (readingSignRecords) => {
        let ack = 0;
        let notAck = 0;

        for (let i = 0; i < readingSignRecords.length; i++) {
            if (readingSignRecords[i].acknowledged) {
                ack++;
            } else {
                notAck++;
            }
        }

        const data = {
            labels: [
                'Acknowledged',
                'Not Acknowledged'
            ],
            datasets: [{
                data: [ack, notAck],
                backgroundColor: [
                    colors.themeColor1_10,
                    colors.themeColor2_10,
                ],
                borderWidth: 2,
                borderColor: [colors.themeColor1, colors.themeColor2],
                hoverOffset: 4
            }]
        };

        return data;
    }

    const resolveDepartmentBreakdown = (readingSigns) => {

        const map = {};
        for (let i = 0; i < readingSigns.length; i++) {
            const { units } = readingSigns[i];
            for (let j = 0; j < units.length; j++) {
                if (map[units[j]] === undefined) {
                    map[units[j]] = 1;
                } else {
                    map[units[j]]++;
                }
            }
        }

        const labels = [];
        const mainData = [];
        const backgroundColor = [];
        const borderColor = [];

        Object.keys(map).map((key, i) => {
            labels.push(key);
            mainData.push(map[key]);
            backgroundColor.push(colors[`themeColor${i+1}_10`]);
            borderColor.push(colors[`themeColor${i+1}`]);
        });

        const data = {
            labels,
            datasets: [{
                data: mainData,
                backgroundColor,
                borderWidth: 2,
                borderColor,
                hoverOffset: 4
            }]
        };

        console.log(data);

        return data;
    }

    const resolveAcknowledgeByDay = (readingSignRecords) => {
        const map = {};
        const assignedMap = {};
        const labels = [];

        for (let i = 0; i < 7; i++) {
            const day = moment().subtract(i, 'days').format('MM/DD/YYYY');
            map[day] = 0;
            assignedMap[day] = 0;
            labels.unshift(day);
        }

        readingSignRecords.sort((a, b) => a.updatedAt - b.updatedAt);

        for (let i = readingSignRecords.length - 1; i > 0; i--) {
            const day = moment(readingSignRecords[i].updatedAt).format('MM/DD/YYYY');
            if (moment(day).isBefore(moment(labels[0]))) {
                break;
            } else {
                assignedMap[day]++;
                if (readingSignRecords[i].acknowledged) {
                    map[day]++;
                }
            }
        }

        const ackData = [];
        const assignedData = [];

        for (let i = 0; i < labels.length; i++) {
            ackData.push(map[labels[i]]);
            assignedData.push(assignedMap[labels[i]]);
        }   

        const backgroundColor = [];
        const borderColor = [];

        for (let i = 0; i < 6; i++) {
            borderColor.push(colors[`themeColor${i+1}`]);
            backgroundColor.push(colors[`themeColor${i+1}_10`]);
        }

        backgroundColor.push('themeColor1');     
        borderColor.push('themeColor1');   

        console.log(map);
        console.log(labels);

        const data = {
            labels,
            datasets: [{
                label: 'Acknowledged',
                data: ackData,
                backgroundColor: colors.themeColor1_10,
                borderWidth: 2,
                borderColor: colors.themeColor1,
                hoverOffset: 4
            }, {
                label: 'Assigned',
                data: assignedData,
                backgroundColor: colors.themeColor2_10,
                borderWidth: 2,
                borderColor: colors.themeColor2,
                hoverOffset: 4
            }]
        };

        return data;
    }   

    const percentageFormatter = (float) => {
        return `${(float * 100).toFixed(0)}%`;
    }

    useEffect(() => {
        if (readingSignRecords && readingSignRecords.length > 0) {
            setAcknowledged(resolveAcknowledged(readingSignRecords));
            setAcknowledgedByDay(resolveAcknowledgeByDay(readingSignRecords));
        }

        if (readingSigns && readingSigns.length > 0) {
            setDepartmentBreakdown(resolveDepartmentBreakdown(readingSigns));
        }
    }, [readingSigns, readingSignRecords]);

    
    return (
        <Row>
            <Col md={12}>
                <Row>
                    <Col md={3}>
                        <Card>
                            <CardBody>
                                <h4 className={'text-center'}>Acknowledged Status</h4>
                                <div style={{ height: '500px' }}>
                                {
                                    acknowledged.datasets && 
                                    <Pie 
                                        data={acknowledged}
                                        shadow={true}
                                    />
                                }
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <CardBody>
                                <h4 className={'text-center'}>Created by Unit</h4>
                                <div style={{ height: '500px' }}>
                                {
                                    departmentBreakdown.datasets && 
                                    <Pie 
                                        data={departmentBreakdown}
                                        shadow={true}
                                    />
                                }
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card>
                            <CardBody>
                                <h4 className={'text-center'}>Acknowledged by Day</h4>
                                <div style={{ height: '500px' }}>
                                    {
                                        acknowledgedByDay.datasets && 
                                        <BarNew 
                                            data={acknowledgedByDay}
                                            shadow={true}
                                        />
                                    }
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>

                    </Col>
                    <Col md={6}>

                    </Col>
                </Row>
            </Col>
        </Row>
    );
}