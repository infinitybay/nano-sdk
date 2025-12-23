import { Nano } from "../../../../src";
import { WebSocketClient } from "../../../../src/nano/web-socket";
import { webSocketUrl } from "../../config";
import { onWebSocketClientAck, onWebSocketClientTopic, onWebSocketOpen } from "./helpers";

jest.setTimeout(120_000);

describe("WebSocket confirmation integration", () => {
  let ws: WebSocketClient;

  afterEach(() => {
    ws.close();
  });

  test("subscribes, unsubscribes and receives ack message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request1: Nano.WebSocket.ConfirmationRequest = {
      action: "subscribe",
      ack: true,
      id: "integration-confirmation",
      topic: "confirmation",
      options: {
        include_block: true,
        include_election_info: true,
        include_sideband_info: true,
      },
    };
    ws.send(JSON.stringify(request1));

    const response1 = await onWebSocketClientAck("subscribe", ws);

    const request2: Nano.WebSocket.ConfirmationRequest = {
      action: "unsubscribe",
      ack: true,
      id: "integration-confirmation",
      topic: "confirmation",
    };
    ws.send(JSON.stringify(request2));

    const response2 = await onWebSocketClientAck("unsubscribe", ws);

    expect(response1.ack).toBe("subscribe");
    expect(response2.ack).toBe("unsubscribe");
    expect(response1.id).toBe("integration-confirmation");
    expect(response2.id).toBe("integration-confirmation");
  });

  test("subscribes and receives confirmation message", async () => {
    ws = new WebSocketClient(webSocketUrl);

    await onWebSocketOpen(ws);

    const request: Nano.WebSocket.ConfirmationRequest = {
      action: "subscribe",
      topic: "confirmation",
      options: {
        include_block: true,
        include_election_info: true,
        include_sideband_info: true,
      },
    };
    ws.send(JSON.stringify(request));

    const response = await onWebSocketClientTopic("confirmation", ws);
    expect(response.topic).toBe("confirmation");
    expect(response.message.block).toBeDefined();
    expect(response.message.election_info).toBeDefined();
    expect(response.message.sideband).toBeDefined();
  });
});
