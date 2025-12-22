/* eslint-disable @typescript-eslint/no-explicit-any */
import { spawn } from "child_process";
import { WebSocket } from "ws";

import { WebSocketClient } from "../../../../../src/nano/web-socket/client";

const PORT_UNRESPONSIVE = "50124";

jest.setTimeout(30_000);

beforeEach(() => {
  (global as any).WebSocket = WebSocket;
});

afterEach(() => {
  delete (global as any).WebSocket;
  jest.restoreAllMocks();
});

describe("connection timeout handling", () => {
  test("connection timeout", (done) => {
    const proc = spawn("node", [`${__dirname}/unresponsive-server.js`, PORT_UNRESPONSIVE, "5000"]);

    let lock = false;
    proc.stdout.on("data", () => {
      if (lock) return;
      lock = true;

      const ws = new WebSocketClient(`ws://localhost:${PORT_UNRESPONSIVE}`, undefined, {
        minReconnectionDelay: 50,
        maxReconnectionDelay: 50,
        connectionTimeout: 500,
        maxReconnectionAttempts: 1,
      });

      ws.addEventListener("error", (event) => {
        expect(event.message).toBe("TIMEOUT");
      });

      ws.addEventListener("close", (_event) => {
        if (ws.reconnectionAttempts === 1) {
          setTimeout(() => done(), 5000);
        }
      });
    });
  });
});
