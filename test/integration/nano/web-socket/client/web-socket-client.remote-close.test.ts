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

describe("remote close handling", () => {
  test("closing from the other side should reconnect", (done) => {
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL, undefined, {
      minReconnectionDelay: 100,
      maxReconnectionDelay: 200,
    });

    const max = 3;
    let i = 0;
    wss.on("connection", (client: WebSocket) => {
      i++;
      if (i < max) {
        // closing client from server side should trigger a reconnection
        setTimeout(() => client.close(), 100);
      }
      if (i === max) {
        // will close from client side
      }
      if (i > max) {
        throw Error("unexpected connection");
      }
    });

    let j = 0;
    ws.addEventListener("open", () => {
      j++;
      if (j === max) {
        ws.close();
        // wait a little to ensure no new connections are opened
        setTimeout(() => {
          wss.close(() => {
            done();
          });
        }, 500);
      }
      if (j > max) {
        throw Error("unexpected open");
      }
    });
  });

  test("closing from the other side should allow to keep closed", (done) => {
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL, undefined, {
      minReconnectionDelay: 100,
      maxReconnectionDelay: 200,
    });

    const codes = [4000, 4001];

    let i = 0;
    wss.on("connection", (client: WebSocket) => {
      if (i > codes.length) {
        throw Error("error");
      }
      client.close(codes[i], String(codes[i]));
      i++;
    });

    ws.addEventListener("close", (e) => {
      if (e.code === codes[0]) {
        // do nothing, will reconnect
      }
      if (e.code === codes[1] && e.reason === String(codes[1])) {
        // close connection (and keep closed)
        ws.close();
        setTimeout(() => {
          wss.close(() => done());
        }, 1000);
      }
    });
  });
});
