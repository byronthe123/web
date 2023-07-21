import { useEffect, useState } from "react";
import _ from 'lodash';
import calcStorage from './calcStorage';

interface IAWB {
    id: number
    s_mawb: string,
    i_actual_piece_count: number,
    f_weight: number,
    s_destination: string,
    storageCost?: number
}

interface ISelectedMap {
    [s_mawb: string]: IAWB
}

export default function useMultipleMode (
    f_import_per_kg: number, 
    f_import_min_charge: number
) {
    const [multipleMode, setMultipleMode] = useState<boolean>(false);
    const [selectedMap, setSelectedMap] = useState<ISelectedMap>({});
    const [refresh, setRefresh] = useState<number>(0);

    const manageSelectedMap = (awb: IAWB) => {
        setSelectedMap((prev) => {
            const copy = _.cloneDeep(prev);

            const { s_mawb } = awb;
            if (copy[s_mawb] !== undefined) {
                delete copy[s_mawb];
            } else {
                if (Object.keys(copy).length < 40) {
                    copy[s_mawb] = awb;
                }
            }
    
            return copy;    
        });
        setRefresh(refresh => refresh + 1);
    }

    useEffect(() => {
        if (f_import_per_kg || f_import_min_charge) {
            setSelectedMap((prev) => {
                const copy = _.cloneDeep(prev);
                for (let s_mawb in copy) {
                    copy[s_mawb].storageCost = calcStorage(copy[s_mawb].f_weight, f_import_per_kg, f_import_min_charge);
                }
                return copy;
            });
        }
    }, [refresh, f_import_per_kg, f_import_min_charge]);

    useEffect(() => {
        setSelectedMap({});
        setRefresh(refresh => refresh + 1);
    }, [multipleMode]);

    return {
        multipleMode, 
        setMultipleMode,
        selectedMap, 
        setSelectedMap,
        manageSelectedMap,
        refresh,
        setRefresh
    }
}