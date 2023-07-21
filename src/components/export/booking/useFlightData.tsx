import { useState, useEffect } from 'react';

import { IFlightSchedule } from '../../../globals/interfaces';
import { api } from '../../../utils';

export default function useFlightData (flightDate: string, s_unit: string) {
    const [flights, setFlights] = useState<Array<IFlightSchedule>>([]);

    useEffect(() => {
        const getFlights = async () => {
            const s_origin = s_unit.substring(1, 4);
            const res = await api('get', `/booking/flights?flightDate=${flightDate}&s_origin=${s_origin}`);
            if (res.status === 200) {
                console.log(res.data);
                setFlights(res.data);
            }
        }
        getFlights();
    }, [flightDate, s_unit]);

    return {
        flights
    }
}