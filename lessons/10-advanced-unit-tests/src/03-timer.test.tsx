import React from "react"
import { act, render } from "@testing-library/react"
import { Timer } from "./03-timer"

beforeEach(() => {
  jest
    .useFakeTimers("modern")
    .setSystemTime(new Date("2021-05-03").getTime())
})

afterEach(() => {
  jest
    .useRealTimers()
})

describe("03-timer", () => {
  describe("Timer", () => {
    it("renders a component", () => {
      expect(render(<Timer/>)).toBeDefined()
    })

    it("renders current datetime by default", () => {
      const { getByTestId } = render(<Timer />)
      expect(getByTestId("datetime")).toHaveTextContent("2021-05-03 00:00:00")
    })

    it("does not change datetime until start button is clicked", () => {
      const { getByTestId } = render(<Timer />)
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      expect(getByTestId("datetime")).toHaveTextContent("2021-05-03 00:00:00")
    })

    it("changes datetime each seconds when start button is clicked", () => {
      const {getByTestId, getByText} = render(<Timer />);
      const startButton = getByText("start");
      act(() => {
        startButton.click();
      })

      act(() => {
        jest.advanceTimersByTime(1000)
      })
      expect(getByTestId("datetime")).toHaveTextContent("2021-05-03 00:00:01");
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      expect(getByTestId("datetime")).toHaveTextContent("2021-05-03 00:00:02");
    })

    it("stops updating datetime when stop button is clicked", () => {
      const {getByTestId, getByText} = render(<Timer />);
      const startButton = getByText("start");
      const stopButton = getByText("stop");
      act(() => {
        startButton.click();
      })

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      act(() => {
        stopButton.click();
      })

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(getByTestId("datetime")).toHaveTextContent("2021-05-03 00:00:01");
    })
  })
})
