import { renderHook } from "@testing-library/react-hooks";
import usePaidCredits from "./usePaidCredits";

const payments = [{
    f_amount: 100,
    selected: true,
    s_payment_method: 'OVERRIDE',
    b_override_approved: true
}, {
    f_amount: 50,
    selected: true,
    s_payment_method: 'OVERRIDE',
    b_override_approved: false
}, {
    f_amount: 75,
    selected: false,
    s_payment_method: 'OVERRIDE',
    b_override_approved: true
}, {
    f_amount: 44.99,
    selected: true,
    s_payment_method: 'OTHER'
}, {
    f_amount: -55.55,
    selected: true,
    s_payment_method: 'PAYMENT',
    s_payment_type: 'POST ENTRYS'
}]

describe('usePaidCredits()', () => {
    test('it should calc the values correctly', () => {
        const {result} = renderHook(() => usePaidCredits(payments));
        const { totalPaid, credits, postEntryFee } = result.current;
        let comparePaid = 0, compareCredits = 0, comparePostEntryFee = false;

        for (let i = 0; i < payments.length; i++) {
            const { 
                f_amount, 
                selected, 
                s_payment_method, 
                b_override_approved,
                s_payment_type = '' 
            } = payments[i];
            
            if (selected) {
                if (s_payment_method === 'OVERRIDE' && b_override_approved) {
                    compareCredits += f_amount;
                } else if (s_payment_method !== 'OVERRIDE' && f_amount > 0) {
                    comparePaid += f_amount;
                }
            }

            if (s_payment_type === 'POST ENTRY') {
                comparePostEntryFee = true;
            }   

        }

        expect(totalPaid).toBe(comparePaid);
        expect(credits).toBe(compareCredits);
        expect(postEntryFee).toBe(comparePostEntryFee)
    });
});