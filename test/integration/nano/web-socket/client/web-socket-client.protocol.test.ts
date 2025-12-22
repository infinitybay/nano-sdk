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

describe("protocol handling", () => {
  test("websocket protocol", (done) => {
    const anyProtocol = "foobar";
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL, anyProtocol);

    ws.addEventListener("open", () => {
      expect(ws.url.startsWith(URL)).toBe(true);
      expect(ws.protocol).toBe(anyProtocol);
      ws.close();
    });

    ws.addEventListener("close", () => {
      for (const client of wss.clients) {
        client.terminate();
      }
      wss.close(() => {
        setTimeout(done, 500);
      });
    });
  });

  test("undefined websocket protocol", (done) => {
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL, undefined, {});

    ws.addEventListener("open", () => {
      expect(ws.url.startsWith(URL)).toBe(true);
      expect(ws.protocol).toBe("");
      ws.close();
    });

    ws.addEventListener("close", () => {
      wss.close(() => {
        setTimeout(done, 500);
      });
    });
  });

  test("null websocket protocol", (done) => {
    const wss = new WebSocketServer({ port: PORT });

    // @ts-expect-error - null is not allowed but could be passed in vanilla js
    const ws = new WebSocketClient(URL, null, {});
    ws.addEventListener("open", () => {
      expect(ws.url.startsWith(URL)).toBe(true);
      expect(ws.protocol).toBe("");
      ws.close();
    });

    ws.addEventListener("close", () => {
      wss.close(() => {
        setTimeout(done, 100);
      });
    });
  });
});
