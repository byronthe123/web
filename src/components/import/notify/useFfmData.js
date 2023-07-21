import { useEffect, useState } from 'react';
import { api } from '../../../utils';
import useLoading from '../../../customHooks/useLoading';
import moment from 'moment';
import _ from 'lodash';

export default function useFfmData (d_arrival_date, s_destination, s_unit) {
    const [ffmData, setFfmData] = useState([]);
    const { setLoading } = useLoading();

    useEffect(() => {
        const ffmQuery = async() => {

            const path = window.location.pathname;

            const body = {
                d_arrival_date,
                s_destination,
                s_unit,
                b_transfer: path === '/EOS/Operations/Transfers/Notify'
            }

            setLoading(true);
            const res = await api('post', 'selectFfmByFlightArrivalDateAndDestination', body);
            setLoading(false);

            if (res.status === 200) {
                const { data } = res;
                setFfmData(data);
            }
        }
        if (moment(d_arrival_date).isValid() && (s_destination && s_destination.length > 0)) {
            ffmQuery();
        }
    }, [d_arrival_date, s_destination, window.location.pathname]);

    return {
        ffmData,
        setFfmData
    };
}