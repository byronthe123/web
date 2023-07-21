import { useEffect, useState } from "react";
import { api, } from '../../../../utils';import useLoading from "../../../../customHooks/useLoading";

export default function useUnitRack (unit, user, activeFirstTab) {
    const [unitRack, setUnitRack] = useState();
    const { setLoading } = useLoading();
    
    useEffect(() => {
        const getUnitRackData = async () => {
            setLoading(true);
            const data = {
                unit, 
                user
            }
        
            const res = await api('post', 'unitRack', {data});
    
            setUnitRack(res.data);
            setLoading(false);
        }
        if (unit && user && activeFirstTab === '2') {
            getUnitRackData();
        }
    }, [unit, user, activeFirstTab]);

    return unitRack;
}