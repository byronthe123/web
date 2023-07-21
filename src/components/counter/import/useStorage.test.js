import {renderHook} from '@testing-library/react-hooks';
import useStorge from "./useStorage";

describe('useStorage', () => {
    test('it should calculate storage correctly for storageDays > 0', () => {
        const {result} = renderHook(() => useStorge(3849, 2, 1.85, 185));
        const { dailyStorage, totalStorage } = result.current;
        expect(dailyStorage).toBe(7120.65);
        expect(totalStorage).toBe(14241.3);
    });

    test('it should calculate storage correctly for storageDays === 0', () => {
        const {result} = renderHook(() => useStorge(3849, 0, 1.85, 185));
        const { dailyStorage, totalStorage } = result.current;
        expect(dailyStorage).toBe(7120.65);
        expect(totalStorage).toBe(0);
    });
});

