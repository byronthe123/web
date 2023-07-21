import moment from "moment";

export default function StatsPrint({ stat, uldsArray, userEmail }) {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: `
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <link
                                rel="stylesheet"
                                href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
                                integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
                                crossorigin="anonymous"
                            />
                            <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
                            <!-- HTTP 1.1 -->
                            <meta http-equiv="Cache-Control" content="no-store" />
                            <!-- HTTP 1.0 -->
                            <meta http-equiv="Pragma" content="no-cache" />
                            <!-- Prevents caching at the Proxy Server -->
                            <meta http-equiv="Expires" content="0" />
                        </head>
                        <body>
                            <div style="width: 100%;">
                                <h2 style="float: left">${stat.s_airline_code}${stat.s_flight_number}/${stat.d_flight}</h2>
                                <h2 style="float: right">${stat.s_type} Stat</h2>
                            </div>
                            <table class='table'>
                                <tbody>
                                    <tr>
                                        <td width="30%">Airline Code</td>
                                        <td width="70%">${stat.s_airline_code}</td>
                                    </tr>
                                    <tr>
                                        <td>Flight Number</td>
                                        <td>${stat.s_flight_number}</td>
                                    </tr>
                                    <tr>
                                        <td>Flight Date</td>
                                        <td>${stat.d_flight}</td>
                                    </tr>
                                    <tr>
                                        <td>ULDs in Flight</td>
                                        <td>${uldsArray.join(', ')}</td>
                                    </tr>
                                    <tr>
                                        <td>AWB</td>
                                        <td>${stat.i_awb}</td>
                                    </tr>
                                    <tr>
                                        <td>Pieces</td>
                                        <td>${stat.i_pieces}</td>
                                    </tr>
                                    <tr>
                                        <td>DG AWBs / UN #</td>
                                        <td>${stat.i_awb_dg}</td>
                                    </tr>
                                    <tr>
                                        <td>LD3</td>
                                        <td>${stat.i_ld3}</td>
                                    </tr>
                                    <tr>
                                        <td>LD3 BUP</td>
                                        <td>${stat.i_ld3_bup}</td>
                                    </tr>
                                    <tr>
                                        <td>LD7</td>
                                        <td>${stat.i_ld7}</td>
                                    </tr>
                                    <tr>
                                        <td>LD7 BUP</td>
                                        <td>${stat.i_ld7_bup}</td>
                                    </tr>
                                    <tr>
                                        <td>Cargo Total Weight</td>
                                        <td>${stat.f_total_kg}</td>
                                    </tr>
                                    <tr>
                                        <td>Cargo BUP Weight</td>
                                        <td>${stat.f_bup_kg}</td>
                                    </tr>
                                    <tr>
                                        <td>Cargo Loose Weight</td>
                                        <td>${stat.f_loose_kg}</td>
                                    </tr>
                                    <tr>
                                        <td>Mail Weight</td>
                                        <td>${stat.f_mail_kg}</td>
                                    </tr>
                                    <tr>
                                        <td>Flight Weight</td>
                                        <td>${stat.f_flight_kg}</td>
                                    </tr>
                                    <tr>
                                        <td>Transfer AWB</td>
                                        <td>${stat.i_awb_transfer || ''}</td>
                                    </tr>
                                    <tr>
                                        <td>Transfer Weight</td>
                                        <td>${stat.f_transfer_kg}</td>
                                    </tr>
                                    <tr>
                                        <td>Courier Weight</td>
                                        <td>${stat.f_courier_kg}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <h6 style="margin-left: 7px;">Printed by ${userEmail} on ${moment().format('MM/DD/YYYY HH:mm')}</h6>
                            <script>
                                setTimeout(() => {
                                    window.print();
                                }, 1000);
                            </script>
                        </body>
                    </html>
            
            `,
            }}
        ></div>
    );
}
