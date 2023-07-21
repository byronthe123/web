import { useMemo } from 'react';
import { FFM } from './interfaces';
import { Charge } from './ChargeClass';

export default function useEwrChfCharge (
    ffms: Array<FFM>, 
    s_unit: string, 
    weight: number
) {
    const charge = useMemo(() => {
        const _charge = new Charge();

        if (s_unit === 'CEWR1') {
            const selectedFms = ffms.filter(f => f.selected);
            if (selectedFms.length > 0 && selectedFms[0].s_airline_code === 'T8') {
                const costPerKg = weight * 0.07;
                const amount = Math.max(100, costPerKg);
                _charge.setAmount(amount);
                _charge.addType('CHF');
            }
        }
        return _charge;
    }, [ffms, s_unit, weight])

    return charge;
}