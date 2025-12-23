import { Nano } from "../../../../src";
import { WebSocketClient } from "../../../../src/nano/web-socket";
import { assert } from "../../../assert";
import { webSocketUrl } from "../../config";
import { onWebSocketClientAck, onWebSocketClientTopic, onWebSocketMessage, onWebSocketOpen } from "./helpers";

describe("WebSocket started_election integration", () => {
  let ws: WebSocket;

  afterEach(() => {
    ws.close();
  });

  test("subscribes, unsubscribes and receives ack message", async () => {
    ws = new WebSocket(webSocketUrl);

    await onWebSocketOpen(ws);

    const request1: Nano.WebSocket.StartedElectionRequest = {
      action: "subscribe",
      ack: true,
      id: "integration-started-election",
      topic: "started_election",
    };
    ws.send(JSON.stringify(request1));

    const message1 = await onWebSocketMessage(ws);

    const request2: Nano.WebSocket.StartedElectionRequest = {
      action: "unsubscribe",
      ack: true,
      id: "integration-started-election",
      topic: "started_election",
    };
    ws.send(JSON.stringify(request2));

    const message2 = await onWebSocketMessage(ws);

    const data1 = JSON.parse(message1.data);
    const data2 = JSON.parse(message2.data);

    const response1 = Nano.WebSocket.AckResponse().safeParse(data1);
    const response2 = Nano.WebSocket.AckResponse().safeParse(data2);

    assert(response1.success);
    assert(response2.success);
    expect(response1.data.ack).toBe("subscribe");
    expect(response2.data.ack).toBe("unsubscribe");
    expect(response1.data.id).toBe("integration-started-election");
    expect(response2.data.id).toBe("integration-started-election");
  });

  test("subscribes and receives started_election message", async () => {
    ws = new WebSocket(webSocketUrl);

    await onWebSocketOpen(ws);

    const request: Nano.WebSocket.StartedElectionRequest = {
      action: "subscribe",
      topic: "started_election",
    };
    ws.send(JSON.stringify(request));

    const message = await onWebSocketMessage(ws);
    const data = JSON.parse(message.data);
    const response = Nano.WebSocket.StartedElectionResponse().safeParse(data);

    assert(response.success);
    expect(response.data.topic).toBe("started_election");
    expect(response.data.message.hash).toBeDefined();
  });
});

describe("WebSocketClient started_election integration", () => {
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
