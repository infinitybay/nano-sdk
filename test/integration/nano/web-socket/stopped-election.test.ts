import { Nano } from "../../../../src";
import { WebSocketClient } from "../../../../src/nano/web-socket";
import { webSocketUrl } from "../../config";
import { onWebSocketClientAck, onWebSocketClientTopic, onWebSocketOpen } from "./helpers";

jest.setTimeout(120_000);

describe("WebSocket stopped_election integration", () => {
  let ws: WebSocketClient;

  afterEach(() => {
    ws.close();
  });

  test("subscribes, unsubscribes and receives ack message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request1: Nano.WebSocket.StoppedElectionRequest = {
      action: "subscribe",
      ack: true,
      id: "integration-stopped-election",
      topic: "stopped_election",
    };
    ws.send(JSON.stringify(request1));

    const response1 = await onWebSocketClientAck("subscribe", ws);

    const request2: Nano.WebSocket.StoppedElectionRequest = {
      action: "unsubscribe",
      ack: true,
      id: "integration-stopped-election",
      topic: "stopped_election",
    };
    ws.send(JSON.stringify(request2));

    const response2 = await onWebSocketClientAck("unsubscribe", ws);

    expect(response1.ack).toBe("subscribe");
    expect(response2.ack).toBe("unsubscribe");
    expect(response1.id).toBe("integration-stopped-election");
    expect(response2.id).toBe("integration-stopped-election");
  });

  // Disabled since no messages are emitted for stopped_election without additional actions to stop elections.
  xtest("subscribes and receives stopped_election message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request: Nano.WebSocket.StoppedElectionRequest = {
      action: "subscribe",
      topic: "stopped_election",
    };
    ws.send(JSON.stringify(request));

    const response = await onWebSocketClientTopic("stopped_election", ws);
    expect(response.topic).toBe("stopped_election");
    expect(response.message.hash).toBeDefined();
  });
});
