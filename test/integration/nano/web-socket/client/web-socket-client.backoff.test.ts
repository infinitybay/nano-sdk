/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocket, WebSocketServer } from "ws";

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

describe("reconnection backoff", () => {
  test("reconnection delay grow factor", (done) => {
    const ws = new WebSocketClient("wss://255.255.255.255", [], {
      minReconnectionDelay: 100,
      maxReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 2,
    });
    // @ts-expect-error - accessing private field
    expect(ws.getNextReconnectionDelay()).toBe(0);
    const expected = [100, 200, 400, 800, 1000, 1000];
    let retry = 0;
    ws.addEventListener("error", () => {
      // @ts-expect-error - accessing private field
      expect(ws.getNextReconnectionDelay()).toBe(expected[retry]);
      retry++;
      if (retry >= expected.length) {
        ws.close();
        setTimeout(() => {
          done();
        }, 2000);
      }
    });
  });

  test("minUptime", (done) => {
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL, [], {
      minReconnectionDelay: 100,
      maxReconnectionDelay: 2000,
      reconnectionDelayGrowFactor: 2,
      minUptime: 500,
    });
    const expectedDelays = [100, 200, 400, 800, 100, 100];
    const expectedRetryCount = [1, 2, 3, 4, 1, 1];
    let connectionCount = 0;
    wss.on("connection", (client: WebSocket) => {
      connectionCount++;
      if (connectionCount <= expectedDelays.length) {
        setTimeout(() => {
          client.close();
        }, connectionCount * 100);
      }
    });
    let openCount = 0;
    ws.addEventListener("open", () => {
      openCount++;
      if (openCount > expectedDelays.length) {
        ws.close();
        wss.close(() => {
          setTimeout(() => {
            done();
          }, 1000);
        });
      }
    });
    let closeCount = 0;
    ws.addEventListener("close", () => {
      if (closeCount < expectedDelays.length) {
        // @ts-expect-error - accessing private field
        expect(ws.getNextReconnectionDelay()).toBe(expectedDelays[closeCount]);
        // @ts-expect-error - accessing private field
        expect(ws._reconnectionAttempts).toBe(expectedRetryCount[closeCount]);
        closeCount++;
      }
    });
  });
});
