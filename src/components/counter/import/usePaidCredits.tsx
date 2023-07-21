import _ from 'lodash';
import { useMemo } from 'react';
import { getNum } from './localUtils';
import { Payment } from './interfaces';
import { IPayment } from '../../../globals/interfaces';

interface PaymentsCredits {
    totalPaid: number, 
    credits: number, 
    postEntryFee: boolean
}

export default function usePaidCredits (payments: Array<IPayment>) {
    const paymentsCredits: PaymentsCredits = useMemo(() => {
        let credits = 0, totalPaid = 0, postEntryFee = false;

        // eslint-disable-next-line array-callback-return
        payments.map(p => {
            const f_amount = _.get(p, 'f_amount', 0);
            if (p.selected && p.s_payment_method === 'OVERRIDE' && p.b_override_approved) {
                credits += f_amount;
            } else if (p.selected && p.s_payment_method !== 'OVERRIDE' && p.s_payment_method !== 'CHARGE') {
                totalPaid += f_amount;
            }

            if (p.s_payment_type === 'POST ENTRY') {
                postEntryFee = true;
            }
        });

        credits = getNum(credits);
        totalPaid = getNum(totalPaid);

        return { totalPaid, credits, postEntryFee };
    }, [payments]);

    return paymentsCredits;
}