/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocket } from "ws";

import { ErrorEvent, WebSocketClient } from "../../../../../src/nano/web-socket/client";

jest.setTimeout(30_000);

beforeEach(() => {
  (global as any).WebSocket = WebSocket;
});

afterEach(() => {
  delete (global as any).WebSocket;
  jest.restoreAllMocks();
});

describe("immediate connection failures", () => {
  test("immediately-failed connection should not timeout", (done) => {
    const ws = new WebSocketClient("ws://255.255.255.255", undefined, {
      maxReconnectionAttempts: 2,
      connectionTimeout: 500,
    });

    ws.addEventListener("error", (err: ErrorEvent) => {
      if (err.message === "TIMEOUT") {
        throw Error("error");
      }
      if (ws.reconnectionAttempts === 2) {
        setTimeout(() => done(), 500);
      }
      if (ws.reconnectionAttempts > 2) {
        throw Error("error");
      }
    });
  });

  test("immediately-failed connection with 0 maxRetries must not retry", (done) => {
    const ws = new WebSocketClient("ws://255.255.255.255", [], {
      maxReconnectionAttempts: 0,
      connectionTimeout: 2000,
      minReconnectionDelay: 100,
      maxReconnectionDelay: 200,
    });

    let i = 0;
    ws.addEventListener("error", (err) => {
      i++;
      if (err.message === "TIMEOUT") {
        throw Error("error");
      }
      if (i > 1) {
        throw Error("error");
      }
      setTimeout(() => {
        done();
      }, 2100);
    });
  });
});
