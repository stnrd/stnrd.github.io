import "jest-canvas-mock";

// Jest (jsdom) doesn't always expose TextEncoder/TextDecoder even when Node does.
// Some transitive deps (e.g. undici via cheerio/enzyme) require these globals.
import {TextDecoder, TextEncoder} from "util";
import {ReadableStream} from "stream/web";
import {MessageChannel, MessagePort} from "worker_threads";

if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = TextDecoder;
}
if (typeof globalThis.ReadableStream === "undefined") {
  globalThis.ReadableStream = ReadableStream;
}
if (typeof globalThis.MessagePort === "undefined") {
  globalThis.MessagePort = MessagePort;
}
if (typeof globalThis.MessageChannel === "undefined") {
  globalThis.MessageChannel = MessageChannel;
}

// Use require() so the polyfill above runs before enzyme (and its transitive deps)
// are evaluated.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {configure} = require("enzyme");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Adapter = require("enzyme-adapter-react-16");

configure({adapter: new Adapter()});

// `colorthief` pulls in a Node-only dependency (`sharp`) in test environments,
// which isn't needed for our unit tests. Mock it to keep Jest lightweight.
jest.mock("colorthief", () => {
  return function ColorThief() {
    return {
      getColor: () => [0, 0, 0],
      getPalette: () => []
    };
  };
});

// Stub `matchMedia` for components that read prefers-color-scheme, etc.
if (typeof window !== "undefined") {
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
}
