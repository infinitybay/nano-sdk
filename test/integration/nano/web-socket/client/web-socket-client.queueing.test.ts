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

describe("message queueing", () => {
  test("enqueue messages", (done) => {
    const ws = new WebSocketClient(URL, undefined, {
      maxReconnectionAttempts: 0,
    });
    const count = 10;
    const message = "message";
    for (let i = 0; i < count; i++) ws.send(message);

    ws.onerror = () => {
      expect(ws.bufferedAmount).toBe(message.length * count);
      done();
    };
  });

  test("respect maximum enqueued messages", (done) => {
    const queueSize = 2;
    const ws = new WebSocketClient(URL, undefined, {
      maxReconnectionAttempts: 0,
      maxEnqueuedMessages: queueSize,
    });
    const count = 10;
    const message = "message";
    for (let i = 0; i < count; i++) ws.send(message);

    ws.onerror = () => {
      expect(ws.bufferedAmount).toBe(message.length * queueSize);
      done();
    };
  });

  test("enqueue messages before websocket initialization with expected order", (done) => {
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL);

    const messages = ["message1", "message2", "message3"];

    messages.forEach((m) => ws.send(m));
    // @ts-expect-error - accessing private field
    expect(ws._messageQueue.length).toBe(messages.length);

    expect(ws.bufferedAmount).toBe(messages.reduce((a, m) => a + m.length, 0));

    let i = 0;
    wss.on("connection", (client: WebSocket) => {
      client.on("message", (data) => {
        const text = data.toString();
        if (text === "ok") {
          expect(i).toBe(messages.length);
          ws.close();
        } else {
          expect(text).toBe(messages[i]);
          i++;
        }
      });
    });

    ws.addEventListener("open", () => {
      ws.send("ok");
    });

    ws.addEventListener("close", () => {
      wss.close(() => {
        done();
      });
    });
  });
});
