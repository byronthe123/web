import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { IUser } from '../../../globals/interfaces';
import { IAirline, IExtendedULD } from './interfaces';

interface Props {
    user: IUser;
    selectedFlight: IAirline | undefined;
    ulds: Array<IExtendedULD>;
    singleUld: boolean;
    selectedUld: IExtendedULD | undefined;
}

export default function GenerateBreakdownSheet ({
    user,
    selectedFlight,
    ulds,
    singleUld,
    selectedUld
}: Props) {

    const table = `
        <div class='col-xs-4'>
            <table class='table' style="width: 96%;"> 
                <thead>
                    <tr style="height: 40px;">
                        <th></th>
                        <th></th>
                    </tr>
                </thead>    
                <tbody>
                    <tr style="height: 40px;">
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    const uldHeading = (uld: IExtendedULD) => `
        <div class='row page-break' style='margin-top: 10px;'>
            <div class='col-xs-6'>
                <h4 class='bold'>${uld.s_uld}</h4>
            </div>
        </div>

        <div class='row' style='margin-top: 5px;'>
            <div class='col-xs-2'>AWB</div>
            <div class='col-xs-1'>Pieces</div>
            <div class='col-xs-1'>Weight</div>
            <div class='col-xs-2'>Commodity</div>
            <div class='col-xs-2'>Routing</div>
            <div class='col-xs-4'>SHC</div>
        </div>    
    `;

    const renderTableRow = (hawb=false) => {
        return (`
            <div class='row' style='margin-top: ${hawb ? '0' : '5'}px;'>
                ${[...Array(3)].map(i => 
                    table    
                ).join('')}
            </div>
        `);
    }

    const renderAwbs = (uld: IExtendedULD) => {
        return (
            uld.awbs.map(awb => (`
                <div class='row' style='margin-top: 15px;'>
                    <div class='col-xs-2'>${awb.s_mawb}</div>
                    <div class='col-xs-1'>${awb.i_actual_piece_count}</div>
                    <div class='col-xs-1'>${awb.f_weight}</div>
                    <div class='col-xs-2'>${awb.s_commodity}</div>
                    <div class='col-xs-2'>${awb.s_origin}-${awb.s_destination}</div>
                    <div class='col-xs-4' style='max-width: '>
                        ${(awb.s_special_handling_code || '').substr(0, 23)}
                    </div>
                </div>
                <div class='row' style='margin-top: 7.5px;'>
                    <div class='col-xs-12'>
                        Notes: ${awb.s_notes ? awb.s_notes : '' }
                    </div>
                </div>
                ${
                    (!awb.b_breakdown_hawb || _.get(awb, 'hawbs', []).length === 0) ?
                        renderTableRow() : 
                        awb.b_breakdown_hawb && _.get(awb, 'hawbs', []).map(hawb => (`
                            <div class='row' style='margin-top: 0px; padding-top: 0px; margin-bottom: 0px; padding-bottom: 0px;'>
                                <div class='col-xs-3'>HAWB ${hawb.s_hawb}</div>
                                <div class='col-xs-1'>${hawb.i_pieces}</div>
                                <div class='col-xs-1'>${hawb.f_weight}</div>
                                <div class='col-xs-2'>${hawb.s_nature_of_goods}</div>
                            </div>
                            ${renderTableRow(true)}            
                    `)).join('')
                }
            `)).join('')
        );
    }

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
                            border: 20px solid white;
                            font-size: 20px;
                            -webkit-print-color-adjust: exact !important;
                        }

                        .container-fluid {
                            page-break-inside: avoid;
                        }
                
                        .table th {
                            background-color:grey;
                            border: 1px solid black;
                        }
                
                        .table tr {
                            border: 1px solid black;
                        }
                
                        .table td {
                            border: 1px solid black;
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

                        @page {                
                            @bottom-left {
                                content: counter(page);
                            }
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

                            div {
                                page-break-inside: avoid;
                            }

                            .pagebreak {
                                page-break-before: always;
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
                                margin: 0 auto;
                            }
                
                            .table th {
                                background-color:grey !important;
                                border: 1px solid black;
                            }
                
                            .table tr {
                                border: 1px solid black;
                            }
                
                            .table td {
                                border: 1px solid black;
                            }
                
                            .bold {
                                font-weight: bold;
                            }

                            .header {
                                position: fixed !important;
                            }
                
                        }
                    </style>
                    <div class='container-fluid'>
                
                        <div class='row'>
                            <div class='col-xs-6'>
                                <h2>Breakdown Instructions</h2>
                                <h4>Generated by ${user.displayName} on ${moment().format('MM/DD/YYYY HH:mm:ss')}</h4>    
                            </div>
                            <div class='col-xs-6'>
                                <h2>Flight: ${selectedFlight && selectedFlight.s_flight_id}</h2>    
                            </div>
                        </div>

                        ${
                            (singleUld && selectedUld) ? 
                                `
                                    ${uldHeading(selectedUld)}
                                    ${renderAwbs(selectedUld)}
                                `
                                :
                                ulds.map((uld, i) => (
                                    `
                                        ${uldHeading(uld)}
                                        ${renderAwbs(uld)}
                                        ${(i !== ulds.length - 1) && 
                                            `<div class="pagebreak"> </div>`
                                        }
                                    `
                                )).join('')
                        } 

                        <div style='position: fixed; bottom: -10; text-align: right'>
                            <h5>Flight: ${selectedFlight && selectedFlight.s_flight_id} <span style='margin-left: 75px;'>Broken Down By:</span><span style='margin-left: 400px;'>EOS locations matches: &#9634;</span></h5>
                        </div>
                    </div>

                    <script>
                        // setTimeout(() => {
                        //     window.print();
                        // }, 1000);
                    </script>
                </body>
            </html> 
        `}}></div>
    );
}