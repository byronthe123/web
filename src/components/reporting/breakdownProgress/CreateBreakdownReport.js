import React, { useMemo } from 'react';
import moment from 'moment';
import { formatPercent, formatMawb } from '../../../utils';

export default function CreateBreakdownReport ({
    user,
    d_arrival_date,
    flights,
    uldsData,
    stationInfo,
    email,
    awbReport
}) {

    console.log(uldsData);

    const header = useMemo(() => {
        if (email) {
            return '';
        } else {
            return `
                <div class='row'>
                    <div class='col-xs-4' style='padding-left: 40px;'>
                        <img src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.logo.01.png' style='width: 300px; height: auto' />
                    </div>
                    <div class='col-xs-2'>
                        <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.add.01.png' />
                        <h6>${stationInfo.s_address}</h6>
                    </div>
                    <div class='col-xs-2'>
                        <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.phone.01.png' />
                        <h6>${stationInfo.s_phone}</h6>
                    </div>
                    <div class='col-xs-2'>
                        <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.email.01.png' />
                        <h6>${stationInfo.email || ''}</h6>
                    </div>
                    <div class='col-xs-2'>
                        <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.web.01.png' />
                        <h6>www.choice.aero</h6>
                    </div>
                </div>
                <div class='row' style='margin-left: 20px;'>
                    <div class='col-xs-2'>
                        <div class='row'>
                            <h6>Breakdown Report - ${user.s_unit}</h6>
                            <h6>Created by ${user.displayName} at ${moment().format('MM/DD HH:mm')}</h6>
                        </div>
                    </div>
                    <div class='col-xs-10'>
                        <div class='row' style='padding-left: 440px;'>
                            <h3> 
                                <span class='bg-blue text-white-custom text-right' style='font-size: 55px;'>${moment(d_arrival_date).format('MMMM DD YYYY')}</span>
                            </h3>
                        </div>
                    </div>
                </div>
            `;
        }
    }, [email, stationInfo, user]);

    const table = useMemo(() => {
        return `
            <div class='row' style='margin-top: 40px; width: 1100px; margin-left: 10px;'>
                <div class='col-xs-12'>
                    <table class='table'>
                        <thead class='bg-blue'>
                            <tr style='text-align: center;'>
                                <th class='align-right'>Progress</th>
                                <th class='align-right'>Unique</th>
                                <th>Flight</th>
                                ${
                                    awbReport ? 
                                        `
                                        <th>AWB</th>
                                        ` : 
                                        `
                                        <th class='align-right'>Closed/ULD</th>
                                        `
                                }
                                <th class='align-right'>PCs MAN</th>
                                <th class='align-right'>Pcs B/D</th>
                                <th class='align-right'>Under</th>
                                <th class='align-right'>Over</th>
                                <th class='align-right'>Delivered</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${
                                flights.map(f => (
                                    `<tr>
                                        <td class='align-right'>${formatPercent(f.progress, true)}</td>
                                        <td class='align-right'>${f.i_unique}</td>
                                        <td>${f.s_flight_id}</td>
                                        ${
                                            awbReport ? 
                                                `
                                                <td>${formatMawb(f.s_mawb)}</td>
                                                ` : 
                                                `
                                                <td class='align-right'>${f.closedUldsCount}/${f.uldsCount}</td>        
                                                `
                                        }
                                        <td class='align-right'>${f.i_actual_piece_count}</td>
                                        <td class='align-right'>${f.rackPieces}</td>
                                        <td class='align-right'>
                                            ${Math.abs(Math.max(f.i_actual_piece_count - f.rackPieces, 0))}
                                        </td>
                                        <td class='align-right'>
                                            ${Math.abs(Math.min(f.i_actual_piece_count - f.rackPieces, 0))}
                                        </td>
                                        <td class='align-right'>${f.deliveredPcs}</td>
                                    </tr>`
                                )).join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }, [flights]);

    const uldsTable = useMemo(() => {
        if (!uldsData) return '';
        return `
            <div class='row pagebreak' style='margin-top: 40px; width: 1100px; margin-left: 10px;'>
                <h1>ULD Report for ${d_arrival_date}</h1>
                <div class='col-xs-12'>
                    <table class='table'>
                        <thead class='bg-blue'>
                            <tr style='text-align: center;'>
                                <th>Flight</th>
                                <th class='align-right'>Messaged</th>
                                <th class='align-right'>Accepted</th>
                                <th class='align-right'>Opened</th>
                                <th class='align-right'>Closed</th>
                                <th class='align-right'>Sequence</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${
                                uldsData.map(uld => (
                                    `<tr>
                                        <td>${uld.s_flight_number}</td>
                                        <td class='align-right'>${uld.b_messaged}</td>
                                        <td class='align-right'>${uld.b_accepted}</td>
                                        <td class='align-right'>${uld.b_opened}</td>
                                        <td class='align-right'>${uld.b_closed}</td>
                                        <td class='align-right'>${uld.i_unique}</td>
                                    </tr>`
                                )).join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }, [uldsData]);

    return (
        <div dangerouslySetInnerHTML={{ __html: `
            <html>
                <head>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
                </head>
                <body>
                    <style>
                        body {
                            border: 20px solid white;
                            -webkit-print-color-adjust: exact !important;
                        }
                
                        .bg-blue {
                            background-color: 	rgb(64, 159, 216) !important;
                        }
                
                        .bg-grey {
                                background-color: 	rgb(225, 221, 220) !important;
                        }
                
                        .slanting-line {
                            height: 24px;
                            width: 10px;
                            position: relative;
                            top: -5px;
                        }
                
                        .table-row-info {
                            text-align: center;
                            display: inline-block;
                        }
                
                        tbody tr:nth-child(odd){
                            background-color: #d5edfd !important;
                        }
                
                        tbody tr:nth-child(even){
                            background-color: #ffffff !important;
                        }
                
                        .table th {
                            background-color:	rgb(64, 159, 216) !important;
                            color: white !important;
                        }
                
                        .img-small {
                            width: '10px';
                            height: auto;
                        }
                
                        .text-blue {
                            color: rgb(64, 159, 216)
                        }
                
                        .test-background {
                            background-color: #f17150 !important;
                        }
                
                        /* * {
                            border: 1px solid red;
                        } */
                
                        .text-white-custom {
                            color: white !important;
                        }

                        .align-right {
                            text-align: right;
                        }

                        .pagebreak {
                            page-break-before: always;
                        }
                
                        @media print {
                
                            @page {                
                                size: A4;
                                margin: 0mm;
                            }
                
                            html, body, .row {
                                width: 1024px;
                            }
                
                            body {
                                margin: 0 auto;
                            }
                
                            .bg-blue {
                                background-color:	rgb(64, 159, 216) !important;
                            }
                
                            .bg-grey {
                                background-color: 	rgb(225, 221, 220) !important;
                            }
                
                            .table th {
                                background-color:	rgb(64, 159, 216) !important;
                                color: white !important;
                            }
                
                            tbody>tr:nth-child(odd)>td {
                                background-color: #d5edfd !important;
                            }
                
                            tbody>tr:nth-child(even)>td {
                                background-color: #ffffff !important;
                            }
                
                            .text-blue {
                                color: rgb(64, 159, 216) !important;
                            }
                
                            .text-white-custom {
                                color: white !important;
                            }
                
                            .test-background {
                                background-color: #f17150 !important;
                            }
                
                        }
                    </style>
                    <div class='container-fluid' style='margin-top: 20px'>
                        ${header}
                        ${table}
                        ${uldsTable}
                    </div>
                    <script>
                        setTimeout(() => {
                            window.print();
                        }, 1000);
                    </script>
                </body>
                </html>
        ` }}>
        </div>
    );
}
