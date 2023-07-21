import React, {Fragment} from 'react';
import  {Button} from 'reactstrap';
import moment from 'moment';
import _ from 'lodash';

const GenerateCertificate = ({
    quizData,
    stationInfo
}) => {

    return (
        <Fragment>
            <div dangerouslySetInnerHTML={{ __html: `
                <!DOCTYPE html>
                    <html>
                        <style>
                            @page {
                                size: landscape
                            }

                            html, body {
                                width: 297mm;
                                height: 210mm;
                            }

                            @media print {
                                html, body {
                                    width: 297mm;
                                    height: 210mm;
                                }
                                @page {
                                    size: landscape
                                }
                            }

                            body {
                                background-image: url('https://ewrstorage1.blob.core.windows.net/pics/Certificate-training-01.jpg');
                                background-repeat: no-repeat;
                                background-size: cover;
                            }

                            .presented-to-div {
                                position: fixed;
                                top: 32%;
                                width: 297mm
                            }
                    
                            .presented-to {
                                text-align-last: center;
                                font-family: 'Parisienne', cursive;
                                font-size: 55px;
                            }

                            .description-conatiner {
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                font-size: 20px;
                                top: 44%;
                                position: fixed;
                                width: 297mm;
                                text-align: center;
                                margin: 0 auto;
                            }
                    
                            .description {
                                text-align-last: center;
                            }

                            .awarded-by {
                                position: fixed;
                                top: 58%;
                                left: 40%;
                                /* font-size: 55px; */
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                font-weight: normal;
                            }

                            .awarded-by-title {
                                position: fixed;
                                top: 65%;
                                left: 45%;
                                /* font-size: 55px; */
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                font-weight: normal;
                            }

                            .conducted-on {
                                position: fixed;
                                top: 67.5%;
                                left: 42%;
                                /* font-size: 55px; */
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                font-weight: normal;
                            }

                            .address {
                                /* position: fixed;
                                top: 71%;
                                left: 42%; */
                                /* font-size: 55px; */
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                font-weight: normal;
                            }

                            .address-container {
                                position: fixed;
                                top: 71%;
                                left: 39%;
                                width: 260px;
                                text-align: center;
                                /* border: 1px solid red; */
                            }

                            .score-1 {
                                position: fixed;
                                top: 16%;
                                left: 16%;
                                /* font-size: 55px; */
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                color: white;
                                font-size: 50px;
                            }

                            .score-2 {
                                position: fixed;
                                top: 16%;
                                left: 14%;
                                /* font-size: 55px; */
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                color: white;
                                font-size: 50px;
                            }
                        </style>
                        <head>
                            <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Parisienne&display=swap" rel="stylesheet">
                        </head>
                        <body>
                            <div class='presented-to-div'>
                                <h1 class='presented-to'>${quizData.user}</h1>
                            </div>  
                            <div class='description-conatiner'>
                            <div style='width: 220mm; text-align: center; margin: 0 auto;'>
                                    <h4 class='description'>has successfully the <span>${quizData.s_module_name}</span> training.</h4>
                                </div>
                            </div>                          
                            <h1 class='awarded-by'>${quizData.assignor}</h1>
                            <h4 class='awarded-by-title'>${quizData.assignorTitle}</h4>
                            <h4 class='conducted-on'>Conducted on ${moment(quizData.t_completed).format('MM/DD/YYYY')}</h4>
                            <div class='address-container'>
                                <p class='address'>${_.get(stationInfo, 's_airport', '')}, ${_.get(stationInfo, 's_address', '')}</p>
                            </div>
                            <h1 class='${quizData.f_percent < 1 ? 'score-1' : 'score-2'}'>${(quizData.f_percent * 100).toFixed(0)}</h1>
                        </body>
                        <script>
                            setTimeout(() => {
                                window.print();
                            }, 2000);
                        </script>
                    </html>            
                ` }}>
            </div>
        </Fragment>
    );
}

export default GenerateCertificate;