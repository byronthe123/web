import { renderHook } from "@testing-library/react-hooks";
import useComatGo from "./useComat";

test('it should return false when there are no selected locations with b_comat === true', () => {
    const locations = [{
        selected: true,
        b_comat: null
    }, {
        selected: true,
        b_comat: false
    }];

    const { result } = renderHook(() => useComatGo(locations));
    const { comat, generalOrder } = result.current;
    expect(comat).toBe(false);
    expect(generalOrder).toBe(false);
});

test('it should return false when there are no selected locations', () => {
    const { result } = renderHook(() => useComatGo([]));
    const { comat, generalOrder } = result.current;
    expect(comat).toBe(false);
    expect(generalOrder).toBe(false);
});

test('it should return false when NOT ALL selected locations have b_comat === true or b_general_order === true', () => {
    const locations = [{
        selected: false,
        b_comat: false,
        b_general_order: false
    },{
        selected: true,
        b_comat: true,
        b_general_order: true
    },{
        selected: true,
        b_comat: false,
        b_general_order: false
    }]
    const { result } = renderHook(() => useComatGo(locations));
    const { comat, generalOrder } = result.current;
    expect(comat).toBe(false);
    expect(generalOrder).toBe(false);
});

test('it should return true when ALL selected locations have b_comat === true', () => {
    const locations = [{
        selected: false,
        b_comat: false,
        b_general_order: false
    },{
        selected: true,
        b_comat: true,
        b_general_order: true
    },{
        selected: true,
        b_comat: true,
        b_general_order: false
    }]
    const { result } = renderHook(() => useComatGo(locations));
    const { comat, generalOrder } = result.current;
    expect(comat).toBe(true);
    expect(generalOrder).toBe(false);
});

test('it should return true when ALL selected locations have b_general_order === true', () => {
    const locations = [{
        selected: false,
        b_comat: false,
        b_general_order: false
    },{
        selected: true,
        b_comat: true,
        b_general_order: true
    },{
        selected: true,
        b_comat: false,
        b_general_order: true
    }]
    const { result } = renderHook(() => useComatGo(locations));
    const { comat, generalOrder } = result.current;
    expect(comat).toBe(false);
    expect(generalOrder).toBe(true);
});
