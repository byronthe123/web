import { useEffect, useState } from 'react'; 
import { getNum } from './localUtils';
import _ from 'lodash';
import { Payment, IOtherCharge } from './interfaces';
import { Charge } from './ChargeClass';
import { IPayment } from '../../../globals/interfaces';

interface StandardCharge {
    [index: string]: boolean
}

export default function useOtherCharges (
    payments: Array<IPayment>, 
    hmCharge: Charge,
    jfkChfCharge: Charge, 
    bosChfCharge: Charge
) {

    const [otherCharges, setOtherCharges] = useState<IOtherCharge>({
        amount: 0,
        description: ''
    });

    useEffect(() => {
        const standardCharges: StandardCharge = {
            'ISC': true,
            'STORAGE': true
        };

        const isOtherCharge = (current: IPayment) => current.s_payment_method === 'CHARGE' && !standardCharges[current.s_payment_type];  
        
        const types: Array<string> = [];

        let totalOtherCharges = payments.reduce((total: number, current: IPayment) => {
            if (current.selected && isOtherCharge(current)) {
                types.push(current.s_payment_type);
                return total += Math.abs(current.f_amount);
            }
            return total += 0;
        }, 0);

        const addOtherCharges = [hmCharge, jfkChfCharge, bosChfCharge];

        for (let i = 0; i < addOtherCharges.length; i++) {
            totalOtherCharges += getNum(_.get(addOtherCharges, `[${i}].amount`, 0));
            types.push(..._.get(addOtherCharges, `[${i}].types`, []));
        }

        setOtherCharges({
            amount: getNum(totalOtherCharges),
            description: ` ${types.toString()}`
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payments, hmCharge.getAmount(), jfkChfCharge.getAmount(), bosChfCharge.getAmount()]);

    return otherCharges;
}