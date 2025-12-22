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

describe("client configuration and defaults", () => {
  test("global WebSocket is used if available", (done) => {
    const ws = new WebSocketClient(URL, undefined, { maxReconnectionAttempts: 0 });
    ws.onerror = () => {
      // @ts-expect-error - accessing private property
      expect(ws._socket instanceof WebSocket).toBe(true);
      done();
    };
  });

  test("getters when not ready", (done) => {
    const ws = new WebSocketClient(URL, undefined, {
      maxReconnectionAttempts: 0,
    });
    expect(ws.bufferedAmount).toBe(0);
    expect(ws.protocol).toBe("");
    expect(ws.url).toBe("");
    expect(ws.extensions).toBe("");
    expect(ws.binaryType).toBe("blob");

    ws.onerror = () => {
      done();
    };
  });

  test("pass WebSocket via options", (done) => {
    delete (global as any).WebSocket;
    const ws = new WebSocketClient(URL, undefined, {
      webSocketClass: WebSocket,
      maxReconnectionAttempts: 0,
    });
    ws.onerror = () => {
      // @ts-expect-error - accessing private property
      expect(ws._socket instanceof WebSocket).toBe(true);
      done();
    };
  });

  test("URL provider", async () => {
    const url = "example.com";
    const ws = new WebSocketClient(URL, undefined, { maxReconnectionAttempts: 0 });

    // @ts-expect-error - accessing private property
    expect(await ws.getNextUrl(url)).toBe(url);

    // @ts-expect-error - accessing private property
    expect(await ws.getNextUrl(() => url)).toBe(url);

    // @ts-expect-error - accessing private property
    expect(await ws.getNextUrl(() => Promise.resolve(url))).toBe(url);

    // @ts-expect-error - accessing private property
    expect(() => ws.getNextUrl(123)).toThrow();

    // @ts-expect-error - accessing private property
    expect(() => ws.getNextUrl(() => 123)).toThrow();
  });
});
