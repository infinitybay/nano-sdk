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

describe("event listener handling", () => {
  test("level0 event listeners are kept after reconnect", (done) => {
    const ws = new WebSocketClient(URL, undefined, {
      maxReconnectionAttempts: 4,
      reconnectionDelayGrowFactor: 1.2,
      maxReconnectionDelay: 20,
      minReconnectionDelay: 10,
    });

    const handleOpen = () => undefined;
    const handleClose = () => undefined;
    const handleMessage = () => undefined;
    const handleError = () => {
      expect(ws.onopen).toBe(handleOpen);
      expect(ws.onclose).toBe(handleClose);
      expect(ws.onmessage).toBe(handleMessage);
      expect(ws.onerror).toBe(handleError);
      if (ws.reconnectionAttempts === 4) {
        done();
      }
    };

    ws.onopen = handleOpen;
    ws.onclose = handleClose;
    ws.onmessage = handleMessage;
    ws.onerror = handleError;
  });

  test("level2 event listeners", (done) => {
    const anyProtocol = "foobar";
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL, anyProtocol, {});

    ws.addEventListener("open", () => {
      expect(ws.protocol).toBe(anyProtocol);
      expect(ws.extensions).toBe("");
      expect(ws.bufferedAmount).toBe(0);
      ws.close();
    });

    const fail = () => {
      throw Error("fail");
    };
    // @ts-expect-error - invalid event type
    ws.addEventListener("unknown1", fail);
    ws.addEventListener("open", fail);
    ws.addEventListener("open", fail);
    ws.removeEventListener("open", fail);
    // @ts-expect-error - invalid event type
    ws.removeEventListener("unknown2", fail);

    ws.addEventListener("close", () => {
      wss.close(() => {
        setTimeout(() => done(), 500);
      });
    });
  });

  // https://developer.mozilla.org/en-US/docs/Web/API/EventListener/handleEvent
  test("level2 event listeners using object with handleEvent", (done) => {
    const anyProtocol = "foobar";
    const wss = new WebSocketServer({ port: PORT });
    const ws = new WebSocketClient(URL, anyProtocol, {});

    ws.addEventListener("open", {
      handleEvent: () => {
        expect(ws.protocol).toBe(anyProtocol);
        expect(ws.extensions).toBe("");
        expect(ws.bufferedAmount).toBe(0);
        ws.close();
      },
    });

    const fail = {
      handleEvent: () => {
        throw Error("fail");
      },
    };

    // @ts-expect-error - invalid event type
    ws.addEventListener("unknown1", fail);

    ws.addEventListener("open", fail);

    ws.addEventListener("open", fail);

    ws.removeEventListener("open", fail);

    // @ts-expect-error - invalid event type
    ws.removeEventListener("unknown2", fail);

    ws.addEventListener("close", {
      handleEvent: () => {
        wss.close();
        setTimeout(() => done(), 500);
      },
    });
  });
});
