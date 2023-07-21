import { renderHook } from "@testing-library/react-hooks";
import useHmCharge from './useHmCharge';
import { Charge } from "./ChargeClass";

const excludeHmFeeAirlinePrefixes = {
    '114': true,
    '080': true
}

describe('useHmCharge', () => {
    test('should return an empty Charge object if no AWB number or s_untest is provided', () => {
        const { result } = renderHook(() => useHmCharge('', ''));
        const hmCharge = new Charge();

        expect(result.current).toEqual(hmCharge);
    });

    test('should return an empty Charge object if excluded airline prefix is provided', () => {
        const { result } = renderHook(() => useHmCharge('114123456789', 'CEWR1', new Date()));
        const hmCharge = new Charge();

        expect(result.current).toEqual(hmCharge);
    });

    test('should return a Charge object wtesth amount 16.52 and type HM if date is before 2023-06-10', () => {
        const { result } = renderHook(() => useHmCharge('123123456789', 'CEWR1', new Date('2023-06-09')));
        const hmCharge = new Charge();
        hmCharge.setAmount(16.52);
        hmCharge.addType('HM');

        expect(result.current).toEqual(hmCharge);
    });

    test('should return a Charge object wtesth amount 18.35 and type HM if date is after 2023-06-10', () => {
        const { result } = renderHook(() => useHmCharge('123123456789', 'CEWR1', new Date('2023-06-11')));
        const hmCharge = new Charge();
        hmCharge.setAmount(18.35);
        hmCharge.addType('HM');

        expect(result.current).toEqual(hmCharge);
    });
});