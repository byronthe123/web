import React from 'react';
import moment from 'moment';
import { formatMawb } from '../../../utils';
import { screenDg } from './dgScreening';

const parseNull = (val) => val || '';

const CreateAcceptanceSheet = ({
    b_dg,
    b_screened,
    s_mawb,
    i_pieces,
    i_weight,
    s_transport_type,
    s_airline_code,
    s_flight_number,
    s_airline,
    t_depart_date,
    s_origin,
    s_destination,
    s_port_of_unlading,
    s_commodity,
    s_iac,
    s_ccsf,
    s_shc1,
    s_shc2,
    s_shc3,
    s_shc4,
    s_shc5,
    s_company_driver_name,
    s_company,
    s_company_driver_id_type_1,
    s_company_driver_id_num_1,
    d_company_driver_id_expiration_1,
    b_company_driver_photo_match_1,
    s_company_driver_id_type_2,
    s_company_driver_id_num_2,
    d_company_driver_id_expiration_2,
    b_company_driver_photo_match_2,
    s_kiosk_submitted_agent,
    getProcessAgentName,
    agentName,
    user,
    t_created,
    b_interline_transfer,
    s_interline_transfer,
    s_logo,
    shcs,
}) => {
    const resolveShc = (data) => {
        console.log(data);
        const output = [];
        for (let i = 1; i <= 5; i++) {
            const field = `s_shc${i}`;
            if (data[field]) {
                output.push(data[field]);
            }
        }
        return output.join(',');
    };

    const { dg, mustScreen } = screenDg(shcs, { s_shc1, s_shc2, s_shc3, s_shc4, s_shc5 }, s_ccsf);

    return (
        <div
            dangerouslySetInnerHTML={{
                __html: `
                <html>
                <head>
                    <!-- HTTP 1.1 -->
                    <meta http-equiv="Cache-Control" content="no-store" />
                    <!-- HTTP 1.0 -->
                    <meta http-equiv="Pragma" content="no-cache" />
                    <!-- Prevents caching at the Proxy Server -->
                    <meta http-equiv="Expires" content="0" />
                </head>
                <body>
                    <style>
                        body {
                            -webkit-print-color-adjust: exact !important;
                            font-family: Arial, Helvetica, sans-serif;
                        }
            
                        .full-width-div {
                            width: 100%;
                        }
            
                        .table {
                            width: 100%;
                        }
            
                        .table th {
                            background-color: #f2f2f2;
                        }
            
                        .table tbody > tr:nth-child(even) > td {
                            background-color: #c7c5c5;
                        }
            
                        .table tr {
                            background-color: #f2f2f2;
                        }

                        .table td {
                            padding: 7px 7px;
                        }
            
                        .img-small {
                            width: 200px;
                            height: auto;
                            display: block;
                        }
            
                        .section {
                            margin-top: 20px; 
                        }
            
                        .section-flex {
                            display: flex; 
                            margin-top: 20px; 
                            justify-content: space-between;
                        }
            
                        .section-flex-alt {
                            display: flex; 
                            justify-content: space-between;
                        }
            
                        .square {
                            border-radius: 15px;
                            width: 100px;
                            height: 100px;
                            min-width: 100px;
                            background-color: #c7c5c5;
                        }
            
                        .square-sub {
                            padding-left: 10px;
                        }
            
                        .square-main {
                            margin-top: -20px;
                            margin-left: 30px;
                        }
            
                        .subtitle {
                            margin: 0 0 5 0;
                            font-style: italic;
                        }
            
                        .text {
                            margin: 0;
                        }
            
                        .division {
                            background-color: black;
                            height: 3px;
                            margin-bottom: 15px;
                        }
                        
                        .checkbox {
                            border: 2px solid black; 
                            height: 15px; 
                            width: 25px;
                        }
            
                        .warehouse-tr {
                            height: 35px;
                        }
            
                        @media print {
                            div {
                                page-break-inside: avoid;
                            }
            
                            .pagebreak {
                                page-break-before: always;
                            }
            
                            @page {
                                size: A4;
                            }
            
                            html,
                            body,
                            .row {
                                width: 1024px;
                            }
            
                            .table th {
                                background-color: rgb(172, 169, 169) !important;
                            }
            
                            .table tr {
                                background-color: #f2f2f2;
                            }
            
                            .bold {
                                font-weight: bold;
                            }
                        }
                    </style>
                    <div class="section-flex">
                        <div>
                            <img
                                src="https://ewrstorage1.blob.core.windows.net/pics/choice-logo.png"
                                class="img-small"
                            />
                            <img
                                src="${s_logo}"
                                class="img-small"
                            />
                        </div>
                        <div style="text-align: center;">
                            <h1>EXPORT</h1>
                            <h1>Acceptance</h1>
                        </div>
                        <div>
                            <h1 style="margin-bottom: 5px; font-size: 60px">${formatMawb(s_mawb)}</h1>
                        </div>
                    </div>
                    <div class="section-flex">
                        <div class="square">
                            <h6 class="square-sub">DG</h6>
                            <h1 class="square-main">${dg ? 'YES' : 'NO'}</h1>
                        </div>
                        <div class="square">
                            <h6 class="square-sub">Must Screen</h6>
                            <h1 class="square-main">${
                                mustScreen ? 'YES' : 'NO'
                            }</h1>
                        </div>
                        <div class="square">
                            <h6 class="square-sub">CCSF</h6>
                            <h1 class="square-main">${
                                b_screened ? 'YES' : 'NO'
                            }</h1>
                        </div>
                        <div class="square">
                            <h6 class="square-sub">Transport</h6>
                            <h1 class="square-main">${s_transport_type}</h1>
                        </div>
                        <div class="square">
                            <h6 class="square-sub">Interline</h6>
                            <h1 class="square-main">${
                                b_interline_transfer ? 'YES' : 'NO'
                            }</h1>
                        </div>
                        <div class="square">
                            <h6 class="square-sub">DOOR</h6>
                            <h1 class="square-main"></h1>
                        </div>
                    </div>
                    <div class="section-flex" style="gap: 20px;">
                        <div class="full-width-div">
                            <table class="table">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>Pieces</td>
                                        <td>${i_pieces}</td>
                                    </tr>
                                    <tr>
                                        <td>Weight</td>
                                        <td>${i_weight}</td>
                                    </tr>
                                    <tr>
                                        <td>Commodity</td>
                                        <td>${
                                            s_commodity &&
                                            s_commodity.toUpperCase()
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>SHC</td>
                                        <td>${resolveShc({
                                            s_shc1,
                                            s_shc2,
                                            s_shc3,
                                            s_shc4,
                                            s_shc5,
                                        })}</td>
                                    </tr>
                                    <tr>
                                        <td>Origin</td>
                                        <td>${
                                            s_origin && s_origin.toUpperCase()
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>Port of Unloading</td>
                                        <td>${parseNull(
                                            s_port_of_unlading
                                        ).toUpperCase()}</td>
                                    </tr>
                                    <tr>
                                        <td>Destination</td>
                                        <td>${parseNull(
                                            s_destination
                                        ).toUpperCase()}</td>
                                    </tr>
                                    <tr>
                                        <td>Airline</td>
                                        <td>${s_airline}</td>
                                    </tr>
                                    <tr>
                                        <td>Flight</td>
                                        <td>${s_airline_code} ${s_flight_number}</td>
                                    </tr>
                                    <tr>
                                        <td>Flight Date</td>
                                        <td>${moment(t_depart_date).format(
                                            'YYYY-MM-DD'
                                        )}</td>
                                    </tr>
                                    <tr>
                                        <td>IAC</td>
                                        <td>${parseNull(s_iac)}</td>
                                    </tr>
                                    <tr>
                                        <td>CCSF</td>
                                        <td>${parseNull(s_ccsf)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="full-width-div">
                            <table class="table">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>Driver Name</td>
                                        <td>${
                                            s_company_driver_name &&
                                            s_company_driver_name.toUpperCase()
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>Trucking Company</td>
                                        <td>${
                                            s_company && s_company.toUpperCase()
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>ID 1 Type</td>
                                        <td>${
                                            s_company_driver_id_type_1 &&
                                            s_company_driver_id_type_1.toUpperCase()
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>ID 1 Number</td>
                                        <td>${
                                            s_company_driver_id_num_1 &&
                                            s_company_driver_id_num_1.toUpperCase()
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>ID 1 Expiration</td>
                                        <td>${
                                            d_company_driver_id_expiration_1 !==
                                            ''
                                                ? moment(
                                                      d_company_driver_id_expiration_1
                                                  ).format('MM/DD/YYYY')
                                                : 'N/A'
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>Photo Match</td>
                                        <td>${
                                            b_company_driver_photo_match_1
                                                ? 'YES'
                                                : 'NO'
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>ID 2 Type</td>
                                        <td>${
                                            s_company_driver_id_type_2 !== null
                                                ? s_company_driver_id_type_2.toUpperCase()
                                                : 'N/A'
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>ID 2 Number</td>
                                        <td>${
                                            s_company_driver_id_num_2 !== null
                                                ? s_company_driver_id_num_2.toUpperCase()
                                                : 'N/A'
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>ID 2 Expiration</td>
                                        <td>${
                                            d_company_driver_id_expiration_2 &&
                                            d_company_driver_id_expiration_2 !==
                                                ''
                                                ? moment(
                                                      d_company_driver_id_expiration_2
                                                  ).format('MM/DD/YYYY')
                                                : 'N/A'
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>Photo Match</td>
                                        <td>${
                                            b_company_driver_photo_match_2
                                                ? 'YES'
                                                : 'N/A'
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>Acceptance agent:</td>
                                        <td>${
                                            getProcessAgentName
                                                ? agentName.toUpperCase()
                                                : user &&
                                                  user.displayName.toUpperCase()
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>Acceptance Time:</td>
                                        <td>${moment
                                            .utc(t_created)
                                            .format('YYYY-MM-DD HH:mm:00')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="section">
                        <h6 class="subtitle">WAREHOUSE</h6>
                        <div class="division"></div>
                        <p class="text">___ pieces with a weight of ______ received in the warehouse by __________________ at __________________</p>
                        <div class="section-flex" style="gap: 20px;">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>PCS</th>
                                        <th>Length</th>
                                        <th>Width</th>
                                        <th>Height</th>
                                        <th>KG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>PCS</th>
                                        <th>Length</th>
                                        <th>Width</th>
                                        <th>Height</th>
                                        <th>KG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>PCS</th>
                                        <th>Length</th>
                                        <th>Width</th>
                                        <th>Height</th>
                                        <th>KG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr class="warehouse-tr">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="section">
                        <h6 class="subtitle">SCREENING</h6>
                        <div class="division"></div>
                        <p class="text">___ pieces screened by __________________ at __________________</p>
                        <div class="section-flex">
                            <div style="max-width: 250px; display: flex; gap: 20px; flex-wrap: wrap;">
                                <div class="square">
                                    <h6 class="square-sub">Physical</h6>
                                    <h1 class="square-main"></h1>
                                </div>
                                <div class="square">
                                    <h6 class="square-sub">X-RAY</h6>
                                    <h1 class="square-main"></h1>
                                </div>
                                <div class="square">
                                    <h6 class="square-sub">ETD</h6>
                                    <h1 class="square-main"></h1>
                                </div>
                                <div class="square">
                                    <h6 class="square-sub">TSA K-9</h6>
                                    <h1 class="square-main"></h1>
                                </div>
                                <div class="square">
                                    <h6 class="square-sub">CCSF</h6>
                                    <h1 class="square-main"></h1>
                                </div>
                                <div class="square">
                                    <h6 class="square-sub">3P K-9</h6>
                                    <h1 class="square-main"></h1>
                                </div>
                            </div>
                            <div style="flex: 3">
                                <p class="text">Alternate Screening Measures</p>
                                <table>
                                    <thead></thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div class="checkbox"></div>
                                            </td>
                                            <td>Human Remains</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="checkbox"></div>
                                            </td>
                                            <td>Live Animals Tendered as Cargo</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="checkbox"></div>
                                            </td>
                                            <td>Cargo Containing Hazardous Materials</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="checkbox"></div>
                                            </td>
                                            <td>Diplomatic Pouches Accepted From DOS</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="checkbox"></div>
                                            </td>
                                            <td>Cargo Accepted From The Federal Reserve Or U.S. Treasury</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="checkbox"></div>
                                            </td>
                                            <td>Cargo Accepted Directly From The Department Of Defense</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="checkbox"></div>
                                            </td>
                                            <td>Cargo Accepted In Support Of U.S. Law Enforcement Activities</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="checkbox"></div>
                                            </td>
                                            <td>Sealed Cargo Traveling Under U.S. CBP Orders of Export</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="checkbox"></div>
                                            </td>
                                            <td>Medical Shipment</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="checkbox"></div>
                                            </td>
                                            <td>Cargo Accepted from Sealed/Interline by _______________________________</td>
                                        </tr>
                                    </tbody>
                                </table>
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
        `.replace(/null/g, ''),
            }}
        ></div>
    );
};

export default CreateAcceptanceSheet;
