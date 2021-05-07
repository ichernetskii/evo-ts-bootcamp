import { act, renderHook } from "@testing-library/react-hooks"
import { useEventListener } from "./05-hooks-task"

describe("05-hooks-task", () => {
  describe("useEventListener", () => {
    const eventName = "click"
    const handler = jest.fn()
    const listeners = new Map<string, (...args: any[]) => void>()
    const element = document.createElement("div")

    beforeEach(() => {
      spyOn(element, "addEventListener").and.callFake((eventName: string, handler: (...args: any[]) => void) => {
        listeners.set(eventName, handler)
      })

      spyOn(element, "removeEventListener").and.callFake((eventName: string, handler: (...args: any[]) => void) => {
        listeners.delete(eventName)
      })
    })

    afterEach(() => {
      listeners.clear()
      handler.mockReset()
    })

    it("renders a hook", () => {
      expect(renderHook(() => useEventListener({eventName, element, handler}))).toBeDefined();
    })

    it("adds correct event listener", () => {
      renderHook(() => useEventListener({eventName, element, handler}))
      expect(listeners.has("click")).toBeTruthy()
    })

    it("removes attached event listener", () => {
      const { unmount } = renderHook(() => useEventListener({eventName, element, handler}));
      unmount()
      expect(listeners.has("click")).toBeFalsy()
    })

    it("re-attaches event listener if event name is changed", () => {
      const { rerender } = renderHook(useEventListener, {
        initialProps: { eventName, handler, element }
      });

      rerender({
        eventName: "new event",
        element,
        handler
      })

      expect(listeners.has("new event")).toBe(true);
    })

    it("does not re-attach event listener if event handler is changed", () => {
      const foo = jest.fn();

      const { rerender } = renderHook(useEventListener, {
        initialProps: { eventName, handler, element }
      });

      rerender({
        eventName,
        element,
        handler: foo
      })

      expect(element.addEventListener).toHaveBeenCalledTimes(1);
    })
  })
})
