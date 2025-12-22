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

describe("close before open", () => {
  test("connect and close before establishing connection", (done) => {
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL, undefined, {
      minReconnectionDelay: 100,
      maxReconnectionDelay: 200,
    });

    ws.close(); // closing before establishing connection

    ws.addEventListener("open", () => {
      throw Error("open called");
    });

    let closeCount = 0;
    ws.addEventListener("close", () => {
      closeCount++;
      if (closeCount > 1) {
        throw Error("close should be called once");
      }
    });

    setTimeout(() => {
      // wait a little to be sure no unexpected open or close events happen
      wss.close();
      done();
    }, 1000);
  });
});
