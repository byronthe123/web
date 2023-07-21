import React, {Fragment} from 'react';
import  {Button} from 'reactstrap';
import moment from 'moment';

import { rampFields } from './mapFields';

export default ({
    data,
    d_start_date,
    d_end_date,
    formatCostTwoDecimals,
    type,
    s_airline_code,
    s_unit,
    weightType
}) => {

    const rowCreater = (dataItem, fontWeight='normal') => {
        return (`
            <tr style='font-weight: ${fontWeight}'>
                ${
                    rampFields.map((f, i) => f.value === 'd_flight' ?
                        `<td>${moment.utc(dataItem.d_flight).format('MM/DD')}</td>` : f.value === 's_flight_number' ?
                        `<td>${dataItem.s_flight_number === null ? '' : dataItem.s_flight_number}</td>` : f.num ?
                        `<td style='text-align: right'>${formatCostTwoDecimals(dataItem[f.value])}</td>` :
                        `<td style='text-align: right'>${dataItem[f.value]}</td>`
                    ).join(' ')
                }
            </tr> 
        `);
    }

    const validValue = (value) => {
        // return value && value !== null && parseFloat(value) > 0;
        if (value && value !== null && parseFloat(value) > 0) {
            return true;
        }
        return false;
    }

    const renderSecondTable = () => {
        const totalItem = data.daily.filter(d => d.s_flight_number === 'grand_total')[0];
        const valid = validValue(totalItem.flight_turn) || validValue(totalItem.parking) || validValue(totalItem.drayage);
        return valid;
    }

    const renderSecondTableRow = (row) => {
        return true;
        // const valid = validValue(row.flight_turn) || validValue(row.parking) || validValue(row.drayage);
        // return valid;
    }

    return (
        <Fragment>
            <div dangerouslySetInnerHTML={{ __html: `
                <html>
                    <head>
                        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
                    </head>
                    <body>
                        <style>
                            tbody > tr:nth-child(even)>td {
                                background-color: #e1dddc !important;
                            }

                            thead > tr:first-child>th { 
                                background-color: #add8e6 !important; 
                            }

                            tbody > tr:last-child>td { 
                                background-color: #a9a9a9 !important; 
                            }

                            tbody > tr > td {
                                padding-top: 0px !important;
                                padding-bottom: 0px !important;
                            }

                            thead > tr > th {
                                padding-top: 0px !important;
                                padding-bottom: 0px !important;
                            }

                            p {
                                margin: 0 !important;
                                padding: 0 !important;
                            }

                            @media print{@page {size: landscape}}
                        </style>
                        <div class='container-fluid'>
                            <div class='row'>
                                <img src='https://ewrstorage1.blob.core.windows.net/pics/choice-logo.png' style='width: 250px; height: auto; float: left' />
                                <div style='float: right; text-align: right; font-size: 16px; font-weight: bolder;'>
                                    <p>${s_unit}</p>
                                    <p>For ${d_start_date} - ${d_end_date}</p>
                                    <p>Airline ${data.airlineInfo.length > 0 ? data.airlineInfo[0].s_airline_name : s_airline_code}</p>
                                    <p>Airline Stats Report - ${type}</p>
                                </div>
                            </div>

                            <div class='row' style='margin-top: 15px'>
                                <table class='table' style='table-layout: fixed'>
                                    <thead>
                                        <tr>
                                            ${
                                                rampFields.map((f, i) =>
                                                    `<th width='${f.value === 's_notes' ? '30%' : '5.5%'}' style='font-size: 10px; ${!f.nonTotal ? 'text-align: right' : ''}'>${f.name}</th>`
                                                ).join(' ')
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                    ${
                                        data.daily.map(d => d.s_flight_number !== 'grand_total' && renderSecondTableRow(d) &&
                                            rowCreater(d, 'normal')
                                        ).join(' ')
                                    }
                                    ${
                                        data.daily.map(d => d.s_flight_number === 'grand_total' &&
                                            `        
                                            <tr style='font-weight: bolder'>
                                                <td colSpan='3'>Grand Total</td>
                                                ${
                                                    rampFields.map((f, i) =>  f.num &&
                                                        `<td style='text-align: right'>${formatCostTwoDecimals(d[f.value])}</td>`
                                                    ).join(' ')
                                                }
                                            </tr> 
                                            `                                        
                                        ).join(' ')
                                    }
                                        <td style='text-align: right'></td>
                                    </tbody>
                                </table> 
                            </div>
                        </div>
                    </body>
                </html>
            ` }}>
            </div>
        </Fragment>
    );
}
