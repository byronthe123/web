import _ from 'lodash';
import { useEffect, useState } from 'react';
import useLoading from '../../../customHooks/useLoading';
import { IFFM } from '../../../globals/interfaces';
import { api } from '../../../utils';

import { IExtendedFFM, IFlight} from './interfaces';

export default function useData(d_arrival_date: string, s_pou: string) {

    const { setLoading } = useLoading();
    const [dataMap, setDataMap] = useState<Record<string, Array<IExtendedFFM>>>({});
    const [flights, setFlights] = useState<Array<{s_flight_number: string}>>([]);
    const [selectedFlightNumber, setSelectedFlightNumber] = useState('');
    const [selectedAwb, setSelectedAwb] = useState<IExtendedFFM>();

    const handleSelectFlight = (s_flight_number: string) => {
        setSelectedFlightNumber(s_flight_number);
    }

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const res = await api(
                'get',
                `/direct-delivery?d_arrival_date=${d_arrival_date}&s_pou=${s_pou}`
            );
            if (res.status === 200) {
                const map = res.data;
                setDataMap(map);        
                const _flights: Array<IFlight> = [];
                for (const key in map) {
                    _flights.push({ 
                        s_flight_number: key
                    });
                }
                setFlights(_flights);
            }
            setLoading(false);
        };
        if (_.get(d_arrival_date, 'length', 0) > 0 && _.get(s_pou, 'length', 0) === 3) {
            getData();
        }
        setSelectedFlightNumber('');
    }, [d_arrival_date, s_pou]);

    return {
        dataMap,
        setDataMap,
        flights,
        selectedFlightNumber,
        selectedAwb,
        setSelectedAwb,
        handleSelectFlight
    }
}
