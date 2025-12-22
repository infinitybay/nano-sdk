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

describe("reconnect after close", () => {
  test("reconnect after closing", (done) => {
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL, undefined, {
      minReconnectionDelay: 100,
      maxReconnectionDelay: 200,
    });

    let i = 0;
    ws.addEventListener("open", () => {
      i++;
      if (i === 1) {
        ws.close();
      }
      if (i === 2) {
        ws.close();
      }
      if (i > 2) {
        throw Error("no more expected reconnections");
      }
    });

    ws.addEventListener("close", () => {
      if (i === 1)
        setTimeout(() => {
          ws.reconnect();
        }, 1000);
      if (i === 2) {
        wss.close(() => {
          setTimeout(() => {
            done();
          }, 1000);
        });
      }
      if (i > 2) {
        throw Error("no more expected reconnections");
      }
    });
  });
});
