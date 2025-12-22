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

describe("property accessors", () => {
  test("getters", (done) => {
    const anyProtocol = "foobar";
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL, anyProtocol, { maxReconnectionDelay: 100 });

    ws.addEventListener("open", () => {
      expect(ws.protocol).toBe(anyProtocol);
      expect(ws.extensions).toBe("");
      expect(ws.bufferedAmount).toBe(0);
      expect(ws.binaryType).toBe("blob");
      ws.close();
    });

    ws.addEventListener("close", () => {
      wss.close();
      setTimeout(() => done(), 500);
    });
  });

  test("binaryType", (done) => {
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL, undefined, { minReconnectionDelay: 0 });

    expect(ws.binaryType).toBe("blob");
    ws.binaryType = "arraybuffer";
    ws.addEventListener("open", () => {
      expect(ws.binaryType).toBe("arraybuffer");
      ws.binaryType = "nodebuffer";
      expect(ws.binaryType).toBe("nodebuffer");
      ws.close();
    });

    ws.addEventListener("close", () => {
      wss.close();
      setTimeout(() => done(), 500);
    });
  });
});
