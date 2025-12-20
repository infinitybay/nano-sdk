import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { webSocketUrl } from "../../config";
import { onWebSocketMessage, onWebSocketOpen } from "./helpers";

describe("WebSocket confirmation integration", () => {
  let ws: WebSocket;

  afterEach(() => {
    ws.close();
  });

  test("subscribes and receives confirmation messages", async () => {
    ws = new WebSocket(webSocketUrl);

    await onWebSocketOpen(ws);

    const request: Nano.WebSocket.ConfirmationRequest = {
      action: "subscribe",
      topic: "confirmation",
      ack: true,
      id: "integration-confirmation",
      options: {
        include_block: true,
        include_election_info: true,
        include_sideband_info: true,
      },
    };

    ws.send(JSON.stringify(request));

    const message1 = await onWebSocketMessage(ws);
    const data1 = JSON.parse(message1.data);
    const ackResponse = Nano.WebSocket.AckResponse().safeParse(data1);
    assert(ackResponse.success);
    expect(ackResponse.data.ack).toBe("subscribe");
    expect(ackResponse.data.id).toBe("integration-confirmation");

    const message2 = await onWebSocketMessage(ws);
    const data2 = JSON.parse(message2.data);
    const confirmationResponse = Nano.WebSocket.ConfirmationResponse().safeParse(data2);
    assert(confirmationResponse.success);
    expect(confirmationResponse.data.topic).toBe("confirmation");
    expect(confirmationResponse.data.message.block).toBeDefined();
    expect(confirmationResponse.data.message.election_info).toBeDefined();
    expect(confirmationResponse.data.message.sideband).toBeDefined();
  });
});
