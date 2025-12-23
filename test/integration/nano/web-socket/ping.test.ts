import { Nano } from "../../../../src";
import { WebSocketClient } from "../../../../src/nano/web-socket";
import { webSocketUrl } from "../../config";
import { onWebSocketClientAck, onWebSocketOpen } from "./helpers";

describe("WebSocket ping integration", () => {
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
