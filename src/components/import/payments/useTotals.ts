
import { useMemo } from 'react';

import { ICharge, IPayment } from '../../../globals/interfaces';
import { Totals } from './interfaces';

export default function useTotals(
    payments: Array<IPayment>,
    charges: Array<ICharge>
): Totals {
    const counterFee =
        charges.find((c) => c.s_name === 'COUNTER FEE')?.f_multiplier || 20;

    const totals = useMemo(() => {
        let paid = 0,
            charged = counterFee,
            overrides = 0;
        for (let i = 0; i < payments.length; i++) {
            const { f_amount, s_payment_method } = payments[i];
            if (f_amount < 0) {
                charged += Math.abs(f_amount);
            } else {
                paid += f_amount;
            }
            if (s_payment_method === 'OVERRIDE') {
                overrides += f_amount;
            }
        }
        const due = charged - paid;
        return {
            paid,
            charged,
            due,
            overrides,
            counterFee
        };
    }, [payments, counterFee]);

    return totals;
}
