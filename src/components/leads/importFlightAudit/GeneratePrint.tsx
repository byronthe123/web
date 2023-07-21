import React from 'react';
import moment from 'moment';
import { formatMawb, formatCost } from '../../../utils';
import { IUser } from '../../../globals/interfaces';
import { FlightAuditData, IFlightAuditData } from './interfaces';

interface Props {
    user: IUser;
    s_flight_id: string;
    totalInfo: string;
    flightAuditData: FlightAuditData;
}

export default function GenerateImportFlightManifest ({
    user,
    s_flight_id,
    totalInfo,
    flightAuditData
}: Props) {

    return (
        <div dangerouslySetInnerHTML={{__html: `
            <html>
                <head>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
                    <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
                    <!-- HTTP 1.1 -->
                    <meta http-equiv="Cache-Control" content="no-store"/>
                    <!-- HTTP 1.0 -->
                    <meta http-equiv="Pragma" content="no-cache"/>
                    <!-- Prevents caching at the Proxy Server -->
                    <meta http-equiv="Expires" content="0"/>
                </head>
                <body>
                    <style>
                        body {
                            border: 10px solid white;
                            font-size: 16px;
                            -webkit-print-color-adjust: exact !important;
                        }

                        tbody > tr:nth-child(even)>td {
                            background-color: #e2efd9 !important;
                        }

                        thead > tr:first-child>th { 
                            background-color: #c5e0b3 !important; 
                        }
                
                        .img-small {
                            width: '10px';
                            height: auto;
                        }

                        .content {
                            display:table;
                            table-layout:fixed;
                            padding-top:40px;
                            padding-bottom:40px;
                            width: 100%;
                            height: auto;
                        }

                        .header {
                            
                            position: fixed !important;
                            top: -15;
                        }

                        .align-right {
                            text-align: right;
                        }
                
                        @media print {

                            .content {
                                display:table;
                                table-layout:fixed;
                                padding-top:40px;
                                padding-bottom:40px;
                                width: 100%;
                                height: auto;
                            }
                
                            @page {                
                                size: A4;
                                @bottom-left {
                                    content: counter(page) ' of ' counter(pages);
                                }
                            }
                
                            html, body, .row {
                                width: 1024px;
                            }
                
                            body {
                                margin: 0 0;
                            }
                
                            .bold {
                                font-weight: bold;
                            }

                            .header {
                                position: fixed !important;
                            }

                            div{
                                page-break-inside: avoid;
                            }

                            .custom-bg {
                                background-color: #a8d08d !important;
                            }
                
                        }
                    </style>
                    <div class='container-fluid'>
                
                        <div class='row'>
                            <div class='col-xs-6' style='float: left;'>
                                <h5>IMPORT FLIGHT AUDIT</h5>
                                <h5>Flight ID: ${s_flight_id}</h5>  
                                <h5>${totalInfo}</h5> 
                            </div>
                            <div class='col-xs-6' style='float: right; text-align: right;'>
                                <img src='https://ewrstorage1.blob.core.windows.net/pics/choice-logo-small.png' />
                            </div>
                            <div class='col-xs-12'>
                                <h6 style='float: left;'>Generated by ${user.displayName} on ${moment().format('MM/DD/YYYY HH:mm:ss')}</h6>    
                            </div>
                        </div>
                        
                        <table class='table' style="width: 100%;"> 
                            <thead>
                                <tr>
                                    <th>MAWB</th>
                                    <th>PC/WGT</th>
                                    <th>Commodity</th>
                                    <th>ORI</th>
                                    <th>DES</th>
                                    <th class='align-right'>ISC</th>
                                    <th class='align-right'>Storage</th>
                                    <th class='align-right'>Total</th>
                                </tr>
                            </thead>    
                            <tbody>
                                ${
                                    flightAuditData.map((record: IFlightAuditData, i: number) => (
                                        `
                                            <tr>
                                                <td>${formatMawb(record.s_mawb)}</td>
                                                <td>${record.i_actual_piece_count}/${record.f_weight}</td>
                                                <td>${record.s_commodity}</td>
                                                <td>${record.s_origin}</td>
                                                <td>${record.s_destination}</td>
                                                <td class='align-right'>${formatCost(record.isc)}</td>
                                                <td class='align-right'>${formatCost(record.storage)}</td>
                                                <td class='align-right'>${formatCost(record.total)}</td>
                                            </tr>
                                        `
                                    )).join('')
                                }
                            </tbody>
                        </table>

                        <div style='position: fixed; bottom: -5; text-align: center'>
                            <h6>GENERATED IN EOS: ${s_flight_id}</h6>
                        </div>
                    </div>

                    <script>
                        setTimeout(() => {
                            window.print();
                        }, 1000);
                    </script>
                    <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
                </body>
            </html> 
        `}}></div>
    );
}