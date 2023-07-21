import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { formatPercent } from '../../../utils';

export default function CreateReport ({
    readingSignRecord,
    assigned,
    numAck,
    stationInfo,
    creatorName
}) {

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
                            background-color: #c9c2c0;
                        }
                
                        tbody tr:nth-child(even){
                            background-color: #e1dddc;
                        }
                
                        .table th {
                            background-color:	rgb(64, 159, 216) !important;
                            color: white !important;
                        }

                        td { 
                            padding: 10px;
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
                                background-color: #c9c2c0 !important;
                            }
                
                            tbody>tr:nth-child(even)>td {
                                background-color: #e1dddc !important;
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
                        <div class='row'>
                            <div class='col-xs-4' style='padding-left: 40px;'>
                                <img src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.logo.01.png' style='width: 300px; height: auto' />
                            </div>
                            <div class='col-xs-2'>
                                <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.add.01.png' />
                                <h6>${stationInfo.s_address || ''}</h6>
                            </div>
                            <div class='col-xs-2'>
                                <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.phone.01.png' />
                                <h6>${stationInfo.s_phone || ''}</h6>
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
                
                        <div class='row' style='margin-left: 20px'>
                            <div class='col-xs-12'>
                                <h1>Read and Sign</h1>
                                <h3>${readingSignRecord.title} (Reference ${readingSignRecord.reference || '#'}) created by ${creatorName} at ${moment(readingSignRecord.createdAt).format('MM/DD/YYYY HH:mm:ss')}</h3>
                                <h3>${numAck}/${assigned.length} Acknowledged (${formatPercent(numAck/assigned.length)})</h3>
                            </div>
                        </div>
                
                        <div class='row' style='margin-left: 20px; margin-top: 20px;'>
                            <div class='col-xs-12'>
                                <table style="width: 92%;"> 
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Acknowledged</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${assigned.map(assigned => (
                                            `
                                                <tr style='margin-top: 2px;'>
                                                    <td>${assigned.fullName}</td>
                                                    <td>${assigned.acknowledged ? 'YES' : 'NO'}</td>
                                                    <td>${assigned.acknowledged ? moment(assigned.updatedAt).format('MM/DD/YYY HH:mm') : ''}</td>
                                                </tr>
                                            `
                                        )).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                    </div>
                    <script>
                        // setTimeout(() => {
                        //     window.print();
                        // }, 1000);
                    </script>
                </body>
                </html> 
        ` }}></div>
    );
}