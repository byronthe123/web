import React from 'react';
import { formatCost, formatEmail } from '../../../utils';
import dayJs from 'dayjs';

export default function PaymentReceipt ({
    selectedAwb,
    s_hawb,
    user,
    isc,
    totalStorage,
    storageDescription,
    totalCharges,
    credits,
    totalPaid,
    balanceDue,
    payments,
    stationInfo,
    hmCharge
}) {

    const now = dayJs().format('MM/DD/YYYY hh:mm A');

    return (
        <div dangerouslySetInnerHTML={{__html: `
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
                            color: black !important;
                            font-weight: bold;
                        }
                
                        .align-right {
                            text-align: right;
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
                                font-weight: bold;
                            }
                
                            .test-background {
                                background-color: #f17150 !important;
                            }
                
                            .rectangle {
                                width: 250px;
                                background-color: rgb(64, 159, 216) !important;
                                border-radius: 1.75px;
                                left: 770;
                            }
                
                        }
                    </style>
                    <div class='container-fluid' style='margin-top: 20px'>
                        <div class="rectangle" style="height: 50px; position: fixed; top: 230;"></div>
                        <div class="rectangle" style="height: 40px; position: fixed; top: 290;"></div>                        
                        <div class='row'>
                            <div class='col-xs-4' style='padding-left: 40px;'>
                                <img src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.logo.01.png' style='width: 300px; height: auto' />
                            </div>
                            <div class='col-xs-2' style='height: 175px;'>
                                <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.add.01.png' />
                                <h6>${stationInfo.s_address}</h6>
                            </div>
                            <div class='col-xs-2'>
                                <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.phone.01.png' />
                                <h6>${stationInfo.s_phone}</h6>
                            </div>
                            <div class='col-xs-2'>
                                <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.email.01.png' />
                                <h6>${stationInfo.distributionEmail}</h6>
                            </div>
                            <div class='col-xs-2'>
                                <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.web.01.png' />
                                <h6>www.choice.aero</h6>
                            </div>
                        </div>
                        <div class='row' style='margin-left: 20px;'>
                            <div class='col-xs-8 text-right'>
                                <h1>Payment Receipt for MAWB</h1>
                                <h2>HAWB</h2>
                            </div>
                            <div class='col-xs-4 text-right' style='border-radius: 0.75px; padding-right: 70px;' >
                                <h1 class='text-white-custom'>${selectedAwb.s_mawb}</h1>
                                <h2 class='text-white-custom'>${(s_hawb || '').toUpperCase()}</h2>
                            </div>
                        </div>
                        <div class='row' style='margin-top: 40px; margin-left: 20px; margin-right: 100px;'>
                            <div class='col-xs-12' style='padding-right: 60px;'>
                                <table class='table'>
                                    <thead class='bg-blue'>
                                        <tr style='text-align: center;'>
                                            <th width='175px'>Created</th>
                                            <th>Method</th>
                                            <th width='350px'>Type</th>
                                            <th width='175px'>By</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>${now}</td>
                                            <td>CHARGE</td>
                                            <td>ISC</td>
                                            <td>${user.displayName}</td>
                                            <td>${formatCost(isc)}</td>
                                        </tr>
                                        ${
                                            hmCharge.getAmount() > 0 ? 
                                            `
                                                <tr>
                                                    <td>${now}</td>
                                                    <td>CHARGE</td>
                                                    <td>HM</td>
                                                    <td>${user.displayName}</td>
                                                    <td>${formatCost(hmCharge.getAmount())}</td>
                                                </tr>
                                            ` : ''
                                        }
                                        ${
                                            storageDescription.length > 0 ? 
                                            `<tr>
                                                <td>${now}</td>
                                                <td>CHARGE</td>
                                                <td>${storageDescription}</td>
                                                <td>${user.displayName}</td>
                                                <td>${formatCost(totalStorage, true)}</td>
                                            </tr>` : ''
                                        }
                                        ${
                                            payments.map(p => p.selected ? (
                                                `<tr>
                                                    <td>${dayJs(p.t_created).format('MM/DD/YYYY hh:mm A')}</td>
                                                    <td>${p.s_payment_method}</td>
                                                    <td>${p.s_payment_type}</td>
                                                    <td>${formatEmail(p.s_created_by)}</td>
                                                    <td>${formatCost(p.f_amount, true)}</td>
                                                </tr>`
                                            ) : '').join('')
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>  
                        <div class='row' style='margin-left: 20px; margin-right: 100px; text-align: right;'>
                            <div class='col-xs-8'></div>
                            <div class='col-xs-4' style='padding-right: 60px;'>
                                <table class='table'>
                                    <thead></thead>
                                    <tbody>
                                        <tr class='bg-grey'>
                                            <td>Total Charges</td>
                                            <td style='text-align: right;'>${formatCost(totalCharges)}</td>
                                        </tr>
                                        <tr class='bg-grey'>
                                            <td>Total Credits</td>
                                            <td style='text-align: right;'>${formatCost(credits, true)}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Paid</td>
                                            <td style='text-align: right;'>${formatCost(totalPaid, true)}</td>
                                        </tr>
                                        <tr>
                                            <td>Payment Due</td>
                                            <td style='text-align: right;'>${formatCost(balanceDue)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div style='position: fixed; bottom: 10; text-align: center'>
                            <h6>EOS Payment Receipt: Requested by ${user.displayName} on ${now}</h6>
                        </div>      
                    </div>
                    <script>
                        setTimeout(() => {
                            window.print();
                        }, 1000);
                    </script>
                </body>
                </html>
        `}}></div>
    );
}   