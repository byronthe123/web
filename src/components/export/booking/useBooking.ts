import { useEffect, useState } from "react";

import { api, validateAwb } from "../../../utils";
import { IExtendedBooking } from "./interfaces";
import useLoading from "../../../customHooks/useLoading";

export default function useBooking (s_mawb: string | null, i_flight_id?: number, includePieces?: boolean) {
    const [bookings, setBookings] = useState<Array<IExtendedBooking>>([]);
    const { setLoading } = useLoading();

    useEffect(() => {
        const getBookings = async () => {
            setLoading(true);
            const res = await api('get', `/booking/all?s_mawb=${s_mawb}&i_flight_id=${i_flight_id || null}&includePieces=${includePieces || false}`);
            setLoading(false);
            if (res.status === 200) {
                setBookings(res.data);
            }
        }
        if (validateAwb(s_mawb || '') || (i_flight_id && i_flight_id > 0)) {
            getBookings();
        }
    }, [s_mawb, i_flight_id, includePieces]);

    return bookings;
}