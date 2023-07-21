import { useEffect, useState } from "react";
import { api } from "../../../utils";

export default function useTotalBooked (i_flight_id: number) {
    const [totalBooked, setTotalBooked] = useState(0);

    useEffect(() => {
        const getTotalBooked = async () => {
            const res = await api('get', `/booking/total-booked/${i_flight_id}`);
            if (res.status === 200) {
                setTotalBooked(res.data.totalBooked);
            }
        }
        if (i_flight_id > 0) {
            getTotalBooked();
        }
    }, [i_flight_id]);

    return totalBooked;
}