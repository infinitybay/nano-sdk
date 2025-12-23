import { Nano } from "../../../../src";
import { WebSocketClient } from "../../../../src/nano/web-socket";
import { assert } from "../../../assert";
import { webSocketUrl } from "../../config";
import { onWebSocketClientAck, onWebSocketMessage, onWebSocketOpen } from "./helpers";

describe("WebSocket ping integration", () => {
  let ws: WebSocket;

  afterEach(() => {
    ws.close();
  });

  test("responds with pong acknowledgement", async () => {
    ws = new WebSocket(webSocketUrl);

    await onWebSocketOpen(ws);

    const request: Nano.WebSocket.PingRequest = {
      action: "ping",
      id: "integration-ping",
    };
    ws.send(JSON.stringify(request));

    const message = await onWebSocketMessage(ws);
    const data = JSON.parse(message.data);
    const response = Nano.WebSocket.AckResponse().safeParse(data);

    assert(response.success);
    expect(response.data.ack).toBe("pong");
    expect(response.data.id).toBe("integration-ping");
  });
});

describe("WebSocketClient ping integration", () => {
  let ws: WebSocketClient;

  afterEach(() => {
    ws.close();
  });

  test("responds with pong acknowledgement", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request: Nano.WebSocket.PingRequest = {
      action: "ping",
      id: "integration-ping",
    };
    ws.send(JSON.stringify(request));

    const response = await onWebSocketClientAck("pong", ws);
    expect(response.ack).toBe("pong");
    expect(response.id).toBe("integration-ping");
  });
});
