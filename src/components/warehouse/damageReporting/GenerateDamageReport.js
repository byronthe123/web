import React from 'react';
import moment from 'moment';
import { formatDatetime } from '../../../utils';

const GenerateDamageReport = ({
    userStation,
    damageReportItem,
    damageReportItemsArray
}) => {

    console.log(damageReportItem);
    console.log(damageReportItemsArray);

    return (
            <div dangerouslySetInnerHTML={{__html: damageReportItem && `
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
                        <div class='container-fluid' style='margin-top: 20px; '>
                            <div class='row'>
                                <div class='col-xs-4' style='padding-left: 0px;'>
                                    <img src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.logo.01.png' style='width: 300px; height: auto' />
                                </div>
                                <div class='col-xs-2'>
                                    <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.add.01.png' />
                                    <h6>${userStation.s_address}</h6>
                                </div>
                                <div class='col-xs-2'>
                                    <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.phone.01.png' />
                                    <h6>${userStation.s_phone}</h6>
                                </div>
                                <div class='col-xs-2'>
                                    <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.email.01.png' />
                                    <h6></h6>
                                </div>
                                <div class='col-xs-2'>
                                    <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.web.01.png' />
                                    <h6>www.choice.aero</h6>
                                </div>
                            </div>
                            <div class='row'>
                                <div class='col-xs-1'>
                                    <div class='row'>
                                        <h3 style='font-weight: bold;'>Damage Report</h3>
                                    </div>
                                    <div class='row'>
                                        <p>Created by:<p>
                                    </div>
                                    <div class='row'>
                                        <h3 style='font-weight: bold; margin-top: 0'>${damageReportItem.full_name}</h3>
                                    </div>
                                    <div class='row'>
                                        <p>
                                            Date Reported: ${formatDatetime(damageReportItem.time_submitted)}
                                        </p>
                                        <p>
                                            Description: ${damageReportItem.comments}
                                        </p>
                                    </div>
                                </div>
                                <div class='col-xs-11 text-right'>
                                    <div class='row'>
                                        <h1 style='margin-right: 20px'> 
                                            <span class='bg-blue text-white-custom' style='font-size: 75px;'>${damageReportItem.awb_uld}</span>
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div class='row' style='margin-top: 20px; width: 1100px;'>
                                <div class='col-xs-12'>
                                    <p class='bg-blue text-white-custom' style='font-size: 24px; color: white; font-weight: bold;'>Photos</p>
                                </div>
                            </div>
                            <div class='row' style='width: 1100px;'>
                                ${
                                    damageReportItemsArray.map(i => ` 
                                            <div class='col-xs-4' style='text-align: center; padding-bottom: 10px;'>
                                                <img src=${i.reducedUrl} style='height: 335px; width: auto'/>
                                            </div>
                                        `
                                    ).join(' ')
                                }
                            </div>
                            <div class='row' style='width: 1100px; position: fixed; bottom: 45;'>
                                <div class="col-xs-12">
                                    <img src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.footer.01.png' style='object-fit: fill;' />
                                </div>
                                <div class="col-xs-4">
                                    <p>Created on ${moment().format('MM/DD/YYYY HH:mm:ss')}</p>
                                </div>
                                <div class="col-xs-8" style='text-align: right; padding-right: 100px;'>
                                    <img src='https://ewrstorage1.blob.core.windows.net/pics/eos-logo-1.png' style='height: 50px; width: auto; position: absolute; top: -40px; right: 100px;'  />
                                </div>
                            </div>
                        </div>
                        <script>
                            setTimeout(() => {
                                window.print();
                            }, 1000);
                        </script>
                    </body>
                </html>
            `}}>
        </div>
    );
}

export default GenerateDamageReport;