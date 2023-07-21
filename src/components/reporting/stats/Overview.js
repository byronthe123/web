import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import GraphCard from '../../custom/GraphCard';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { CalendarToolbar } from '../../CalendarToolbar';
import { ThemeColors } from '../../helpers/ThemeColors';
const colors = ThemeColors();
const localizer = momentLocalizer(moment);

export default function Overview ({
    stats,
    startDate,
    endDate
}) {

    const [validatedByDate, setValidatedByDate] = useState([]);
    const [validatedStatus, setValidatedStatus] = useState([]);
    const [numValidated, setNumValidated] = useState(0);
    const [nilCancelledFlights, setNilCancelledFlights] = useState({});
    const [nilEvents, setNilEvents] = useState([]);
    const [cancelledEvents, setCancelledEvents] = useState([]);
    const [nilCount, setNilCount] = useState('');
    const [cancelledCount, setCancelledCount] = useState('');
    
    useEffect(() => {
        const resolveIntervalData = (stats) => {

            // Validated by date: Set labels for the selected date range
            const validatedByDay = {};

            // Validated Status: Unique airlines object
            const airlines = {};

            // Initialize variable for numValidated:
            let numValidated = 0;
    
            for (let i = 0; i < stats.length; i++) {
                const { s_airline_code, t_validated } = stats[i];

                // Validated by date: increment number of validated
                const date = moment(t_validated).format('MM/DD/YYYY');
                if (moment(date).isValid()) {
                    if (validatedByDay[date] === undefined) {
                        validatedByDay[date] = 0;
                    } else {
                        validatedByDay[date]++;
                    }
                }

                // Validated Status: Get unique airlines

                if (airlines[s_airline_code] === undefined) {
                    airlines[s_airline_code] = {
                        validated: stats[i].b_validated ? 1 : 0,
                        total: 1
                    };
                } else {
                    airlines[s_airline_code].validated += stats[i].b_validated ? 1 : 0;
                    airlines[s_airline_code].total++;
                }

                // Increment number of total validated:
                numValidated += stats[i].b_validated ? 1 : 0;
            }

            setNumValidated(numValidated);

            // Validated by date: Map validatedByDay to labels and data array
            const dateLabels = [];
            const _validatedByDateData = [];
            for (let key in validatedByDay) {
                dateLabels.unshift(key);
                _validatedByDateData.unshift(validatedByDay[key]);
            }

            // Validated by date: create data object:
            const validatedByDateData = {
                labels: dateLabels,
                datasets: [{
                    label: 'Validated by Date',
                    data: _validatedByDateData,
                    backgroundColor: colors.themeColor1_10,
                    borderWidth: 2,
                    borderColor: colors.themeColor1,
                    hoverOffset: 4
                }]
            };

            setValidatedByDate(validatedByDateData);
    
            //  Validated Status: Map airlines to labels and validated
            const labels = [];
            const validated = [];
    
            for (let key in airlines) {
                labels.push(key);
                validated.push(((airlines[key].validated / airlines[key].total) * 100).toFixed(0));
            }

            //  Validated Status: create data object
            const validatedData = {
                labels,
                datasets: [{
                    label: 'Validated Status',
                    data: validated,
                    backgroundColor: colors.themeColor1_10,
                    borderWidth: 2,
                    borderColor: colors.themeColor1,
                    hoverOffset: 4
                }]
            };
    
            //  Validated Status: set data 
            setValidatedStatus(validatedData);
    
        } 

        const resolveCancelledNil = (stats) => {
            const map = {};
            let nilCount = 0;
            let cancelledCount = 0;

            for (let i = 0; i < stats.length; i++) {
                const date = moment(stats[i].t_modified).format('MM/DD/YYYY');
                const { b_cancelled, b_nil } = stats[i];
                if (b_cancelled || b_nil) {
                    if (map[date] === undefined) {
                        map[date] = {
                            cancelled: b_cancelled ? 1 : 0,
                            nil: b_nil ? 1 : 0
                        }
                    } else {
                        map[date].cancelled += b_cancelled ? 1 : 0;
                        map[date].nil += b_nil ? 1 : 0;
                    }

                    nilCount += b_nil ? 1 : 0;
                    cancelledCount += b_cancelled ? 1 : 0;
                }
            }

            setNilCancelledFlights(map);
            setNilCount(nilCount);
            setCancelledCount(cancelledCount);

            // set events
            const nilEvents = [];
            const cancelledEvents = [];

            Object.keys(map).map((key, i) => {
                if (map[key].nil > 0) {
                    nilEvents.push({
                        key: i,
                        title: map[key].nil,
                        allDay: true,
                        start: key,
                        end: key
                    });
                } else if (map[key].cancelled > 0) {
                    cancelledEvents.push({
                        key: i,
                        title: map[key].cancelled,
                        allDay: true,
                        start: key,
                        end: key
                    });
                }   
            });

            setNilEvents(nilEvents)
            setCancelledEvents(cancelledEvents);
        }

        resolveIntervalData(stats);
        resolveCancelledNil(stats);
    }, [stats]);


    const adjust = (color, amount) => {

        const percent = -10 * amount;
        
        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    const calendarStyle = (day, type) => {
        const date = moment(day).format('MM/DD/YYYY');

        if (nilCancelledFlights[date]) {
            const { cancelled, nil } = nilCancelledFlights[date];

            if (type === 'nil') {
                return {
                    style: {
                        backgroundColor: adjust('#BA55D3', nil)
                    }
                }; 
            } else {
                if (cancelled > 0) {
                    return {
                        style: {
                            backgroundColor: adjust('#d4af3', nil)
                        }
                    }; 
                }
            } 
    
        }

    };

    return (
        <>
            <Row>
                <Col md={12}>
                    <GraphCard 
                        type={'bar'}
                        title={`Validated Status: ${numValidated} / ${stats.length}`}
                        graphData={validatedStatus}
                        height={'500px'}
                    />
                </Col>
            </Row>
            <Row className={'mt-2'}>
                <Col md={12}>
                    <GraphCard 
                        type={'bar'}
                        title={'Validated by Date'}
                        graphData={validatedByDate}
                        height={'500px'}
                    />
                </Col>
            </Row>
            <Row className={'mt-2'}>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <h4>Nil Flights: {nilCount}</h4>
                            <Calendar
                                date={new Date(startDate)}
                                length={30}
                                localizer={localizer}
                                style={{ minHeight: '500px' }}
                                events={nilEvents}
                                views={['month']}
                                components={{
                                    toolbar: CalendarToolbar,
                                }}
                                eventPropGetter={(event) => {
                                    const newStyle = {
                                        backgroundColor: 'lightgrey',
                                        color: 'black',
                                        borderRadius: '0px',
                                        border: 'none',
                                        height: '100%,',
                                        width: '100%',
                                    };

                                    if (event.isMine) {
                                        newStyle.backgroundColor = 'lightgreen';
                                    }

                                    return {
                                        className: '',
                                        style: newStyle,
                                    };
                                }}
                                dayPropGetter={day => calendarStyle(day, 'nil')}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className={'mt-2'}>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <h4>Cancelled Flights: {cancelledCount}</h4>
                            <Calendar
                                date={new Date(startDate)}
                                length={30}
                                localizer={localizer}
                                style={{ minHeight: '500px' }}
                                events={cancelledEvents}
                                views={['month']}
                                components={{
                                    toolbar: CalendarToolbar,
                                }}
                                eventPropGetter={(event) => {
                                    const newStyle = {
                                        backgroundColor: 'lightgrey',
                                        color: 'black',
                                        borderRadius: '0px',
                                        border: 'none',
                                        height: '100%,',
                                        width: '100%',
                                    };

                                    if (event.isMine) {
                                        newStyle.backgroundColor = 'lightgreen';
                                    }

                                    return {
                                        className: '',
                                        style: newStyle,
                                    };
                                }}
                                dayPropGetter={day => calendarStyle(day, 'cancelled')}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
}