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

describe("message flow", () => {
  test("connect, send, receive, close", (done) => {
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

    expect.assertions(7);

    const ws = new WebSocketClient(URL, anyProtocol, {
      minReconnectionDelay: 100,
      maxReconnectionDelay: 200,
    });
    ws.binaryType = "arraybuffer";
    expect(ws.readyState).toBe(ReadyStates.Connecting);

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
  });

  test("connect, send, receive, reconnect", (done) => {
    const anyMessageText = "hello";
    const anyProtocol = "foobar";

    const wss = new WebSocketServer({ port: PORT });
    wss.on("connection", (ws: WebSocket) => {
      ws.on("message", (msg) => {
        ws.send(msg);
      });
    });

    const totalRounds = 3;
    let currentRound = 0;

    // 6 = 3 * 2 open
    // 8 = 2 * 3 message + 2 reconnect
    // 7 = 2 * 3 close + 1 closed
    expect.assertions(21);

    const ws = new WebSocketClient(URL, anyProtocol, {
      minReconnectionDelay: 100,
      maxReconnectionDelay: 200,
    });
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      currentRound++;
      expect(ws.protocol).toBe(anyProtocol);
      expect(ws.readyState).toBe(ReadyStates.Open);
      ws.send(anyMessageText);
    };

    ws.onmessage = (msg) => {
      assert(msg.data instanceof ArrayBuffer);
      expect(new TextDecoder().decode(msg.data)).toBe(anyMessageText);
      if (currentRound < totalRounds) {
        ws.reconnect(1000, "reconnect");
        expect(ws.reconnectionAttempts).toBe(0);
      } else {
        ws.close(1000, "close");
      }
      expect(ws.readyState).toBe(ReadyStates.Closing);
    };

    ws.addEventListener("close", (event) => {
      expect(ws.url.startsWith(URL)).toBe(true);
      if (currentRound >= totalRounds) {
        expect(ws.readyState).toBe(ReadyStates.Closed);
        wss.close();
        setTimeout(() => done(), 1000);
        expect(event.reason).toBe("close");
      } else {
        expect(event.reason).toBe("reconnect");
      }
    });
  });
});
