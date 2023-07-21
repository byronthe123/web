import React from 'react';
import moment from 'moment';

export default ({
    data,
    stationData
}) => {

    const rowGenerator = (d, i) => {
        const mapping = [
            {
                name: 's_employee_name'
            }, 
            {
                name: 't_created',
                datetime: true
            }, 
            {
                name: 'b_q1',
                boolean: true
            },
            {
                name: 'b_q2',
                boolean: true
            },
            {
                name: 'b_q3',
                boolean: true
            },
            {
                name: 'b_q4',
                boolean: true
            },
            {
                name: 'b_pass_test',
                boolean: true
            },
        ]

        const row = `
            <tr>
                <td>${i + 1}</td>
                ${mapping.map(m => 
                    m.boolean ? 
                        `<td>${d[m.name] ? 'Yes' : 'No'}</td>` :
                    m.datetime ?
                        `<td>${moment.utc(d[m.name]).format('MM/DD/YYYY HH:mm:ss')}</td>` :
                        `<td>${d[m.name]}</td>`
                ).join(' ')}
            </tr>
        `;

        return row;
    }

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

                        .table-row-info {
                            text-align: center;
                            display: inline-block;
                        }

                        tbody tr:nth-child(odd){
                            background-color: #deeaf6;
                        }

                        tbody tr:nth-child(even){
                            background-color: #ffffff;
                        }

                        tbody td {
                            border: 0.5px solid rgb(64, 159, 216);
                            font-size: 12px;
                            text-align: center;
                        }

                        .table th {
                            background-color:	rgb(64, 159, 216) !important;
                            color: white !important;
                            text-align: center;
                            font-size: 12px;
                        }

                        .img-small {
                            width: '10px';
                            height: auto;
                        }

                        .text-blue {
                            color: rgb(64, 159, 216)
                        }

                        .text-white-custom {
                            color: white !important;
                        }

                        @media print {

                            @page {                
                                size: A4;
                                margin: 20 0;
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
                                background-color: #deeaf6 !important;
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

                            .text-center {
                                text-align: center;
                            }

                            .bold {
                                font-weight: bold;
                            }

                            .text-small {
                                font-size: 10px;
                                margin-bottom: 0px;
                            }
                        }
                    </style>
                    <div class='container-fluid'>
                        <div class='row'>
                            <div class='col-xs-4' style='padding-left: 40px;'>
                                <img src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.logo.01.png' style='width: 300px; height: auto' />
                            </div>
                            <div class='col-xs-2'>
                                <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.add.01.png' />
                                <h6>${stationData.s_address}</h6>
                            </div>
                            <div class='col-xs-2'>
                                <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.phone.01.png' />
                                <h6>${stationData.s_phone}</h6>
                            </div>
                            <div class='col-xs-2'>
                                <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.email.01.png' />
                                <h6>Imp.sk.ewr@choie.aero</h6>
                            </div>
                            <div class='col-xs-2'>
                                <img style='width: 100px; height: auto;' src='https://ewrstorage1.blob.core.windows.net/pics/choice.pod.web.01.png' />
                                <h6>www.choice.aero</h6>
                            </div>
                        </div>
                        <div class='row'>
                            <div class='col-xs-12 bg-blue text-center'>
                                <h4 class='text-white-custom bold'>Health Check Report</h4>
                            </div>    
                        </div>
                        <div class='row' style='margin-top: 10;'>
                            <div class='col-xs-12 text-center' style='padding: 0 0;'>
                                <table class='table'>
                                    <thead class='bg-blue'>
                                        <tr>
                                            <th>#</th>
                                            <th>Employee</th>
                                            <th>Time</th>
                                            <th>Q1</th>
                                            <th>Q2</th>
                                            <th>Q3</th>
                                            <th>Q4</th>
                                            <th>Pass</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${
                                            data.map((d, i) => rowGenerator(d, i)).join(' ')
                                        }
                                    </tbody>    
                                </table>    
                            </div>    
                        </div>
                        <div class='row'>
                            <div class='col-xs-12' style='padding: 0 0;'>
                                <p class='text-small'>1. Do you have a fever of 100.4 or greater and/or are you experiencing any COVID-19 symptoms?</p>
                                <p class='text-small'>2. Have you had close contact (within 6 feet of an infected person for at least 15 minutes)?</p>
                                <p class='text-small'>3. Has anyone in your household been diagnosed with COVID-19?</p>
                                <p class='text-small'>4. Have you traveled out of your Tri-State or traveled out of the country?</p>
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
        `
        }}></div>
    );
}