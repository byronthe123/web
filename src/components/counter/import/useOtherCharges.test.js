import { renderHook } from "@testing-library/react-hooks";
import useOtherCharges from "./useOtherCharges";
import { Charge } from './ChargeClass';

test('it should calculate other charges correctly 1', () => {
    const payments = [{
        selected: true,
        f_amount: -100,
        s_payment_type: 'CHARGE'
    }, {
        selected: false,
        f_amount: -100,
        s_payment_type: 'CHARGE'
    }, {
        f_amount: -100,
        s_payment_type: 'ISC'
    }, {
        f_amount: 100,
        s_payment_type: 'STORAGE'
    }];

    const charge = new Charge();

    const { result } = renderHook(() => useOtherCharges(payments, charge, charge, charge));
    expect(result.current.amount).toBe(100)
});

test('it should calculate other charges correctly 2', () => {
    const payments = [{
        selected: true,
        f_amount: -100,
        s_payment_type: 'EXTRA'
    }, {
        selected: false,
        f_amount: -100,
        s_payment_type: 'CHARGE'
    }, {
        f_amount: -100,
        s_payment_type: 'ISC'
    }, {
        f_amount: 100,
        s_payment_type: 'STORAGE'
    }];

    const hmCharge = new Charge(16.52, ['HM']);

    const jfkChfCharge = new Charge(50, ['JFK']);

    const bosChfCharge = new Charge(10, ['CHF', 'CHF2']);

    const { result } = renderHook(() => useOtherCharges(payments, hmCharge, jfkChfCharge, bosChfCharge));
    expect(result.current.amount).toBe(
        Number((100 + 16.52 + 50 + 10).toFixed(2))
    );
    expect(result.current.description.trim()).toBe('EXTRA,HM,JFK,CHF,CHF2');
});