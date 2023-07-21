import { useMemo } from "react";
import _ from 'lodash';

import { IExtendedBooking } from "../booking/interfaces";
import composePrint from '../../../print/index';
import { ICorpStation } from "../../../globals/interfaces";
import { formatMawb } from '../../../utils';

interface Props {
    station: ICorpStation;
    booking: Array<IExtendedBooking>;
}

export default function GeneratePrint ({
    station,
    booking
}: Props) {

    const { s_address, s_phone } = station;

    const body = useMemo(() => {
        return (`
            <div class='row' style='margin-left: 20px;'>
                <table class='table'>
                    <thead class='bg-blue'>
                        <tr style='text-align: center;'>
                            <th>#</th>
                            <th>Flight</th>
                            <th>Origin</th>
                            <th>Destination</th>
                            <th>MAWB</th>
                            <th>Pieces</th>
                            <th>Weight</th>
                            <th>Volume</th>
                            <th>Specials</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${
                            booking.map((booking, i) => (
                                `
                                    <tr>
                                        <td>${i + 1}</td>
                                        <td>${_.get(booking, 's_flight_id', '').toUpperCase()}</td>
                                        <td>${booking.s_origin_airport}</td>
                                        <td>${booking.s_destination_airport}</td>
                                        <td>${formatMawb(booking.s_mawb)}</td>
                                        <td>${booking.i_pieces || ''}</td>
                                        <td>${booking.f_weight || ''}</td>
                                        <td>${booking.f_volume || ''}</td>
                                        <td>${booking.s_shc || ''}</td>
                                    </tr>
                                `
                            )).join('')
                        }
                    </tbody>    
                </table>
            </div>
        `);
    }, [booking]);

    return (
        <div dangerouslySetInnerHTML={{__html: composePrint(s_address, s_phone, '', body)}}></div>
    );
}