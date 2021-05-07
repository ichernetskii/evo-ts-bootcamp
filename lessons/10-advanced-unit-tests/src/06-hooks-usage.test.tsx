import React from "react"
import { act, render } from "@testing-library/react"
import { mocked } from "ts-jest/utils"
import { Timer } from "./06-hooks-usage"
import { useTimer } from "./04-hooks"

jest.mock("./04-hooks")

const mockUseTimer = mocked(useTimer)
afterEach(() => {
  mockUseTimer.mockReset()
})

describe("06-hooks-usage", () => {
  describe("Timer", () => {
    it("uses hook value by default", () => {

      // mockUseTimer.mockReturnValue({
      //   datetime: "2021-05-07",
      //   start: jest.fn(),
      //   stop: jest.fn(),
      // })
      //
      // const { getByTestId } = render(<Timer />);
      // expect(getByTestId("datetime")).toBe("2021-05-07")
    })
    it.todo("handles click on start button")
    it.todo("handles click on stop button")
  })
})
