import { Nano } from "../../../../src";
import { WebSocketClient } from "../../../../src/nano/web-socket";
import { webSocketUrl } from "../../config";
import { onWebSocketClientAck, onWebSocketClientTopic, onWebSocketOpen } from "./helpers";

jest.setTimeout(120_000);

describe("WebSocket new_unconfirmed_block integration", () => {
  let ws: WebSocketClient;

  afterEach(() => {
    ws.close();
  });

  test("subscribes, unsubscribes and receives ack message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request1: Nano.WebSocket.NewUnconfirmedBlockRequest = {
      action: "subscribe",
      ack: true,
      id: "integration-new-unconfirmed-block",
      topic: "new_unconfirmed_block",
    };
    ws.send(JSON.stringify(request1));

    const response1 = await onWebSocketClientAck("subscribe", ws);

    const request2: Nano.WebSocket.NewUnconfirmedBlockRequest = {
      action: "unsubscribe",
      ack: true,
      id: "integration-new-unconfirmed-block",
      topic: "new_unconfirmed_block",
    };
    ws.send(JSON.stringify(request2));

    const response2 = await onWebSocketClientAck("unsubscribe", ws);

    expect(response1.ack).toBe("subscribe");
    expect(response2.ack).toBe("unsubscribe");
    expect(response1.id).toBe("integration-new-unconfirmed-block");
    expect(response2.id).toBe("integration-new-unconfirmed-block");
  });

  test("subscribes and receives confirmation message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request: Nano.WebSocket.NewUnconfirmedBlockRequest = {
      action: "subscribe",
      topic: "new_unconfirmed_block",
    };
    ws.send(JSON.stringify(request));

    const response = await onWebSocketClientTopic("new_unconfirmed_block", ws);

    expect(response.topic).toBe("new_unconfirmed_block");
    expect(response.hash).toBeDefined();
  });
});
