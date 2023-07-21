import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';

const extractDate = (date) => {
    return moment(date).isValid() ? date : '';
}

export default function useStorageDays (ffms, manualMode, s_mawb) {

    const [autoStorageDays, setAutoStorageDays] = useState(0);
    const [autoLastArrivalDate, setAutoLastArrivalDate] = useState('');
    const [autoStorageStartDate, setAutoStorageStartDate] = useState('');

    const [autoLastFreeDay, setAutoLastFreeDay] = useState('');

    const autoGoDate = useMemo(() => {
        if (moment(autoStorageStartDate).isValid()) {
            return moment(autoStorageStartDate).add(14, 'day').format('YYYY-MM-DD')
        } else {
            return '';
        }
    }, [autoStorageStartDate]);


    useEffect(() => {
        if (ffms.length > 0) {
            console.log(ffms);
            const selectedFfms = ffms.filter(f => f.selected);

            // AWB with most recent d_storage_start is at index 0:
            const sortedFfms = selectedFfms.sort((a, b) => moment(b.d_arrival_date) - moment(a.d_arrival_date));
            const mostRecentArrival = sortedFfms[0];
            const lastArrivalDate = moment.utc(mostRecentArrival.d_arrival_date).format('YYYY-MM-DD');
            const manualStorageStartCalc = new Date(moment(moment.utc(mostRecentArrival.d_arrival_date)).add(2, 'days').format('MM/DD/YYYY'));
            const storageStartDate = 
                moment(mostRecentArrival.d_storage_start).isValid() ?
                    new Date(moment.utc(mostRecentArrival.d_storage_start).format('MM/DD/YYYY')) :
                    manualStorageStartCalc;
            const today = new Date(moment().format('MM/DD/YYYY'));         
    
            let storageDays = moment(today).diff(storageStartDate, 'days');
            storageDays += 1;
            console.log(`storageStartDate = ${storageStartDate}`);
            setAutoStorageDays(storageDays);
            setAutoStorageStartDate(moment(storageStartDate).format('YYYY-MM-DD'));
            setAutoLastArrivalDate(lastArrivalDate);
            setAutoLastFreeDay(moment.utc(mostRecentArrival.d_storage_second_free).format('YYYY-MM-DD'));
        }
    }, [ffms]);

    const [storageDays, setStorageDays] = useState(0);
    const [storageStartDate, setStorageStartDate] = useState('');
    const [lastArrivalDate, setLastArrivalDate] = useState('');

    useEffect(() => {
        if (manualMode) {
            const arrivalDate = new Date(moment.utc(lastArrivalDate).format('MM/DD/YYYY'));
            const minusDays = 2;
            const storageStartDate = moment(arrivalDate).add(minusDays + 1, 'days');
            setStorageStartDate(moment(storageStartDate).format('YYYY-MM-DD'));
            
            const now = moment().format('MM/DD/YYYY');
            const today = new Date(now);         
            const days = moment(today).diff(arrivalDate, 'days');
            const storageDays = Math.trunc(days - minusDays) > - 1 ? Math.trunc(days - minusDays) : 0;
            setStorageDays(storageDays);
        } else {
            setStorageDays(autoStorageDays);
            setStorageStartDate(extractDate(autoStorageStartDate));
            setLastArrivalDate(extractDate(autoLastArrivalDate));
        }
    }, [
        autoStorageDays, 
        autoStorageStartDate, 
        autoLastArrivalDate,
        manualMode, 
        lastArrivalDate, 
        s_mawb
    ]);

    return {
        autoStorageDays,
        storageDays,
        storageStartDate,
        setStorageStartDate,
        lastArrivalDate,
        setLastArrivalDate,
        autoLastFreeDay,
        autoGoDate
    }

}