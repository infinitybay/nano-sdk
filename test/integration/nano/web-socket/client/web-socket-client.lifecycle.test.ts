/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocket, WebSocketServer } from "ws";

import { ReadyStates, WebSocketClient } from "../../../../../src/nano/web-socket/client";
import { assert } from "../../../../assert";

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

describe("connection lifecycle", () => {
  test("calling to close multiple times", (done) => {
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL, undefined, {});

    ws.addEventListener("open", () => {
      ws.close();
      ws.close();
      ws.close();
    });

    ws.addEventListener("close", () => {
      wss.close();
      setTimeout(() => done(), 500);
    });
  });

  test("calling to reconnect when not ready", (done) => {
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL, undefined, {});
    ws.reconnect();
    ws.reconnect();

    ws.addEventListener("open", () => {
      ws.close();
    });

    ws.addEventListener("close", () => {
      wss.close();
      setTimeout(() => done(), 500);
    });
  });

  test("start closed", (done) => {
    const anyMessageText = "hello";
    const anyProtocol = "foobar";

    const wss = new WebSocketServer({ port: PORT });
    wss.on("connection", (ws: WebSocket) => {
      ws.on("message", (msg) => {
        ws.send(msg);
      });
    });
    wss.on("error", () => {
      throw Error("error");
    });

    expect.assertions(8);

    const ws = new WebSocketClient(URL, anyProtocol, {
      minReconnectionDelay: 100,
      maxReconnectionDelay: 200,
      startClosed: true,
    });
    ws.binaryType = "arraybuffer";

    expect(ws.readyState).toBe(ReadyStates.Closed);

    setTimeout(() => {
      expect(ws.readyState).toBe(ReadyStates.Closed);

      ws.reconnect();

      ws.addEventListener("open", () => {
        expect(ws.protocol).toBe(anyProtocol);
        expect(ws.readyState).toBe(ReadyStates.Open);
        ws.send(anyMessageText);
      });

      ws.addEventListener("message", (msg) => {
        assert(msg.data instanceof ArrayBuffer);
        expect(new TextDecoder().decode(msg.data)).toBe(anyMessageText);
        ws.close(1000, "");
        expect(ws.readyState).toBe(ReadyStates.Closing);
      });

      ws.addEventListener("close", () => {
        expect(ws.readyState).toBe(ReadyStates.Closed);
        expect(ws.url.startsWith(URL)).toBe(true);
        wss.close();
        setTimeout(() => done(), 1000);
      });
    }, 300);
  });
});
