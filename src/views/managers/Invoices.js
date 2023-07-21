import React, { useState, useEffect } from 'react';
import {withRouter} from 'react-router-dom';
import { Table, Button, Card, CardBody, Row, Col  } from "reactstrap";
import moment, { months } from 'moment';
import axios from 'axios';
import { renderToString } from 'react-dom/server';
import { fileDownload } from '../../utils';

import AppLayout from '../../components/AppLayout';


import CreateReportStandard from '../../components/managers/invoices/CreateReportStandard';
import CreateReportDetailed from '../../components/managers/invoices/CreateReportDetailed';
import CreateReportMisc from '../../components/managers/invoices/CreateReportMisc';
import CreateReportRamp from '../../components/managers/invoices/CreateReportRamp';

import DisplayReportDetailed from '../../components/managers/invoices/DisplayReportDetailed';
import DisplayReportStandard from '../../components/managers/invoices/DisplayReportStandard';
import DisplayReportMisc from '../../components/managers/invoices/DisplayReportMisc';
import DisplayReportRamp from '../../components/managers/invoices/DisplayReportRamp';


import {
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    FlexibleXYPlot,
    Hint
} from 'react-vis';

import {generateStandardJson} from '../../components/managers/invoices/generateStandardJson';
import {generateDetailedJson} from '../../components/managers/invoices/generateDetailedJson';
import {generateMiscJson} from '../../components/managers/invoices/generateMiscJson'; 
import { generateRampJson } from '../../components/managers/invoices/generateRampJson';

