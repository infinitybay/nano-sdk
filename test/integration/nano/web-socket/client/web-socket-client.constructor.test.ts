/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocket } from "ws";

import { WebSocketClient } from "../../../../../src/nano/web-socket/client";

const PORT = 50123;
const URL = `ws://localhost:${PORT}`;

jest.setTimeout(30_000);

beforeEach(() => {
  (global as any).WebSocket = WebSocket;
});

afterEach(() => {
  delete (global as any).WebSocket;
  jest.restoreAllMocks();
});

describe("constructor validation", () => {
  test("throws with invalid constructor", () => {
    delete (global as any).WebSocket;
    expect(() => {
      new WebSocketClient(URL, undefined, { webSocketClass: 123 as any, maxReconnectionAttempts: 0 });
    }).toThrow();
  });

  test("throws with missing constructor", () => {
    delete (global as any).WebSocket;
    expect(() => {
      new WebSocketClient(URL, undefined, { maxReconnectionAttempts: 0 });
    }).toThrow();
  });

  test("throws with non-constructor object", () => {
    (global as any).WebSocket = {};
    expect(() => {
      new WebSocketClient(URL, undefined, { maxReconnectionAttempts: 0 });
    }).toThrow();
  });

  test("throws if not created with `new`", () => {
    expect(() => {
      // @ts-expect-error - not created with new
      WebSocketClient(URL, undefined);
    }).toThrow(TypeError);
  });
});
