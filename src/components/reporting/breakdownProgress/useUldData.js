import { useEffect, useState } from "react";
import { api } from "../../../utils";
import _ from 'lodash';

export default function useUldData (i_unique, s_uld, s_flight_id) {
    const [uldData, setUldData] = useState({});

    useEffect(() => {
        const breakdownProgressUldData = async() => {
            const res = await api('post', 'breakdownProgressUldData', {
                i_unique, s_uld, s_flight_id
            });
            setUldData(_.get(res, 'data[0]', {}));
        }
        if (i_unique && s_uld) {
            breakdownProgressUldData();
        }
    }, [i_unique, s_uld]);

    return uldData;
}