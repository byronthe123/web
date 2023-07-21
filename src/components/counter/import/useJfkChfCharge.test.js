import { renderHook } from "@testing-library/react-hooks";
import useJfkChfCharge from "./useJfkChfCharge";

// test('it should calculate the jfkChf charge if conditions are met', () => {
//     const { result } = renderHook(() => useJfkChfCharge('02600000000', 'CJFK1', 10));
//     const { amount, types } = result.current;
//     expect(amount).toBe(0.09);
//     expect(types).toEqual(['CHF', 'PORT FEE']);
// });

test('it should NOT calculate the jfkChf charge if unit != CJFK1, CJFK2', () => {
    const { result } = renderHook(() => useJfkChfCharge('02600000000', 'CEWR1', 10));
    const { amount, types } = result.current;
    expect(amount).toBe(0.00);
    expect(types).toEqual([]);
});

test('it should NOT calculate the jfkChf charge if the awb prefix is in the awbsMap', () => {
    const { result } = renderHook(() => useJfkChfCharge('02600000000', 'CJFK1', 100));
    const { amount, types } = result.current;
    expect(amount).toBe(0.00);
    expect(types).toEqual([]);
});