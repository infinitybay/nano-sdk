import { Nano } from "nano-sdk";

const WSClient = Nano.WebSocket.WebSocketClient;

const webSocketUrl = "ws://127.0.0.1:7078";
const ws = new WSClient(webSocketUrl, undefined, {
  webSocketClass: undefined, // WebSocket constructor, if none provided, defaults to global WebSocket
  connectionTimeout: 4000, // retry connect if not connected after this time, in ms
  minUptime: 5000, // min time in ms to consider connection as stable
  maxEnqueuedMessages: Infinity, // maximum number of messages to buffer until reconnection
  maxReconnectionAttempts: Infinity, // maximum number of reconnection attempts
  maxReconnectionDelay: 10000, // max delay in ms between reconnections
  minReconnectionDelay: 1000 + Math.random() * 4000, // min delay in ms between reconnections
  reconnectionDelayGrowFactor: 1.3, // how fast the reconnection delay grows
  startClosed: false, // start websocket in CLOSED state, call `.reconnect()` to connect
});

// All request and response payloads are fully typed from the implemented schemas.
const onSubscribeAck = (response: Nano.WebSocket.SubscribeAckResponse) => {
  // The response type is inferred from the schema; no validating or manual casting required.
  console.log("Ack:", response.ack, "id:", response.id);
  ws.removeAckListener("subscribe", onSubscribeAck);
};

const onConfirmation = (response: Nano.WebSocket.ConfirmationResponse) => {
  // The response is strongly typed as the confirmation topic schema; no validating or manual casting required.
  console.log("Confirmed block hash:", response.message.hash);
  ws.removeTopicListener("confirmation", onConfirmation);
  ws.close();
};

ws.addEventListener("open", () => {
  const confirmationRequest: Nano.WebSocket.ConfirmationRequest = {
    action: "subscribe",
    ack: true,
    id: "example-confirmation",
    topic: "confirmation",
    options: {
      include_block: true,
      include_election_info: true,
      include_sideband_info: true,
    },
  };

  // Response payloads are fully typed from the implemented schemas.
  ws.addAckListener("subscribe", onSubscribeAck);
  ws.addTopicListener("confirmation", onConfirmation);

  ws.send(JSON.stringify(confirmationRequest));
});

ws.addEventListener("error", (event) => {
  console.error("WebSocket error:", event.message);
});
