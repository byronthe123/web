import { useState, useEffect } from 'react';
import _ from 'lodash';
import { FFM, FHL } from './interfaces';

export default function usePiecesWeight(
    ffms: Array<FFM>, 
    fhls: Array<FHL>, 
    manualMode: boolean, 
    s_hawb: string
) {

    const [autoPieces, setAutoPieces] = useState<number>(0);
    const [autoWeight, setAutoWeight] = useState<number>(0);

    useEffect(() => {
        let pieces = 0, weight = 0;
        for (let i = 0; i < ffms.length; i++) {
            if (ffms[i].selected) {
                pieces += ffms[i].i_actual_piece_count;
                weight += ffms[i].f_weight;
            }
        }
        setAutoPieces(pieces);
        setAutoWeight(Number(weight.toFixed(2)));
    }, [ffms]);

    const [pieces, setPieces] = useState<number | string>('');
    const [weight, setWeight] = useState<number | string>('');

    useEffect(() => {
        if (!manualMode) {
            setPieces(autoPieces);
            setWeight(autoWeight);
        } else {
            if (s_hawb) {
                const selectedFhl = fhls.find(fhl => _.get(fhl, 's_hawb', '') === s_hawb.toUpperCase());
                setPieces(_.get(selectedFhl, 'i_pieces', ''));
                setWeight(_.get(selectedFhl, 'f_weight', ''));
            } else {
                setPieces('');
                setWeight('');
            }
        }
    }, [autoPieces, autoWeight, fhls, manualMode, s_hawb]);

    return {
        autoPieces,
        autoWeight,
        pieces, 
        setPieces,
        weight,
        setWeight
    }
}