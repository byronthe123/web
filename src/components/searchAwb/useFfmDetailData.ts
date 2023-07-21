import { useMemo, useState, useEffect } from 'react';
import { IPcsWgtMap } from './interfaces';
import { IFFM, ISelectOption } from '../../globals/interfaces';

export default function useFfmDetailData (data: Array<IFFM>) {
    const ffmOptions = useMemo(() => {
        const map: IPcsWgtMap = {};
        
        for (let i = 0; i < data.length; i++) {
            const { s_flight_id, i_actual_piece_count, f_weight } = data[i];
            if (map[s_flight_id] === undefined) {
                map[s_flight_id] = {
                    i_actual_piece_count,
                    f_weight
                }
            } else {
                map[s_flight_id].i_actual_piece_count += i_actual_piece_count;
                map[s_flight_id].f_weight += f_weight;
            }
        }

        const options = [];

        for (let key in map) {
            const { i_actual_piece_count, f_weight } = map[key];
            const option = `${key} {${i_actual_piece_count}} ${(f_weight || 0).toFixed(2)} KG`;
            options.push({
                label: option,
                value: key
            });
        }

        return options;
    }, [data]);

    const [selectedOption, setSelectedOption] = useState<ISelectOption>({ label: '', value: '' });

    useEffect(() => {
        if (ffmOptions.length > 0) {
            setSelectedOption(ffmOptions[0]);
        }
    }, [ffmOptions]);

    const [totalPcs, setTotalPcs] = useState<number>(0);
    const [totalWgt, setTotalWgt] = useState<number>(0);
    const [origin, setOrigin] = useState<string>('');
    const [dest, setDest] = useState('');
    const [lastFreeDate, setLastFreeDate] = useState('');
    const [storageStart, setStorageStart] = useState('');

    useEffect(() => {
        if (data.length > 0) {
            let pcs = 0, wgt = 0;
            for (let i = 0; i < data.length; i++) {
                pcs += data[i].i_actual_piece_count;
                wgt += data[i].f_weight;
            }
            setTotalPcs(pcs);
            setTotalWgt(
                Number((wgt || 0).toFixed(2))
            )
        }
    }, [data]);

    useEffect(() => {
        const found = data.find(d => d.s_flight_id === selectedOption.value);
        if (found) {
            const { s_origin, s_destination, d_storage_second_free, d_storage_start } = found;
            setOrigin(s_origin);
            setDest(s_destination);
            setLastFreeDate(String(d_storage_second_free));
            setStorageStart(String(d_storage_start));
        }
    }, [selectedOption, data]);

    const handleSelectOption = (option: ISelectOption): void => {
        setSelectedOption(option);
    }

    return {
        ffmOptions,
        totalPcs,
        totalWgt,
        origin,
        dest,
        lastFreeDate,
        storageStart,
        selectedOption,
        handleSelectOption
    }
}