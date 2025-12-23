import { Nano } from "../../../../src";
import { WebSocketClient } from "../../../../src/nano/web-socket";
import { webSocketUrl } from "../../config";
import { onWebSocketClientAck, onWebSocketClientTopic, onWebSocketOpen } from "./helpers";

jest.setTimeout(120_000);

describe("WebSocket started_election integration", () => {
  let ws: WebSocketClient;

  afterEach(() => {
    ws.close();
  });

  test("subscribes, unsubscribes and receives ack message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request1: Nano.WebSocket.StartedElectionRequest = {
      action: "subscribe",
      ack: true,
      id: "integration-started-election",
      topic: "started_election",
    };
    ws.send(JSON.stringify(request1));

    const response1 = await onWebSocketClientAck("subscribe", ws);

    const request2: Nano.WebSocket.StartedElectionRequest = {
      action: "unsubscribe",
      ack: true,
      id: "integration-started-election",
      topic: "started_election",
    };
    ws.send(JSON.stringify(request2));

    const response2 = await onWebSocketClientAck("unsubscribe", ws);

    expect(response1.ack).toBe("subscribe");
    expect(response2.ack).toBe("unsubscribe");
    expect(response1.id).toBe("integration-started-election");
    expect(response2.id).toBe("integration-started-election");
  });

  test("subscribes and receives started_election message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request: Nano.WebSocket.StartedElectionRequest = {
      action: "subscribe",
      topic: "started_election",
    };
    ws.send(JSON.stringify(request));

    const response = await onWebSocketClientTopic("started_election", ws);
    expect(response.topic).toBe("started_election");
    expect(response.message.hash).toBeDefined();
  });
});
