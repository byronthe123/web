import { useState, useEffect } from 'react';
import { api } from '../../../utils';

export default function useStationInfo (s_unit) {
    
    const [stationInfo, setStationInfo] = useState({});

    useEffect(() => {
        const resolveCorpStationInfo = async () => {
            const res = await api('get', `resolveCorpStationInfo/${s_unit}`);
            setStationInfo(res.data);
        }
        if (s_unit) {
            resolveCorpStationInfo();
        }
    }, [s_unit]);

    return stationInfo;
}