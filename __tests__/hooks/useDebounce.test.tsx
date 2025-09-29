import { useDebounce } from "@/hooks/use-debounce";
import { renderHook, act } from "@testing-library/react";

jest.useFakeTimers();

describe("useDebounce", () => {
  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));
    expect(result.current).toBe("hello");
  });

  it("should update value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 500 } }
    );

    // Change value
    rerender({ value: "b", delay: 500 });

    // Still old value before delay
    expect(result.current).toBe("a");

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should now be updated
    expect(result.current).toBe("b");
  });

  it("should cancel previous timeout if value changes quickly", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 500 } }
    );

    // Change value before debounce completes
    rerender({ value: "b", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Change again
    rerender({ value: "c", delay: 500 });

    // Still initial until new delay completes
    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("c");
  });
});
