import React, { Fragment } from 'react';
import moment from 'moment';
import { formatDatetime } from '../../../utils';
import _ from 'lodash';

const CreateImportDeliverySheet = ({
    selectedMawb,
    stationInfo,
    officeAgent,
    warehouseAgent,
    user,
    visualReportingNotes
}) => {

    const getWarehouseProcessTime = (selectedMawb) => {
        if (selectedMawb && selectedMawb.t_dock_ownership && selectedMawb.t_dock_complete) {
            const a = moment(selectedMawb.t_dock_ownership);
            const b = moment(selectedMawb.t_dock_complete);
            const diff = moment(b.diff(a));
            const duration = moment.duration(diff);
            const string = `${duration.hours()}:${parseInt(duration.minutes()) < 10 ? '0' : ''}${duration.minutes()}`;
            return string;
        }
    }

    return (
        <Fragment>
            <div dangerouslySetInnerHTML={{ __html: selectedMawb && `
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
    <div class='container-fluid' style='margin-top: 20px'>
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
            <div class='col-xs-1'>
                <div class='row'>
                    <h3>DELIVERED</h3>
                </div>
                <div class='row'>
                    <h6>DELIVERED TO:</h6>
                </div>
                <div class='row'>
                    <div class='text-blue' style='font-weight: bold; font-size: 26px;'>${selectedMawb.s_driver_name}</div>
                </div>
                <div class='row'>
                    <p>
                        <span style='font-weight: bold'>COMPANY: </span>${selectedMawb.s_driver_company}
                    </p>
                    <p>
                        <span style='font-weight: bold'>PHONE: </span>${selectedMawb.s_trucking_cell !== null ? selectedMawb.s_trucking_cell : ''}
                    </p>
                    <p>
                        <span style='font-weight: bold'>EMAIL: </span>${selectedMawb.s_trucking_email !== null ? selectedMawb.s_trucking_email : ''}
                    </p>
                </div>
            </div>
            <div class='col-xs-10 text-right' style='margin-top: 50px;'>
                <div class='row' style='margin-right: 50px;'>
                    <h1> 
                        <span class='bg-blue text-white-custom' style='font-size: 75px; margin-right: 50px;'>${selectedMawb.s_mawb}</span>
                    </h1>
                </div>
                <div class='row'>
                    <p style='margin-right: 50px;'>HOUSE NO: ${selectedMawb.s_hawb !== null ? selectedMawb.s_hawb : ''}</p>
                    <p style='margin-right: 50px;'>DELIVERED DATE: ${moment.utc(selectedMawb.t_created).format('MM/DD/YYYY')}</p>
                </div>
            </div>
        </div>
        <div class='row' style='margin-top: 40px; width: 1150px;'>
            <div style="float: left; width: 600px; margin-right: 60px; padding-left: 30px;">
                <table class='table'>
                    <thead class='bg-blue'>
                        <tr style='text-align: center;'>
                            <th colspan="2">For AWB ${selectedMawb.s_mawb}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Pieces Processed</td>
                            <td>${selectedMawb.i_pieces}</td>
                        </tr>
                        <tr>
                            <td>Pieces Delivered</td>
                            <td>${selectedMawb.i_pcs_delivered || 0}</td>
                        </tr>
                        <tr>
                            <td>Weight</td>
                            <td>${selectedMawb.f_weight}</td>
                        </tr>
                        <tr>
                            <td>Origin</td>
                            <td>${selectedMawb.s_origin !== null ? (selectedMawb.s_origin || '') : ''}</td>
                        </tr>
                        <tr>
                            <td>Destination</td>
                            <td>${selectedMawb.s_destination !== null ? (selectedMawb.s_destination || '') : ''}</td>
                        </tr>
                        <tr>
                            <td>Nature of Goods</td>
                            <td>${selectedMawb.s_goods_description !== null ? (selectedMawb.s_goods_description || '') : ''}</td>
                        </tr>
                        <tr>
                            <td>Arriving Flight</td>
                            <td>${selectedMawb.d_last_arrival_date !== null ? moment.utc(selectedMawb.d_last_arrival_date).format('MM/DD/YYYY') : ''}</td>
                        </tr>
                        <tr>
                            <td>Customs</td>
                            <td>${_.get(selectedMawb, 's_customs_release', '').substring(0, 250)}</td>
                        </tr>
                        <tr>
                            <td>Notes</td>
                            <td>${selectedMawb.s_notes || ''}</td>
                        </tr>
                        <tr>
                            <td>Damage Report(s)</td>
                            <td>${
                                visualReportingNotes.map(note => (
                                    `<div style='margin-bottom: 5px;'>${moment(note).utc().format('MM/DD/YYYY HH:mm')}: ${note.comments}</div>`
                                )).join('')
                            }</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style='width: 420px; padding-left: 0; padding-right: 50px; float: right;'>
                <table class='table'>
                    <thead class='bg-blue'>
                        <tr>
                            <th colspan="2">PROCESSED DETAIL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>    
                            <td>Check-in Time:</td>
                            <td>${formatDatetime(selectedMawb.t_kiosk_submittedtime)}</td>
                        </tr>
                        <tr>    
                            <td>Office Process Time:</td>
                            <td>${formatDatetime(selectedMawb.t_counter_assigned_start)}</td>
                        </tr>
                        <tr>    
                            <td>Office Process Agent</td>
                            <td>${officeAgent}</td>
                        </tr>
                        <tr>    
                            <td>Warehouse Process Time:</td>
                            <td>${selectedMawb && selectedMawb.t_dock_ownership && formatDatetime(selectedMawb.t_dock_ownership)}</td>
                        </tr>
                        <tr>    
                            <td>Warehouse Process Agent</td>
                            <td>${warehouseAgent}</td>
                        </tr>
                        <tr>    
                            <td>Warehouse Delivery Time:</td>
                            <td>${selectedMawb && selectedMawb.t_dock_complete && formatDatetime(selectedMawb.t_dock_complete)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- <img src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.footer.01.png' style='object-fit: fill;' /> -->

        <div class='row text-right' style='margin-top: -50px; margin-right: 0px; height: 250px; text-align: right; position: relative;'>
            <img src='${selectedMawb.s_warehouse_signature_link}' style='height: 250px; width: auto; position: fixed; bottom: 400px; right: 50px;' />
        </div>
        <div class='row' style='margin-top: 105px; margin-bottom: 0px;'>
            <div class='text-right' style='position: absolute; top: 1300px; right: 40px;'>
                <p>Accepted by</p>
                <h6>${selectedMawb.s_driver_name}</h6>
            </div>
            <div class='text-left' style='position: absolute; top: 1525px; margin-left: 15px;'>
                <p>Receipt Statement: Requested by ${user && user.displayName.split(' ')[0]} on ${moment().local().format('MM/DD/YYYY hh:mm A')}.</p>
                <p>The undersigned acknowledge the receipt of above mentioned consigment complete and in good condition other than currently reported on this page.</p>
            </div>
            <div class='text-right' style='position: absolute; right: 30px; top: 1350px;'>
                <p class='text-blue' style='font-size: 50px;'>Thank you</p>
            </div>
        </div>
    </div>
    <script>
        // setTimeout(() => {
        //     window.print();
        // }, 1000);
    </script>
</body>
</html>            ` }}>
            </div>
            {/* <Button color='success'>Print</Button> */}
        </Fragment>
    );
}

export default CreateImportDeliverySheet;