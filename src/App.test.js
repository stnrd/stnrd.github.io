import React from "react";
import ReactDOM from "react-dom";
import {act} from "react-dom/test-utils";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

// Require after stubbing globals used during render.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const App = require("./App").default;

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

it("renders without crashing", () => {
  const div = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, div);
  });

  act(() => {
    jest.runOnlyPendingTimers();
  });

  act(() => {
    ReactDOM.unmountComponentAtNode(div);
  });
});
