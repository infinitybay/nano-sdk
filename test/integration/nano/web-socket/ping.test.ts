import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { webSocketUrl } from "../../config";
import { onWebSocketMessage, onWebSocketOpen } from "./helpers";

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
    const ackResponse = Nano.WebSocket.AckResponse().safeParse(data);

    assert(ackResponse.success);
    expect(ackResponse.data.ack).toBe("pong");
    expect(ackResponse.data.id).toBe("integration-ping");
  });
});
