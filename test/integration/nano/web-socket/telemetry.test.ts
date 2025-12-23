import { Nano } from "../../../../src";
import { WebSocketClient } from "../../../../src/nano/web-socket";
import { webSocketUrl } from "../../config";
import { onWebSocketClientAck, onWebSocketClientTopic, onWebSocketOpen } from "./helpers";

describe("WebSocket telemetry integration", () => {
  let ws: WebSocketClient;

  afterEach(() => {
    ws.close();
  });

  test("subscribes, unsubscribes and receives ack message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request1: Nano.WebSocket.TelemetryRequest = {
      action: "subscribe",
      ack: true,
      id: "integration-telemetry",
      topic: "telemetry",
    };
    ws.send(JSON.stringify(request1));

    const response1 = await onWebSocketClientAck("subscribe", ws);

    const request2: Nano.WebSocket.TelemetryRequest = {
      action: "unsubscribe",
      ack: true,
      id: "integration-telemetry",
      topic: "telemetry",
    };
    ws.send(JSON.stringify(request2));

    const response2 = await onWebSocketClientAck("unsubscribe", ws);

    expect(response1.ack).toBe("subscribe");
    expect(response2.ack).toBe("unsubscribe");
    expect(response1.id).toBe("integration-telemetry");
    expect(response2.id).toBe("integration-telemetry");
  });

  test("subscribes and receives telemetry message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request: Nano.WebSocket.TelemetryRequest = {
      action: "subscribe",
      topic: "telemetry",
    };
    ws.send(JSON.stringify(request));

    const response = await onWebSocketClientTopic("telemetry", ws);
    expect(response.topic).toBe("telemetry");
    expect(response.message.node_id).toBeDefined();
    expect(response.message.address).toBeDefined();
    expect(response.message.port).toBeDefined();
  });
});
