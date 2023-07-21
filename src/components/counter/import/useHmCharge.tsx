import { useMemo } from 'react';
import { Charge } from './ChargeClass';
import moment from 'moment';

interface ExcludeHmFeeAirlinePrefixes {
    [index: string]: boolean
}

export default function useHmCharge (selectedAwbNum: string, s_unit: string, lastArrivalDate: string | Date) {
    const hmCharge = useMemo(() => {

        const hmCharge = new Charge();

        if (!selectedAwbNum || !s_unit) {
            return hmCharge;
        }

        const excludeHmFeeAirlinePrefixes: ExcludeHmFeeAirlinePrefixes = {
            '114': true,
            '080': true
        }

        const currentAirlinePrefix = selectedAwbNum.substr(0, 3); 

        if (excludeHmFeeAirlinePrefixes[currentAirlinePrefix] === undefined && s_unit === 'CEWR1') {
            if (moment(lastArrivalDate).isAfter('2023-06-10')) {
                hmCharge.setAmount(18.35);
            } else {
                hmCharge.setAmount(16.52);
            }
            hmCharge.addType('HM');
        } 

        return hmCharge;

    }, [selectedAwbNum, s_unit, lastArrivalDate]);

    return hmCharge;
}