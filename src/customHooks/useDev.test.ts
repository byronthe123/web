import { renderHook } from "@testing-library/react-hooks";
import { IUser } from "../globals/interfaces";
import useDev from "./useDev";

test('useDev should return true if a user is part of dev', () => {
    const devUser: IUser = {
        id: 0,
        displayName: "",
        s_email: "byron@choice.aero",
        i_access_level: 0,
        s_unit: "",
        accessMap: {},
        b_airline: false,
        s_airline_codes: [],
        s_guid: '',
        pinCreated: false,
        localAccountId: '', 
        s_phone_num: '',
        sharedVaultAccess: false
    }
    const { result } = renderHook(() => useDev(devUser));
    expect(result.current).toBe(true);
});

test('useDev should return false if a user is part of dev', () => {
    const devUser: IUser = {
        id: 0,
        displayName: "",
        s_email: "test@choice.aero",
        i_access_level: 0,
        s_unit: "",
        accessMap: {},
        b_airline: false,
        s_airline_codes: [],
        s_guid: '',
        pinCreated: false,
        localAccountId: '', 
        s_phone_num: '',
        sharedVaultAccess: false
    }
    const { result } = renderHook(() => useDev(devUser));
    expect(result.current).toBe(false);
});