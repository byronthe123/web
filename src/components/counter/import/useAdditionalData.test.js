import { renderHook, act } from "@testing-library/react-hooks";
import useAdditionalData from "./useAdditionalData";
import useLoading from '../../../customHooks/useLoading';
import { disableConsole } from '../../../mockPackages/console';
import _ from 'lodash';

// jest.mock('../../../customHooks/useLoading', () => {
//     return {
//         useLoading: {
//             setLoading: jest.fn()
//         }
//     }
// }); 

disableConsole();
jest.mock('../../../customHooks/useLoading');
useLoading.mockReturnValue({
    setLoading: jest.fn()
});

test('it should return all expected data', () => {
    const { result } = renderHook(() => useAdditionalData('00043670596', 'CEWR1', false, ''));
    const keys = [
        "payments",
        "setPayments",
        "locations",
        "ffms",
        "fhls",
        "fwbs",
        "iscData",
        "clearanceData",
        "handleSelectFfm",
        "stationInfo"
    ];

    for (let i = 0; i < keys.length; i++) {
        expect(result.current[keys[i]]).toBeDefined();
    }
});

test('it should mark all payments and locations as selected by master if NOT manual mode', () => {
    const { result } = renderHook(() => useAdditionalData('00043670596', 'CEWR1', false, ''));
    const { payments } = result.current;
    console.log(result.current);
    for (let i = 0; i < payments.length; i++) {
        if (_.get(payments[i], 's_hawb', '').length === 0) {
            expect(payments[i].selected).toBe(true);
        } else {
            expect(payments[i].selected).toBe(false);
        }
    }
});