import { renderHook } from "@testing-library/react-hooks";
import useMinCharges from "./useMinCharges";

test('it should calculate isc from airlineDataWithDetail if it exists', () => {
    const iscData = {
        airlineDataWithDetail: {
            AirlineMappingDetail: {
                f_import_isc_cost: 150
            }
        },
        corpStationData: {
            f_import_isc_cost: 125
        }
    }
    const { result } = renderHook(() => useMinCharges(false, iscData, false, null, 'CEWR1'));
    expect(result.current.isc).toBe(150);
});

test('it should calculate isc from corpStationData if airlineDataWithDetail does NOT exists', () => {
    const iscData = {
        airlineDataWithDetail: {
            AirlineMappingDetail: {
                f_import_isc_cost: null
            }
        },
        corpStationData: {
            f_import_isc_cost: 145
        }
    }

    const { result } = renderHook(() => useMinCharges(false, iscData, false, null, 'CJFK2'));
    expect(result.current.isc).toBe(145);    
});

test('it should calculate isc based on current values if date is after 02/01/2022 and s_unit is not JFK', () => {
    const iscData = {
        airlineDataWithDetail: {
            AirlineMappingDetail: {
                f_import_isc_cost: 170
            }
        },
        corpStationData: {
            f_import_isc_cost: 170
        }
    }

    const { result } = renderHook(() => useMinCharges(false, iscData, false, '02/01/2022', 'CEWR1'));
    expect(result.current.isc).toBe(170);
});

test('it should calculate isc based on current values if date is before 02/01/2022', () => {
    const iscData = {
        airlineDataWithDetail: {
            AirlineMappingDetail: {
                f_import_isc_cost: 170
            }
        },
        corpStationData: {
            f_import_isc_cost: 170
        }
    }

    const { result } = renderHook(() => useMinCharges(false, iscData, false, '1/14/2022', 'CEWR1'));
    expect(result.current.isc).toBe(145);
});

test('it should calculate isc based on current values if date if s_unit is JFK', () => {
    const iscData = {
        airlineDataWithDetail: {
            AirlineMappingDetail: {
                f_import_isc_cost: 170
            }
        },
        corpStationData: {
            f_import_isc_cost: 170
        }
    }

    const { result } = renderHook(() => useMinCharges(false, iscData, false, '02/14/2022', 'CJFK1'));
    expect(result.current.isc).toBe(145);
});

test('it should calculate isc from corpStationData if airlineDataWithDetail does NOT exists', () => {
    const iscData = {
        corpStationData: {
            f_import_isc_cost: 125
        }
    }

    const { result } = renderHook(() => useMinCharges(false, iscData, false, null, 'CEWR1'));
    expect(result.current.isc).toBe(125);    
});

test('it should calculate ISC as 0 if postEntryFee === true', () => {
    const iscData = {
        airlineDataWithDetail: {
            AirlineMappingDetail: {
                f_import_isc_cost: null
            }
        },
        corpStationData: {
            f_import_isc_cost: 125
        }
    }

    const { result } = renderHook(() => useMinCharges(true, iscData, false, null, 'CJFK1'));
    expect(result.current.isc).toBe(0);    
});

test('it should calculate ISC as 0 if voidIsc === true', () => {
    const iscData = {
        airlineDataWithDetail: {
            AirlineMappingDetail: {
                f_import_isc_cost: null
            }
        },
        corpStationData: {
            f_import_isc_cost: 125
        }
    }

    const { result } = renderHook(() => useMinCharges(false, iscData, true, null, 'CJFK1'));
    expect(result.current.isc).toBe(0);    
});

test('it should calculate f_import_per_kg and f_import_min_charge  from airlineDataWithDetail if it exists', () => {
    const iscData = {
        airlineDataWithDetail: {
            AirlineMappingDetail: {
                f_import_isc_cost: 150,
                f_import_per_kg: 1.5,
                f_import_min_charge: 135
            }
        },
        corpStationData: {
            f_import_isc_cost: 125
        }
    }
    const { result } = renderHook(() => useMinCharges(false, iscData, false, null, 'CJFK1'));
    expect(result.current.f_import_per_kg).toBe(1.5);
    expect(result.current.f_import_min_charge).toBe(135);
});

test('it should calculate f_import_per_kg and f_import_min_charge  from corpStationData if AirlineMappingDetail does NOT exists', () => {
    const iscData = {
        corpStationData: {
            f_import_isc_cost: 125,
            f_import_per_kg: 1.7,
            f_import_min_charge: 225
        }
    }

    const { result } = renderHook(() => useMinCharges(false, iscData, false, null, 'CJFK1'));
    expect(result.current.f_import_per_kg).toBe(1.7);
    expect(result.current.f_import_min_charge).toBe(225);
});