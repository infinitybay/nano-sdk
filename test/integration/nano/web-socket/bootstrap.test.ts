import { Nano } from "../../../../src";
import { WebSocketClient } from "../../../../src/nano/web-socket";
import { webSocketUrl } from "../../config";
import { onWebSocketClientAck, onWebSocketClientTopic, onWebSocketOpen } from "./helpers";

// Disabled because the bootstrap topic is available on the Nano node but is not fully implemented yet.
xdescribe("WebSocket bootstrap integration", () => {
  let ws: WebSocketClient;

  afterEach(() => {
    ws.close();
  });

  test("subscribes, unsubscribes and receives ack message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request1: Nano.WebSocket.BootstrapRequest = {
      action: "subscribe",
      ack: true,
      id: "integration-bootstrap",
      topic: "bootstrap",
    };
    ws.send(JSON.stringify(request1));

    const response1 = await onWebSocketClientAck("subscribe", ws);

    const request2: Nano.WebSocket.BootstrapRequest = {
      action: "unsubscribe",
      ack: true,
      id: "integration-bootstrap",
      topic: "bootstrap",
    };
    ws.send(JSON.stringify(request2));

    const response2 = await onWebSocketClientAck("unsubscribe", ws);

    expect(response1.ack).toBe("subscribe");
    expect(response2.ack).toBe("unsubscribe");
    expect(response1.id).toBe("integration-bootstrap");
    expect(response2.id).toBe("integration-bootstrap");
  });

  test("subscribes and receives bootstrap message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request: Nano.WebSocket.BootstrapRequest = {
      action: "subscribe",
      topic: "bootstrap",
    };
    ws.send(JSON.stringify(request));

    const response = await onWebSocketClientTopic("bootstrap", ws);
    expect(response.topic).toBe("bootstrap");
    expect(response.message.reason).toBeDefined();
    expect(response.message.id).toBeDefined();
    expect(response.message.mode).toBeDefined();
    if (response.message.reason === "exited") {
      expect(response.message.total_blocks).toBeDefined();
      expect(response.message.duration).toBeDefined();
    }
  });
});
