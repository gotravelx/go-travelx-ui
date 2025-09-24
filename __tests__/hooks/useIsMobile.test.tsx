import { useIsMobile } from "@/hooks/use-mobile";
import { renderHook, act } from "@testing-library/react";

const MOBILE_BREAKPOINT = 768;

describe("useIsMobile", () => {
  let matchMediaMock: jest.Mock;

  beforeEach(() => {
    matchMediaMock = jest.fn().mockImplementation((query: string) => {
      return {
        matches: window.innerWidth < MOBILE_BREAKPOINT,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });

    // @ts-ignore override global
    window.matchMedia = matchMediaMock;
  });

  it("should return true when screen width < MOBILE_BREAKPOINT", () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should return false when screen width >= MOBILE_BREAKPOINT", () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("should update when window size changes (simulate matchMedia change)", () => {
    window.innerWidth = 500;
    const listeners: Record<string, Function[]> = { change: [] };

    // Custom mock with event listener tracking
    // @ts-ignore
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: window.innerWidth < MOBILE_BREAKPOINT,
      media: `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
      addEventListener: (event: string, cb: Function) => {
        listeners[event] = listeners[event] || [];
        listeners[event].push(cb);
      },
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    // Resize to desktop width
    window.innerWidth = 1024;
    act(() => {
      listeners.change.forEach((cb) => cb());
    });

    expect(result.current).toBe(false);
  });
});
