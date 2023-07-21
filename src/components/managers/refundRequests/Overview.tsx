import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import GraphCard from '../../custom/GraphCard';
import { ThemeColors } from '../../helpers/ThemeColors';
import moment from 'moment';
import { IRefundRequest, RefundRequests } from './interfaces';
import { IMap } from '../../../globals/interfaces';

const colors = ThemeColors();

interface Props {
    items: RefundRequests
}

export default function Overview ({
    items
}: Props) {

    const [statusData, setStatusData] = useState({});
    const [requestsByDay, setRequestsByDay] = useState({});
    const [createdByDay, setCreatedByDay] = useState({});
    const [responseTimeByDay, setResponseTimeByDay] = useState({});

    const resolveStatusData = (items: RefundRequests) => {
        let open = 0, approved = 0, denied = 0;

        for (let i = 0; i < items.length; i++) {
            const { s_status } = items[i];
            if (s_status === 'OPEN') {
                open++;
            } else if (s_status === 'APPROVED') {
                approved++;
            } else {
                denied++;
            }
        }

        const data = {
            labels: [
                'OPEN',
                'APPROVED',
                'DENIED'
            ],
            datasets: [{
                data: [open, approved, denied],
                backgroundColor: [
                    colors.themeColor1_10,
                    colors.themeColor2_10,
                    colors.themeColor3_10,
                ],
                borderWidth: 2,
                borderColor: [colors.themeColor1, colors.themeColor2, colors.themeColor3],
                hoverOffset: 4
            }]
        };

        return data;
    }

    const resolveAmountCreatedByDay = (items: RefundRequests) => {

        const createdMap: IMap<number> = {};
        const requestedMap: IMap<number> = {};
        const responseTimeMap: IMap<number> = {};
        const labels = [];

        for (let i = 0; i < 7; i++) {
            const day = moment().subtract(i, 'days').format('MM/DD/YYYY');
            createdMap[day] = 0;
            requestedMap[day] = 0;
            responseTimeMap[day] = 0;
            labels.unshift(day);
        }

        items.sort((a, b) => +new Date(a.t_created) - +new Date(b.t_created));

        // console.log(items);

        for (let i = items.length - 1; i > 0; i--) {
            // console.log(items[i]);

            const day = moment(items[i].t_created).format('MM/DD/YYYY');
            if (moment(day).isBefore(moment(labels[0]))) {
                break;
            } else {
                createdMap[day] += items[i].f_amount;
                requestedMap[day]++;
                responseTimeMap[day] += items[i].ic_length;
            }
        }

        const created = [];
        const requested = [];
        const responseTime = [];

        for (let i = 0; i < labels.length; i++) {
            created.push(createdMap[labels[i]]);
            requested.push(requestedMap[labels[i]]);
            responseTime.push(responseTimeMap[labels[i]]);
        }   

        const backgroundColor = [];
        const borderColor = [];

        for (let i = 0; i < 6; i++) {
            // @ts-ignore
            borderColor.push(colors[`themeColor${i+1}`]);
            // @ts-ignore
            backgroundColor.push(colors[`themeColor${i+1}_10`]);
        }

        backgroundColor.push('themeColor1');     
        borderColor.push('themeColor1');   

        const createdData = {
            labels,
            datasets: [{
                label: 'Created by Day',
                data: created,
                backgroundColor: colors.themeColor1_10,
                borderWidth: 2,
                borderColor: colors.themeColor1,
                hoverOffset: 4
            }]
        };

        setCreatedByDay(createdData);

        const requestedData = {
            labels,
            datasets: [{
                label: 'Requested by Day',
                data: requested,
                backgroundColor: colors.themeColor1_10,
                borderWidth: 2,
                borderColor: colors.themeColor1,
                hoverOffset: 4
            }]
        };

        setRequestsByDay(requestedData);

        const requestedTimeData = {
            labels,
            datasets: [{
                label: 'Response Time in Hours by Day',
                data: responseTime,
                backgroundColor: colors.themeColor1_10,
                borderWidth: 2,
                borderColor: colors.themeColor1,
                hoverOffset: 4
            }]
        };

        setResponseTimeByDay(requestedTimeData);
    }   

    const [key, setKey] = useState(0);

    useEffect(() => {
        if (items && items.length > 0) {
            setStatusData(resolveStatusData(items));
            resolveAmountCreatedByDay(items);
        } else {
            setStatusData({});
            setRequestsByDay({});
            setCreatedByDay({});
            setResponseTimeByDay({});
        }
        setKey(prev => prev + 1);
    }, [items]);

    return (
        <Row key={key}>
            <Col md={2}>
                <GraphCard 
                    type={'pie'}
                    title={'Breakdown by Status'}
                    graphData={statusData}
                    height={'500px'}
                />
            </Col>
            <Col md={5}>
                <GraphCard 
                    type={'bar'}
                    title={'Requests by Day'}
                    graphData={requestsByDay}
                    height={'500px'}
                />
            </Col>
            <Col md={5}>
                <GraphCard 
                    type={'bar'}
                    title={'Amount Created by Day'}
                    graphData={createdByDay}
                    height={'500px'}
                />
            </Col>
            <Col md={12} className={'mt-2'}>
                <GraphCard 
                    type={'bar'}
                    title={'Response Time in Hours by Day'}
                    graphData={responseTimeByDay}
                    height={'500px'}
                />
            </Col>
        </Row>
    );
}