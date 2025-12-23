import { Nano } from "../../../../src";
import { WebSocketClient } from "../../../../src/nano/web-socket";
import { webSocketUrl } from "../../config";
import { onWebSocketClientAck, onWebSocketClientTopic, onWebSocketOpen } from "./helpers";

describe("WebSocket vote integration", () => {
  let ws: WebSocketClient;

  afterEach(() => {
    ws.close();
  });

  test("subscribes, unsubscribes and receives ack message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request1: Nano.WebSocket.VoteRequest = {
      action: "subscribe",
      ack: true,
      id: "integration-vote",
      topic: "vote",
    };
    ws.send(JSON.stringify(request1));

    const response1 = await onWebSocketClientAck("subscribe", ws);

    const request2: Nano.WebSocket.VoteRequest = {
      action: "unsubscribe",
      ack: true,
      id: "integration-vote",
      topic: "vote",
    };
    ws.send(JSON.stringify(request2));

    const response2 = await onWebSocketClientAck("unsubscribe", ws);

    expect(response1.ack).toBe("subscribe");
    expect(response2.ack).toBe("unsubscribe");
    expect(response1.id).toBe("integration-vote");
    expect(response2.id).toBe("integration-vote");
  });

  test("subscribes and receives vote message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request: Nano.WebSocket.VoteRequest = {
      action: "subscribe",
      topic: "vote",
      options: {
        include_indeterminate: true,
        include_replays: true,
      },
    };
    ws.send(JSON.stringify(request));

    const response = await onWebSocketClientTopic("vote", ws);
    expect(response.topic).toBe("vote");
    expect(response.message.account).toBeDefined();
    expect(response.message.signature).toBeDefined();
    expect(response.message.blocks).toBeDefined();
  });
});
