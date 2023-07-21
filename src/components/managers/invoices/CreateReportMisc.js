import React, {Fragment} from 'react';
import  {Button} from 'reactstrap';
import moment from 'moment';

const CreateReportMisc = ({
    data,
    d_start_date,
    d_end_date,
    formatCostTwoDecimals,
    type,
    s_airline_code,
    s_unit,
    weightType
}) => {

    const rowCreater = (dataItem, fontWeight='normal', total=false) => {
        return (`
            <tr style='font-weight: ${fontWeight}'>
                <td style='padding-left: ${total ? '5px' : '15px'}'>${total ? dataItem.s_misc_type : moment.utc(dataItem.d_flight).format('MM/DD')}</td>
                <td style='text-align: right'>${formatCostTwoDecimals(dataItem.f_misc)}</td>
                <td>${dataItem.s_misc_uom}</td>
                <td>${total ? '' : dataItem.s_notes}</td>
            </tr> 
        `);
    }


    // const checkMap = (totalMiscType, dailyMiscType, totalUom, dailyUom) => {
    //     if (totalMiscType, dailyMiscType, totalUom, dailyUom) {
    //         const matchType = totalMiscType.trim() === dailyMiscType.trim();
    //         const matchUom = totalUom.trim() === dailyUom.trim();    
    //         return matchType && matchUom;
    //     } else {
    //         return (totalMiscType === dailyMiscType) && (totalUom === dailyUom);
    //     }
    // }

    const checkMap = (totalMiscType, dailyMiscType, totalUom, dailyUom) => {
        if (totalMiscType, dailyMiscType, totalUom, dailyUom) {
            // console.log(`totalMiscType = ${totalMiscType}\ndailyMiscType = ${dailyMiscType}\ntotalUom = ${totalUom}\ndailyUom = ${dailyUom}`);
            // console.log(`matchType = ${matchType}`);
            // console.log(`matchUom = ${matchUom}`);
            const matchType = (totalMiscType && totalMiscType.trim()) === (dailyMiscType && dailyMiscType.trim());
            const matchUom = (totalUom && totalUom.trim()) === (dailyUom && dailyUom.trim());    
            return matchType && matchUom;
        } else {
            return (totalMiscType === dailyMiscType) && (totalUom === dailyUom);
        }
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
                                                <th width='16.6%'>Date</th>
                                                <th width='16.6%' style='text-align: right'>Amount</th>
                                                <th width='16.6%'>UOM</th>
                                                <th width='50%'>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        ${
                                            data.total.map(t =>  
                                                `${rowCreater(t, 'bold', true)}
                                                ${
                                                    data.daily.map(d => checkMap(d.s_misc_type, t.s_misc_type, d.s_misc_uom, t.s_misc_uom) &&
                                                        rowCreater(d, 'normal', false)
                                                    ).join(' ')
                                                }`
                                            ).join(' ')
                                        }
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

export default CreateReportMisc;