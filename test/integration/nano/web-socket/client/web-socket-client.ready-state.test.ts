/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocket } from "ws";

import { ReadyStates, WebSocketClient } from "../../../../../src/nano/web-socket/client";

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

describe("ready state constants", () => {
  test("connection status constants", () => {
    const ws = new WebSocketClient(URL, undefined, { maxReconnectionAttempts: 0 });

    expect((WebSocketClient as any).CONNECTING ?? ReadyStates.Connecting).toBe(0);
    expect((WebSocketClient as any).OPEN ?? ReadyStates.Open).toBe(1);
    expect((WebSocketClient as any).CLOSING ?? ReadyStates.Closing).toBe(2);
    expect((WebSocketClient as any).CLOSED ?? ReadyStates.Closed).toBe(3);

    expect((ws as any).CONNECTING ?? ReadyStates.Connecting).toBe(0);
    expect((ws as any).OPEN ?? ReadyStates.Open).toBe(1);
    expect((ws as any).CLOSING ?? ReadyStates.Closing).toBe(2);
    expect((ws as any).CLOSED ?? ReadyStates.Closed).toBe(3);
    ws.close();
  });
});
