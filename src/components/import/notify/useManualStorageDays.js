import { useMemo } from "react";
import moment from "moment";

export default function useManualStorageDays (d_last_free_day) {
    const days = useMemo(() => {
        const today = new Date(moment().format('MM/DD/YYYY'));   
        const useLastFreeDay = new Date(moment.utc(d_last_free_day).format('MM/DD/YYYY'));
        let days = moment(today).diff(useLastFreeDay, 'days');
        return days;
    }, [d_last_free_day]);
    return days;
}

