import { renderHook, act } from "@testing-library/react-hooks";
import ActiveUser from "../queue/ActiveUser";
import useAwbs from "./useAwbs";

test('useAwbs', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAwbs('BYRON@CHOICE.AERO', 'CEWR1', 'IMPORT', false));
    expect(result.current[0]).toBe(true);
    
    await waitForNextUpdate();
    expect(result.current[1].length).toBe(3);
    expect(result.current[0]).toBe(false);
});