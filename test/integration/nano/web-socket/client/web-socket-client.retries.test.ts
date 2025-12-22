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

const maxRetriesTest = (count: number, done: () => void) => {
  const ws = new WebSocketClient(URL, undefined, {
    maxReconnectionAttempts: count,
    maxReconnectionDelay: 200,
  });

  ws.addEventListener("error", () => {
    if (ws.reconnectionAttempts === count) {
      setTimeout(done, 500);
    }
    if (ws.reconnectionAttempts > count) {
      throw Error(`too many retries: ${ws.reconnectionAttempts}`);
    }
  });
};

describe("reconnection attempts", () => {
  test("max retries: 0", (done) => maxRetriesTest(0, done));
  test("max retries: 1", (done) => maxRetriesTest(1, done));
  test("max retries: 5", (done) => maxRetriesTest(5, done));
});
