import React, { useMemo } from 'react';
import moment from 'moment';
import { formatMawb } from '../../utils';
import columns from './manifestColumns';
import renderRow from './renderRow';
import _ from 'lodash';

const widths = {
    'AWB': 155,
    'Pieces': 100,
    'Weight': 100,
    'Volume': 100,
    'Routing': 100,
    'Commodity': 160,
    'SHC': 160,
    'Consignee': 200
}

const resolveTd = (awb, c) => {
    let val;

    if (c.value === 's_mawb') {
        val = formatMawb(awb[c.value]);
    } else if (c.name === 'Routing') {
        val = `${awb.s_origin}/${awb.s_destination}`;
    } else if (c.value === 'f_weight') {
        val = awb[c.value].toFixed(1);
    } else if (c.name === 'Pieces') {
        if (awb.s_pieces_type === 'TOTAL_CONSIGNMENT') {
            val = awb.i_actual_piece_count;
        } else {
            val = `${awb.i_actual_piece_count}/${awb.i_pieces_total}`
        }
    } else if (c.value === 's_consignee') {
        const base = _.get(awb, 's_consignee', '');
        val = base && base.length > 0 ? 
                base.length > 12 ?
                    `${base.substr(0, 10)}...` : 
                    base :
            '';
    } else {
        val = awb[c.value] || '';
    }

    return `<td style='text-align: right'>${val}</td>`;
}

const renderTable = (dataMap, key, printConsignee) => {
    return (`
        <div class='row custom-bg' style='margin-top: 5px; width: 994px; margin-left: 2px;'>
            <div class='col-xs-2' style='font-size: 18px;'>
                ${key}
            </div>
            <div class='col-xs-6' style='margin-left: 15px'>
                <span>
                    ${dataMap[key].totalPieces} Pieces, 
                    ${dataMap[key].totalWeight.toFixed(1)} KG,
                    Volume ${dataMap[key].totalVolume.toFixed(2)} 
                </span>
            </div>
        </div>
        <div class='row' style='margin-top: 0px;'>
            <div class='col-xs-12'>
                <table class='table' style="width: 100%;"> 
                    <thead>
                        <tr>
                            ${
                                columns.map(c => renderRow(printConsignee, c.name) && (
                                    `<th 
                                        style='width: ${widths[c.name] || ''}px; text-align: ${c.name === 'AWB' ? 'left' : 'right'};'
                                    >
                                        ${c.name}
                                    </th>`
                                )).join('')
                            }
                        </tr>
                    </thead>    
                    <tbody>
                        ${
                            dataMap[key].awbs.map(awb => (
                                `<tr>
                                    ${
                                        columns.map(c => renderRow(printConsignee, c.name) && (
                                            resolveTd(awb, c)
                                        )).join('')
                                    }
                                </tr>`
                            )).join('')
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `);
}


export default function GenerateImportFlightManifest ({
    user,
    dataMap,
    s_flight_id,
    d_arrival_date,
    s_pol,
    printConsignee,
    totalPcs, 
    totalWgt, 
    totalVol,
    totalAwbs
}) {

    const flightInfo = useMemo(() => {
        const parts = s_flight_id.split('/');
        const info = `${parts[0].substr(0, 2)} ${parts[0].substr(2)}`;
        return `Flight ${info} ${moment(d_arrival_date).format('DD-MMM-YYYY')}`;
    }, [s_flight_id]);

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
                                <h5>IMPORT FLIGHT MANIFEST</h5>
                                <h5>${flightInfo}</h5>  
                                <h5>AWB-${totalAwbs}/PC-${totalPcs}/WGT-${totalWgt}/VOL-${totalVol}</h5> 
                            </div>
                            <div class='col-xs-6' style='float: right; text-align: right;'>
                                <img src='https://ewrstorage1.blob.core.windows.net/pics/choice-logo-small.png' />
                            </div>
                            <div class='col-xs-12'>
                                <h6 style='float: left;'>Generated by ${user.displayName} on ${moment().format('MM/DD/YYYY HH:mm:ss')}</h6>    
                                <h6 style='float: right;'>Point of Loading: ${s_pol}</h6> 
                            </div>
                        </div>

                        ${
                            Object.keys(dataMap).map(key => (
                                renderTable(dataMap, key, printConsignee)
                            )).join('').replace(/false/g, '')
                        }

                        <div style='position: fixed; bottom: -5; text-align: center'>
                            <h6>GENERATED IN EOS: ${flightInfo.toUpperCase()}</h6>
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