const Invoices = ({
    user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, createSuccessNotification, eightyWindow, width
}) => {

    const getYears = () => {
        const startYear = 2019;
        const currentYear = moment().year();
        const yearsArray = [];

        for (let i = currentYear; i >= startYear; i--) {
            yearsArray.push(i);
        }

        return yearsArray;
    }

    const getMonths = () => {
        const monthsArray = [];
        for (let i = 1; i < 13; i++) {
            monthsArray.push(i);
        }
        return monthsArray;
    }

    const reportTypes = ['Tonnage', 'Screened', 'BUP', 'Misc', 'Ramp', 'Transfer'];
    const weightTypes = ['KG', 'LB'];

    const [s_unit, set_s_unit] = useState(null);
    const [d_start_date, set_d_start_date] = useState(moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'));
    const [d_end_date, set_d_end_date] = useState(moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'));
    const [s_airline_code, set_s_airline_code] = useState(null);
    const [selectedReportType, setSelectedReportType] = useState(reportTypes[0]);
    const [reportData, setReportData] = useState([]);
    const [availableUnits, setAvailableUnits] = useState([]);
    const [availableAirlines, setAvailableAirlines] = useState([]);
    const [weightType, setWeightType] = useState('KG');
    const [validationData, setValidationData] = useState(false);
    const [averageValidation, setAverageValidation] = useState(null);
    const [validReport, setValidReport] = useState(false);
    
    //react-vis:
    const [showGraph, setShowGraph] = useState(true);
    const [greenData, setGreenData] = useState([]);
    const [blueData, setBlueData] = useState([]);
    const [labelData, setLabelData] = useState([]);
    const [refreshLabelIndex, setRefreshLabelIndex] = useState(0);
    const [hintValue, setHintValue] = useState(null);


    const unitsQuery = () => {
        axios.post(`${baseApiUrl}/invoicesReportAvailableUnits`, {
            d_start_date: moment(d_start_date).format('YYYY-MM-DD'),
            d_end_date: moment(d_end_date).format('YYYY-MM-DD'),
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            const resolvedData = response.data.map(d => d.s_unit);
            setAvailableUnits(resolvedData);
            // set_s_unit(resolveUnitSelection(resolvedData));
        }).catch(error => {

        });
    }

    useEffect(() => {
        if (user && user.s_unit) {
            unitsQuery();
        }
    }, [d_start_date, d_end_date, user]);

    useEffect(() => {
        user && user.s_unit && 
        set_s_unit(resolveUnitSelection(availableUnits));
    }, [availableUnits, user.s_unit]);

    const resolveUnitSelection = (resolvedData) => {
        if (resolvedData.indexOf(user.s_unit) !== -1) {
            return user.s_unit;
        } 
        return resolvedData[0];
    }

    const airlinesQuery = () => {
        s_unit && s_unit !== null && 
        axios.post(`${baseApiUrl}/invoicesReportAvailableAirlines`, {
            d_start_date: moment(d_start_date).format('YYYY-MM-DD'),
            d_end_date: moment(d_end_date).format('YYYY-MM-DD'),
            s_unit
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            const resolvedData = response.data.map(d => d.s_airline_code);
            setAvailableAirlines(resolvedData);
            console.log(resolvedData);
            set_s_airline_code(resolvedData[0]);
        }).catch(error => {

        });
    }

    useEffect(() => {
        if (s_unit && s_unit !== null) {
            airlinesQuery();
        }
    }, [s_unit, availableUnits]);

    const reportDataQuery = () => {
        const queryUrl = selectedReportType.toLowerCase() === 'misc' ? 
            'miscReportQuery' : selectedReportType.toLowerCase() === 'ramp' ?
            'rampReportQuery' : 'airlineInvoicesReportCombined';

        axios.post(`${baseApiUrl}/${queryUrl}`, {
            s_unit,
            s_airline_code,
            d_start_date: moment(d_start_date).format('YYYY-MM-DD'),
            d_end_date: moment(d_end_date).format('YYYY-MM-DD'),
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            console.log(`$$$$$$$$$$$$`);
            console.log(response.data);
            console.log(`$$$$$$$$$$$$`);
            setReportData(response.data);
            const validationData = response.data.validation ? 
                resolveValidationData(response.data.validation) : [];
            handleChartData(validationData);
            setValidationData(validationData);
        }).catch(error => {

        });
    }

    useEffect(() => {

        if (reportData.main && reportData.main.length > 0 || reportData.dailyTotals && reportData.dailyTotals.length > 0 || reportData.daily && reportData.daily.length > 0) {
            setValidReport(true);
            if (selectedReportType === 'Misc') {
                setDisplayReportElement(
                    <div className='px-4'>
                        <Row>
                            <DisplayReportMisc 
                                formatCostTwoDecimals={formatCostTwoDecimals}
                                type={selectedReportType}
                                weightType={weightType}
                                data={reportData}
                            />
                        </Row>
                    </div>
                )
            } else if (selectedReportType === 'Ramp') {
                setDisplayReportElement(
                    <div className='px-4'>
                        <Row>
                            <DisplayReportRamp 
                                formatCostTwoDecimals={formatCostTwoDecimals}
                                type={selectedReportType}
                                weightType={weightType}
                                data={reportData}
                            />
                        </Row>
                    </div>
                )
            } else {
                setDisplayReportElement(
                    <div className='px-4'>
                        <Row>
                            <DisplayReportStandard 
                                formatCost={formatCost}
                                type={selectedReportType}
                                weightType={weightType}
                                data={reportData}
                            />
                            <DisplayReportDetailed 
                                formatCost={formatCost}
                                type={selectedReportType}
                                weightType={weightType}
                                data={reportData}
                            />
                        </Row>
                    </div>
                )
            }
        } else {
            setDisplayReportElement(<h4>No Data Found</h4>)
            setValidReport(false);
        }

    }, [reportData]);

    const resolveAverageValidation = () => {

        const validated = validationData.reduce((total, d) => {
            return total += d.numValidated
        }, 0);

        const total = validationData.reduce((total, d) => {
            return total += d.total;
        }, 0);

        return ((validated / total) * 100).toFixed(0);

    }

    useEffect(() => {
        if (validationData.length > 0) {
            const validationPercentage = resolveAverageValidation(validationData);
            setAverageValidation(`${s_unit} ${s_airline_code} ${d_start_date} - ${d_end_date} ${validationPercentage}% Validated`);
        }
    }, [validationData]);

    const formatCost = (cost) => {
        const toFormat = cost && cost !== null && cost > 0 ? parseFloat(cost) : 0;
        return `${toFormat.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }

    const formatCostTwoDecimals = (cost) => {
        const toFormat = cost && cost !== null && cost > 0 ? parseFloat(cost) : 0;
        return `${toFormat.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }

    const handlePrint = (value) => {
        const printSheet = value.replace(/false/g, '').replace(/null/g, '');
        const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
        myWindow && myWindow !== null && myWindow.document.write(printSheet);    
    }

    const generateReport = () => {

        if (selectedReportType.toLowerCase() === 'misc') {

            const deliverySheetPrint = renderToString(
                // <CreateReportMiscNew
                <CreateReportMisc
                    data={reportData}
                    d_start_date={d_start_date}
                    d_end_date={d_end_date}
                    formatCost={formatCost}
                    type={selectedReportType}
                    s_airline_code={s_airline_code}
                    s_unit={s_unit}
                    weightType={weightType}
                    formatCostTwoDecimals={formatCostTwoDecimals}
                />
            );

            handlePrint(deliverySheetPrint);

        } else if (selectedReportType.toLowerCase() === 'ramp') {

            const deliverySheetPrint = renderToString(
                <CreateReportRamp
                    data={reportData}
                    d_start_date={d_start_date}
                    d_end_date={d_end_date}
                    formatCost={formatCost}
                    type={selectedReportType}
                    s_airline_code={s_airline_code}
                    s_unit={s_unit}
                    weightType={weightType}
                    formatCostTwoDecimals={formatCostTwoDecimals}
                />
            );

            handlePrint(deliverySheetPrint);
        } else {

            const deliverySheetPrint1 = renderToString(
                <CreateReportStandard
                    data={reportData}
                    d_start_date={d_start_date}
                    d_end_date={d_end_date}
                    formatCost={formatCost}
                    type={selectedReportType}
                    s_airline_code={s_airline_code}
                    s_unit={s_unit}
                    weightType={weightType}
                />
            );
    
            const deliverySheetPrint2 = renderToString(
                <CreateReportDetailed
                    data={reportData}
                    d_start_date={d_start_date}
                    d_end_date={d_end_date}
                    formatCost={formatCost}
                    type={selectedReportType}
                    s_airline_code={s_airline_code}
                    s_unit={s_unit}
                    weightType={weightType}
                />
            );

            const combined = deliverySheetPrint1 + deliverySheetPrint2;
            handlePrint(combined);
        }
    }


    const generateReportCsv = () => {
        const data = [];

        if (selectedReportType === 'Misc') {

            const miscReportItems = generateMiscJson(selectedReportType, reportData, weightType, formatCostTwoDecimals);
            // const miscReportItems = generateMiscJsonNew(selectedReportType, reportData, weightType, formatCostTwoDecimals);


            miscReportItems.map(i => data.push(i));

        } else if (selectedReportType === 'Ramp') {

            const rampReportItems = generateRampJson(selectedReportType, reportData, weightType, formatCostTwoDecimals);

            rampReportItems.map(i => data.push(i));

        } else {
            //Report Standard:
            const standardReportItems = generateStandardJson(selectedReportType, reportData, weightType, formatCost);

            standardReportItems.map(i => data.push(i));
            
            //Report Standard:
            const detailedReportItems = generateDetailedJson(selectedReportType, reportData, weightType, formatCost);

            detailedReportItems.map(i => data.push(i));
            
        }

        fileDownload(data, 'Invoices Data.csv');

    }

    const [displayReportElement, setDisplayReportElement] = useState('');

    const resolveValidationData = (data) => {
        const resolvedData = [];

        for (let i = 0; i < data.length; i++) {
            if (resolvedData.filter(d => d.s_flight_number === data[i].s_flight_number).length === 0) {
                resolvedData.push({
                    s_flight_number: data[i].s_flight_number,
                    numValidated: data[i].b_validated ? data[i].total : 0,
                    numNotValidated: !data[i].b_validated ? data[i].total : 0,
                    total: data[i].total
                });
            } else {
                for (let j = 0; j < resolvedData.length; j++) {
                    if (resolvedData[j].s_flight_number === data[i].s_flight_number) {
                        // const addValidated = data[i].b_validated ? data[i].total : 0;
                        // const addNotValidated = !data[i].b_validated ? data[i].total : 0;
                        resolvedData[j].numValidated += data[i].b_validated ? data[i].total : 0;
                        resolvedData[j].numNotValidated += !data[i].b_validated ? data[i].total : 0;
                        resolvedData[j].total += data[i].total;
                    }
                }
            }
        }

        console.log(resolvedData);
        
        return resolvedData;

    }

    const handleChartData = (data) => {

        if (data) {
            const setGreen = [];
            const setBlue = [];
    
            for (let i = 0; i < data.length; i++) {
                setGreen.push({
                    x: data[i].s_flight_number,
                    y: ((data[i].numValidated / data[i].total) * 100) === 100 ? 106 : (data[i].numValidated / data[i].total) * 100
                });
                setBlue.push({
                    x: data[i].s_flight_number,
                    y: 100
                });
            }
    
            console.log(setGreen);
            console.log(setBlue);
    
            setGreenData(setGreen);
            setBlueData(setBlue);
            setRefreshLabelIndex(refreshLabelIndex + 1);
        }
    }

    useEffect(() => {
        setLabelData(greenData.map((d, idx) => ({
            x: d.x,
            y: greenData[idx].y
        })));
    }, [refreshLabelIndex]);

    const rememberValue = (captureValue) => {
        console.log(captureValue);
        const selected = validationData.filter(d => d.s_flight_number === captureValue.x)[0];
        console.log(selected);
        setHintValue({
            validated: selected.numValidated,
            notValidated: selected.numNotValidated,
            total: selected.total
        });
    }

    const forgetValue = () => {
        setHintValue(null);
    }

    const enableReportDataQuery = () => {
        const checkArray = [s_unit, s_airline_code];
        let enable = false;
        for (let i = 0; i < checkArray.length; i++) {
            enable = checkArray[i] && checkArray[i] !== null;
        }
        return enable;
    }


    return (
        <AppLayout>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-1 py-1'>
                        <div className='col-12'>
                            <h1 className={'mb-1 pb-1'}>Invoices</h1>
                        </div>
                        <div className={`col-12`} style={{fontSize: '16px'}}>
                                <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                                    <CardBody className='custom-card-transparent py-2 px-2' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                                        <Row>

                                            <div className={`${width < 1200 ? 'col-md-4' : 'col-md-2'}`}>
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th className='py-0'>Unit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='py-0'>
                                                                <div style={{height: '120px', overflowY: 'auto'}}>
                                                                    <Table className='table-row-hover'>
                                                                        <thead></thead>
                                                                        <tbody>
                                                                        {
                                                                            availableUnits.length > 0 && availableUnits.map((u, i) =>
                                                                                <tr key={i} className={`text-center ${s_unit === u ? 'table-row-selected' : ''}`}>
                                                                                    <td className='mx-auto py-0' onClick={() => set_s_unit(u)}>{u}</td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                        </tbody>
                                                                    </Table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>

                                            <div className={`${width < 1200 ? 'col-md-4' : 'col-md-2'}`}>
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th className='py-0'>Start Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='py-0'>
                                                                <div style={{height: '120px', overflowY: 'auto'}}>
                                                                    <input type='date' value={d_start_date} onChange={(e) => set_d_start_date(e.target.value)} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>

                                            <div className={`${width < 1200 ? 'col-md-4' : 'col-md-2'}`}>
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th className='py-0'>End Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='py-0'>
                                                                <div style={{height: '120px', overflowY: 'auto'}}>
                                                                    <input type='date' value={d_end_date} onChange={(e) => set_d_end_date(e.target.value)} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>

                                            <div className={`${width < 1200 ? 'col-md-4' : 'col-md-2'}`}>
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th className='py-0'>Airline</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='py-0'>
                                                                <div style={{height: '120px', overflowY: 'auto'}}>
                                                                    <Table className='table-row-hover'>
                                                                        <thead></thead>
                                                                        <tbody>
                                                                        {
                                                                            availableAirlines.length > 0 && availableAirlines.map((a, i) =>
                                                                                <tr key={i} className={`text-center ${s_airline_code === a ? 'table-row-selected' : ''}`}>
                                                                                    <td className='mx-auto py-0' onClick={() => set_s_airline_code(a)}>{a}</td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                        </tbody>
                                                                    </Table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>

                                            <div className={`${width < 1200 ? 'col-md-4' : 'col-md-2'}`}>
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th className='py-0'>Report Type</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='py-0'>
                                                                <div style={{height: '120px', overflowY: 'auto'}}>
                                                                    <Table className='table-row-hover'>
                                                                        <thead></thead>
                                                                        <tbody>
                                                                        {
                                                                            reportTypes.map((r, i) =>
                                                                                <tr key={i} className={`text-center ${selectedReportType === r ? 'table-row-selected' : ''}`}>
                                                                                    <td className='mx-auto py-0' onClick={() => setSelectedReportType(r)}>{r}</td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                        </tbody>
                                                                    </Table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>

                                            <div className={`${width < 1200 ? 'col-md-4' : 'col-md-2'}`}>
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th className='py-0'>Weight Type</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='py-0'>
                                                                <div style={{height: '120px', overflowY: 'auto'}}>
                                                                    <Table className='table-row-hover'>
                                                                        <thead></thead>
                                                                        <tbody>
                                                                        {
                                                                            weightTypes.map((w, i) =>
                                                                                <tr key={i} className={`text-center ${weightType === w ? 'table-row-selected' : ''}`}>
                                                                                    <td className='mx-auto py-0' onClick={() => setWeightType(w)}>{w}</td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                        </tbody>
                                                                    </Table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>

                                        </Row>
                                        <Row>
                                            <Col md={12} className='text-right'>
                                                <Button disabled={!enableReportDataQuery()} onClick={() => reportDataQuery()}>Generate Report</Button>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                        </div>
                    </Row>
                    {
                        validationData && 
                        <>
                            {
                                showGraph ?
                                    <Row className='px-1 py-1'>
                                        <div className={`col-12`} style={{fontSize: '16px'}}>
                                            <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                                                <CardBody className='custom-card-transparent pt-2 px-2' style={{backgroundColor: 'rgba(255,255,255,0.2)', height: '300px', paddingBottom: '60px'}}>
                                                    <Row>
                                                        <Col md={12}>
                                                            <div className={'float-left'}>
                                                                <h4>{validationData && validationData.length > 0 && averageValidation}</h4>
                                                            </div>
                                                            <div className={'float-right pb-1'}>
                                                                <Button onClick={() => setShowGraph(false)}>Hide Graph</Button>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <FlexibleXYPlot xType="ordinal" xDistance={100} yDomain={[0,100]} stackBy="y">
                                                        <VerticalGridLines />
                                                        <HorizontalGridLines />
                                                        <XAxis />
                                                        <YAxis />
                                                        <VerticalBarSeries data={greenData} color={'#63b995'} onValueMouseOver={rememberValue} onValueMouseOut={forgetValue} />
                                                        <VerticalBarSeries data={blueData} color={'#ee6352'} />
                                                        {
                                                            hintValue && hintValue !== null ?
                                                            <Hint value={hintValue}>
                                                                <div style={{color: 'black'}}>
                                                                    <h5>Validated: {hintValue.validated}, Not Validated: {hintValue.notValidated}, Total: {hintValue.total}</h5>
                                                                </div>
                                                            </Hint> :
                                                            null
                                                        }
                                                    </FlexibleXYPlot>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </Row>
                                : 
                                <Row>
                                    <Col md={12} className={'text-right'}>
                                        <Button onClick={() => setShowGraph(true)}>Display Graph</Button>
                                    </Col>
                                </Row>
                            }
                        </>
                    }
                    <Row className='px-2'>
                        <div className={`col-12 mt-1`} style={{ overflowY: 'scroll', maxHeight: showGraph ? '200px' : '420px' }}>
                            <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                                <CardBody className='custom-card-transparent py-2 px-2' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                                    {
                                        displayReportElement
                                    }
                                    {
                                        validReport && 
                                        <Row>
                                            <Col md={12} className='text-right'>
                                                <Button className='mr-2' disabled={validReport === false} onClick={() => generateReport()}>Print {validReport}</Button>
                                                <Button color={'info'} disabled={validReport === false} onClick={() => generateReportCsv()}>Export to CSV</Button>
                                            </Col>
                                        </Row>
                                    }
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </div>
            </div>

            

        </AppLayout>
    );
}

export default withRouter(Invoices);