import React from 'react';
import { formatCost, formatEmail, formatDatetime } from '../../../utils';
import dayJs from 'dayjs';

export default function RejectionNotice ({
    selectedAwb,
    user,
    s_driver_company,
    s_driver_name,
    t_kiosk_submittedtime,
    t_counter_start_time,
    s_counter_assigned_agent,
    t_counter_reject_time,
    s_counter_reject_reason,
    f_charge_isc,
    f_charge_storage,
    f_charge_others,
    f_charges_total,
    f_paid_online,
    f_paid_cash,
    f_paid_check,
    f_paid_total,
    f_balance_offset,
    i_pieces,
    f_weight,
    d_last_arrival_date,
    stationInfo,
    s_notes
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
                            color: white !important;
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
                                <h1>Rejection Notice for MAWB</h1>
                                <h2>HAWB</h2>
                            </div>
                            <div class='col-xs-4 text-white-customs text-right' style='border-radius: 0.75px; padding-right: 70px;' >
                                <h1 class='text-white-custom'>${selectedAwb.s_mawb}</h1>
                                <h2 class='text-white-custom'>${selectedAwb.s_hawb || ''}</h2>
                            </div>
                            <div class='col-xs-12 text-right' style='padding-right: 70px; margin-top: 0; padding-top: 0;'>
                                <h2 style='margin-top: 0; padding-top: 0;'>Reason - ${s_counter_reject_reason}</h2>
                            </div>
                        </div>
                        <div class='row' style='margin-top: 20px; margin-left: 20px; margin-right: 0px;'>
                            <div class='col-xs-12' style='padding-right: 60px;'>
                                <h4>Company: ${s_driver_company}</h4>
                                <h4>Customer: ${s_driver_name}</h4>
                            </div>
                            <div class='col-xs-12' style='padding-right: 60px;'>
                                <table class='table'>
                                    <thead class='bg-blue'>
                                        <tr>
                                            <th colspan="2">Customer Timeline</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Kiosk Time</td>
                                            <td>${formatDatetime(t_kiosk_submittedtime)}</td>
                                        </tr>
                                        <tr>
                                            <td>Office Process Time</td>
                                            <td>${formatDatetime(t_counter_start_time)}</td>
                                        </tr>
                                        <tr>
                                            <td>Office Process Agent</td>
                                            <td>${formatEmail(s_counter_assigned_agent)}</td>
                                        </tr>
                                        <tr>
                                            <td>Rejected Time</td>
                                            <td>${formatDatetime(t_counter_reject_time)}</td>
                                        </tr>
                                        <tr>
                                            <td>Notes</td>
                                            <td>${s_notes || ''}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class='col-xs-6'>
                                <table class='table'>
                                    <thead class='bg-blue'>
                                        <tr>
                                            <th colspan="2">Charges and Payments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>ISC Charged</td>
                                            <td>${formatCost(f_charge_isc)}</td>
                                        </tr>
                                        <tr>
                                            <td>Storage Charged</td>
                                            <td>${formatCost(f_charge_storage)}</td>
                                        </tr>
                                        <tr>
                                            <td>Other Charged</td>
                                            <td>${formatCost(f_charge_others)}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Charges</td>
                                            <td>${formatCost(f_charges_total)}</td>
                                        </tr>
                                        <tr>
                                            <td>Online Payment</td>
                                            <td>${formatCost(f_paid_online)}</td>
                                        </tr>
                                        <tr>
                                            <td>Cash Payment</td>
                                            <td>${formatCost(f_paid_cash)}</td>
                                        </tr>
                                        <tr>
                                            <td>Check Payment</td>
                                            <td>${formatCost(f_paid_check)}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Payment</td>
                                            <td>${formatCost(f_paid_total)}</td>
                                        </tr>
                                        <tr>
                                            <td>Override</td>
                                            <td>${formatCost(f_balance_offset)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class='col-xs-6' style='padding-right: 60px;'>
                                <table class='table'>
                                    <thead class='bg-blue'>
                                        <tr>
                                            <th colspan="2">Order Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Pieces</td>
                                            <td>${i_pieces || ''}</td>
                                        </tr>
                                        <tr>
                                            <td>Weight</td>
                                            <td>${f_weight ? `${f_weight} KG` : ''}</td>
                                        </tr>
                                        <tr>
                                            <td>Last Arrival Date</td>
                                            <td>${d_last_arrival_date ? dayJs(d_last_arrival_date).format('MM/DD/YYYY') : ''}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>  
                        <div style='position: fixed; bottom: 10; text-align: center'>
                            <h6>EOS Rejection Letter: Requested by ${user.displayName} on ${now}</h6>
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