import * as WebSocket from "../../../../src/nano/web-socket";

describe("WebSocket index exports", () => {
  test("exposes web-socket schemas", () => {
    expect(WebSocket.AckRequest).toBeDefined();
    expect(WebSocket.AckResponse).toBeDefined();
    expect(WebSocket.ConfirmationRequest).toBeDefined();
    expect(WebSocket.ConfirmationResponse).toBeDefined();
    expect(WebSocket.PingRequest).toBeDefined();
    expect(WebSocket.TopicResponse).toBeDefined();
  });
});
