import { renderHook, act } from "@testing-library/react-hooks";
import useNavigation from "./useNavigation";

test('it should allow navigation to stepId 1', () => {
    const { result } = renderHook(() => useNavigation());
    let success;
    act(() => {
        success = result.current('1');
    });
    expect(success).toBe(true);


});