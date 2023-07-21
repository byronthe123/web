import React, {Fragment} from 'react';
import  {Button} from 'reactstrap';
import moment from 'moment';

const CreateReportDetailed = ({
    data,
    d_start_date,
    d_end_date,
    formatCost,
    type,
    s_airline_code,
    s_unit,
    weightType
}) => {

    const factor = weightType === 'KG' ? 1 : 2.205;

    const rowCreater = (dataItem, showDate=false, fontWeight='normal') => {
        return (`
        <tr style='font-weight: ${fontWeight}'>
            <td>${showDate ? moment.utc(dataItem.date).format('MM/DD') : dataItem.flight}</td>
            <td style='text-align: right'>${formatCost(dataItem.loose * factor)}</td>
            <td style='text-align: right'>${formatCost(dataItem.bup * factor)}</td>
            ${
                type && type.toLowerCase() === 'bup' && 
                `<td>${formatCost(dataItem.bup_ld3)}</td>
                <td>${formatCost(dataItem.bup_ld7)}</td>`
            }
            <td style='text-align: right'>${formatCost(dataItem.total * factor)}</td>
            <td style='text-align: right'>${formatCost(dataItem.mail * factor)}</td>
            ${
                type && type.toLowerCase() === 'transfer' && 
                `<td style='text-align: right'>${formatCost(dataItem.transfer_kg * factor)}</td>`
            }
            <td style='text-align: right'>${formatCost(dataItem.flight_kg * factor)}</td>
            <td style='text-align: right'>${formatCost(dataItem.dg_count)}</td>
            ${
                type && type.toLowerCase() === 'screened' && 
                `<td style='text-align: right'>${formatCost(dataItem.screened_kg * factor)}</td>`
            }
        </tr> 
    `);
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
                        </style>
                        <div class='container-fluid'>
                            <div class='row'>
                                <img src='https://ewrstorage1.blob.core.windows.net/pics/choice-logo.png' style='width: 250px; height: auto; float: left' />
                                <div style='float: right; text-align: right; font-size: 16px; font-weight: bolder;'>
                                    <p>${s_unit} for ${d_start_date} - ${d_end_date}</p>
                                    <p>Airline ${data.airlineInfo.length > 0 ? data.airlineInfo[0].s_airline_name : s_airline_code}</p>
                                    <p>Airline Stats Report - ${type}</p>
                                    <p>Weight Type: ${weightType}</p>
                                </div>                           
                            </div>
                            <div class='row' style='margin-top: 15px'>
                                <table class='table'>
                                    <thead>
                                        <tr>
                                            <th>FLIGHT</th>
                                            <th style='text-align: right'>LOOSE</th>
                                            <th style='text-align: right'>BUP</th>
                                            ${
                                                type && type.toLowerCase() === 'bup' && 
                                                `<th>BUP LD3</th>
                                                <th>BUP LD7</th>`
                                            }
                                            <th style='text-align: right'>TOTAL</th>
                                            <th style='text-align: right'>MAIL</th>
                                            ${
                                                type && type.toLowerCase() === 'transfer' && 
                                                `<th style='text-align: right'>TRANSFER ${weightType}</th>`
                                            }
                                            <th style='text-align: right'>FLIGHT ${weightType}</th>
                                            <th style='text-align: right'>DG COUNT</th>
                                            ${
                                                type && type.toLowerCase() === 'screened' && 
                                                `<th style='text-align: right'>SCREENED ${weightType}</th>`
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                    ${
                                        data.daily.map(d => d.type === 'EXPORT TOTAL' &&
                                            rowCreater(d, false, 'bold')
                                        ).join(' ')
                                    }
                                    ${
                                        data.dailyTotals.map(d => d.type === 'EXPORT' && 
                                            `${rowCreater(d, true, 'bold')}
                                            ${
                                                data.daily.map(m => m.type === 'EXPORT' && m.date === d.date &&
                                                    rowCreater(m, false)
                                                ).join(' ')
                                            } 
                                            `
                                        ).join(' ')
                                    }
                                    ${
                                        data.daily.map(d => d.type === 'IMPORT TOTAL' && 
                                            rowCreater(d, false, 'bold')
                                        ).join(' ')
                                    }
                                    ${
                                        data.dailyTotals.map(d => d.type === 'IMPORT' && 
                                        `${rowCreater(d, true, 'bold')}
                                            ${
                                                data.daily.map(m => m.type === 'IMPORT' && m.date === d.date &&
                                                    rowCreater(m, false)
                                                ).join(' ')
                                            } 
                                            `
                                        ).join(' ')
                                    }
                                    ${
                                        data.daily.map(d => d.type === 'GRAND TOTAL' && 
                                            rowCreater(d, false, 'bold')
                                        ).join(' ')
                                    }
                                    </tbody>
                                </table> 
                            </div>
                        </div>
                    </body>
                    <div style='position: fixed; bottom: 0; text-align: right'>
                        <img src='https://ewrstorage1.blob.core.windows.net/pics/eos-logo-2.png' style='width: 25px; height: auto;' />
                    </div>
                </html>
            ` }}>
            </div>
        </Fragment>
    );
}

export default CreateReportDetailed;