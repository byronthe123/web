import { useEffect, useState } from "react";
import { api } from "../../../utils";
import useLoading from "../../../customHooks/useLoading";

export default function useRackData (s_mawb, s_uld, s_flight_id) {
    const [rackData, setRackData] = useState([]);
    const { setLoading } = useLoading();

    useEffect(() => {
        const getRackData = async () => {
            setLoading(true);
            const res = await api('post', 'breakdownProgressRackData', { s_mawb, s_uld, s_flight_id });
            setLoading(false);
            if (res.status === 200) {
                console.log(res.data);
                setRackData(res.data);
            }
        }
        if (s_mawb && s_mawb.length >= 11) {
            getRackData();
        }
    }, [s_mawb, s_uld]);

    return rackData;
}