import { renderHook } from "@testing-library/react-hooks";
import useHold from "./useHold";
import { Location } from './interfaces';

test('it should return true if there is a hold', () => {
    const locations: Array<Location> = [{
        selected: true,
        b_comat: false,
        s_hawb: '',
        i_pieces: 1,
        b_customs_hold: true,
        b_usda_hold: false,
        b_hold: false
    }, {
        selected: true,
        b_comat: false,
        s_hawb: '',
        i_pieces: 1,
        b_customs_hold: false,
        b_usda_hold: false,
        b_hold: false
    }];

    const { result } = renderHook(() => useHold(locations));

    expect(result.current.hold).toBe(true);
});

test('it should return false if there is no hold', () => {
    const locations: Array<Location> = [{
        selected: false,
        b_comat: false,
        s_hawb: '',
        i_pieces: 1,
        b_customs_hold: true,
        b_usda_hold: false,
        b_hold: false
    }, {
        selected: true,
        b_comat: false,
        s_hawb: '',
        i_pieces: 1,
        b_customs_hold: false,
        b_usda_hold: false,
        b_hold: false
    }];

    const { result } = renderHook(() => useHold(locations));

    expect(result.current.hold).toBe(false);
});