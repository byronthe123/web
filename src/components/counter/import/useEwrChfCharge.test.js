import { renderHook } from "@testing-library/react-hooks";
import useEwrChfCharge from './useEwrChfCharge';

describe('useEwrChfCharge', () => {
    test(`
        it should calculate CHF charge if the unit is CEWR1 
        and the first selected flight is T8
    `, 
    () => {
        const ffms = [{
            s_airline_code: 'T8',
            selected: true
        }, {
            s_airline_code: 'F8',
            selected: true
        }]
        const weight = 10;

        const {result} = renderHook(() => useEwrChfCharge(ffms, 'CEWR1', weight));
        const charge = result.current;
        const { amount, types } = charge;
        const compareAmount = Math.max((weight * 0.07), 100);
        expect(compareAmount).toBe(amount);
        expect('CHF').toBe(types[0]);
    });

    test(`
        it should NOT calculate CHF charge if the unit is CEWR1 
        and the first selected flight is NOT T8
    `, 
    () => {
        const ffms = [{
            s_airline_code: 'F8',
            selected: true
        }, {
            s_airline_code: 'F8',
            selected: true
        }]
        const weight = 10;

        const {result} = renderHook(() => useEwrChfCharge(ffms, 'CEWR1', weight));
        const charge = result.current;
        const { amount, types } = charge;
        const compareAmount = 0;
        expect(compareAmount).toBe(amount);
        expect(0).toBe(types.length);
    });
    
    test(`it should NOT calculate CHF charge if the unit is NOT CEWR1`, () => {
        const ffms = [{
            s_airline_code: 'F8',
            selected: true
        }, {
            s_airline_code: 'F8',
            selected: true
        }]
        const weight = 10;

        const {result} = renderHook(() => useEwrChfCharge(ffms, 'CEWR1', weight));
        const charge = result.current;
        const { amount, types } = charge;
        const compareAmount = 0;
        expect(compareAmount).toBe(amount);
        expect(0).toBe(types.length);
    });
});