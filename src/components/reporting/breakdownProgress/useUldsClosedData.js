import { useState } from 'react';
import { api } from '../../../utils';
import useLoading from '../../../customHooks/useLoading';
import { useEffect } from 'react';

export default function useUldsClosedData (flights, runQuery) {
    const { setLoading } = useLoading();
    const [uldsDataMap, setUldsDataMap] = useState({});

    useEffect(() => {
        const getUldClosedData = async() => {
            setLoading(true);
            const map = {};
    
            for (let i = 0; i < flights.length; i++) {
                const { s_flight_id, ulds } = flights[i];
                const uldsArray = ulds.map(u => u.s_uld);
                map[s_flight_id] = {
                    ulds: uldsArray,
                    closedUldsCount: 0
                }
            }
    
            const res = await api('post', 'breakdownProgressClosedUlds', { map });
            setLoading(false);
            setUldsDataMap(res.data);
        }
        if (flights.length > 0 && runQuery) {
            getUldClosedData();
        }
    }, [flights, runQuery]);

    return uldsDataMap;
}