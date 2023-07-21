import React, { useMemo } from 'react';
import moment from 'moment';
import { formatPercent, formatMawb } from '../../../utils';

export default function CreateBreakdownProgressByHawbReport({
    user,
    s_flight_id,
    stationInfo,
    dataMap,
}) {
    const header = useMemo(() => {
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
                            <h3 class='bold'>Breakdown by HAWB Report for ${s_flight_id} - ${user.s_unit}</h3>
                            <h6>Created by ${
                                user.displayName
                            } at ${moment().format('MM/DD HH:mm')}</h6>
                        </div>
                    </div>
                </div>
            `;
    }, [stationInfo, user, s_flight_id]);

    const table = useMemo(() => {
        return `
            <div class='row' style='margin-top: 40px; width: 1100px; margin-left: 10px;'>
                <div class='col-xs-12'>
                    <table class='table'>
                        <thead class='bg-blue'>
                            <tr style='text-align: center;'>
                                <th>MAWB</th>
                                <th>HAWB</th>
                                <th class='align-right'>Pieces</th>
                                <th>Breakdown Type</th>
                                <th class='align-right'>Pieces Broken Down</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${Object.keys(dataMap)
                            .map(
                                (key) =>
                                    `<tr>
                                    <td>
                                        <p class="mawb-paragraph">${formatMawb(
                                            key
                                        )}</p>
                                        <p>${
                                            dataMap[key].hawbs.length
                                        } HAWBs</p>
                                    </td>
                                    <td>
                                        <p class="mawb-paragraph">-</p>
                                        ${dataMap[key].hawbs
                                            .map(
                                                (hawb, i) =>
                                                    `<p>${hawb.s_hawb}</p>`
                                            )
                                            .join('')}
                                    </td>
                                    <td class='text-right'>
                                        <p class="mawb-paragraph">${
                                            dataMap[key].masterPcs
                                        }</p>
                                        ${dataMap[key].hawbs
                                            .map(
                                                (hawb, i) =>
                                                    `<p>${hawb.pcs}</p>`
                                            )
                                            .join('')}
                                    </td>
                                    <td class='text-center'>
                                        <p>${dataMap[key].breakdownType}</p>
                                    </td>
                                    <td class='text-right'>
                                        <p class="mawb-paragraph">${
                                            dataMap[key].masterBrokenDown
                                        }</p>
                                        ${dataMap[key].hawbs
                                            .map(
                                                (hawb, i) =>
                                                    `<p>${hawb.pcsBrokenDown}</p>`
                                            )
                                            .join('')}
                                    </td>
                                </tr>`
                            )
                            .join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }, [dataMap]);

    return (
        <div
            dangerouslySetInnerHTML={{
                __html: `
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

                        .bold {
                            font-weight: bold;
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

                            .mawb-paragraph {
                                font-weight: bold;
                                font-size: 18px;
                            }

                            .text-right {
                                text-align: right;
                            }
                
                        }
                    </style>
                    <div class='container-fluid' style='margin-top: 20px'>
                        ${header}
                        ${table}
                    </div>
                    <script>
                        setTimeout(() => {
                            window.print();
                        }, 1000);
                    </script>
                </body>
                </html>
        `,
            }}
        ></div>
    );
}
