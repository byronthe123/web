import { useMemo } from 'react';
import { Charge } from './ChargeClass';

interface Map {
    [key: string]: boolean
}


export default function useJfkChfCharge (
    s_mawb: string, 
    s_unit: string, 
    weight: number
) {
    const jfkChfCharge = useMemo(() => {
        const charge = new Charge();

        const jfkUnits: Map = {
            'CJFK1': true,
            'CJFK2': true
        }

        const awbsMap: Map = {};

        const awbPrefix = (s_mawb || '').substr(0, 3);

        if (jfkUnits[s_unit] && awbsMap[awbPrefix]) {
            const chf = Number(weight) * 0.168;
            const portFee = chf * 0.0526;
            charge.setAmount(Number(portFee.toFixed(2)));
            charge.setTypes(['CHF', 'PORT FEE']);
        }

        return charge;
    }, [s_mawb, s_unit, weight]);

    return jfkChfCharge;
}