import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { FFM } from './interfaces';
import { getStorageDates } from '../../../utils';

const extractDate = (date: Date | string): any => {
    return moment(date).isValid() ? date : '';
};

const diffDays = (from: string, to: string) => {
    const days =
        moment(to, 'YYYY-MM-DD')
            .startOf('day')
            .diff(moment(from, 'YYYY-MM-DD').startOf('day'), 'days') + 1;
    return Math.max(days, 0);
};

export default function useStorageDays(
    ffms: Array<FFM>,
    manualMode: boolean,
    s_mawb: string,
    s_airline_code: string,
    s_unit: string,
    forceSelect?: boolean,
    currentDate?: string
) {
    const [autoStorageDays, setAutoStorageDays] = useState<number>(0);
    const [autoLastArrivalDate, setAutoLastArrivalDate] = useState<any>('');
    const [autoStorageStartDate, setAutoStorageStartDate] = useState<any>('');

    const [autoLastFreeDay, setAutoLastFreeDay] = useState<any>('');

    const autoGoDate = useMemo(() => {
        if (moment(autoStorageStartDate).isValid()) {
            return moment(autoStorageStartDate)
                .add(14, 'day')
                .format('YYYY-MM-DD');
        } else {
            return '';
        }
    }, [autoStorageStartDate]);

    useEffect(() => {
        if (ffms.length > 0) {
            if (forceSelect) {
                for (let i = 0; i < ffms.length; i++) {
                    ffms[i].selected = true;
                }
            }

            const selectedFfms = ffms.filter((f) => f.selected);

            // AWB with most recent d_storage_start is at index 0:
            const sortedFfms = selectedFfms.sort(
                (a, b) =>
                    +new Date(b.d_arrival_date) - +new Date(a.d_arrival_date)
            );
            const mostRecentArrival = sortedFfms[0];

            console.log(mostRecentArrival);

            if (
                mostRecentArrival &&
                moment(mostRecentArrival.d_storage_start).isValid()
            ) {
                const lastArrivalDate = moment
                    .utc(mostRecentArrival.d_arrival_date)
                    .format('YYYY-MM-DD');

                const storageStartDate = moment
                    .utc(mostRecentArrival.d_storage_start)
                    .format('YYYY-MM-DD');

                const useCurrentDate =
                    currentDate && moment(currentDate).isValid()
                        ? currentDate
                        : moment().format('YYYY-MM-DD');

                let storageDays = diffDays(storageStartDate, useCurrentDate);

                setAutoStorageDays(isNaN(storageDays) ? 0 : storageDays);
                setAutoStorageStartDate(storageStartDate);
                setAutoLastArrivalDate(lastArrivalDate);
                setAutoLastFreeDay(
                    moment
                        .utc(mostRecentArrival.d_storage_second_free)
                        .format('YYYY-MM-DD')
                );
            }
        }
    }, [ffms, forceSelect, currentDate]);

    const [storageDays, setStorageDays] = useState(0);
    const [storageStartDate, setStorageStartDate] = useState<string>('');
    const [lastArrivalDate, setLastArrivalDate] = useState<string>('');

    useEffect(() => {
        if (manualMode) {
            const arrivalDate = moment
                .utc(lastArrivalDate)
                .format('YYYY-MM-DD');

            if (moment(arrivalDate).isValid()) {
                getStorageDates(
                    lastArrivalDate,
                    s_airline_code,
                    s_unit.substring(1, 4),
                    s_mawb.substring(0, 3)
                ).then((data) => {
                    const {
                        d_storage_first_free,
                        d_storage_second_free,
                        d_storage_start,
                    } = data;

                    setStorageStartDate(d_storage_start);

                    const useCurrentDate =
                        currentDate && moment(currentDate).isValid()
                            ? currentDate
                            : moment().format('YYYY-MM-DD');

                    const storageDays = diffDays(
                        d_storage_start,
                        useCurrentDate
                    );
                    setStorageDays(isNaN(storageDays) ? 0 : storageDays);
                });
            }
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
        s_mawb,
        s_airline_code,
        s_unit,
        currentDate,
    ]);

    return {
        autoLastArrivalDate,
        setAutoLastArrivalDate,
        autoStorageDays,
        storageDays,
        storageStartDate,
        setStorageStartDate,
        lastArrivalDate,
        setLastArrivalDate,
        autoLastFreeDay,
        autoGoDate,
    };
}
