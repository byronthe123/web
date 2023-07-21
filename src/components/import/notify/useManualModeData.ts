import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { countHoliday } from '../../../utils';
 
export default function useManualModeData (
    manual_d_flight_date: string
) {
    const [lastFreeDate, setLastFreeDate] = useState('');
    const [storageStartDate, setStorageStartDate] = useState('');

    useEffect(() => {
        if (dayjs(manual_d_flight_date).isValid()) {
            countHoliday(manual_d_flight_date).then(result => {
                const add = result ? 1 : 0;
                setLastFreeDate(
                    dayjs(manual_d_flight_date).add(2 + add, 'days').format('YYYY-MM-DD')
                );
                setStorageStartDate(
                    dayjs(manual_d_flight_date).add(3 + add, 'days').format('YYYY-MM-DD')
                );
            });
        }
    }, [manual_d_flight_date]);

    return {
        lastFreeDate,
        storageStartDate
    }
}