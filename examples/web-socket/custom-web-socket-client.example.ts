import { Nano } from "nano-sdk";
import WebSocket from "ws";

const WSClient = Nano.WebSocket.WebSocketClient;

const webSocketUrl = "ws://127.0.0.1:7078";

// Injecting a custom WebSocket
const ws = new WSClient(webSocketUrl, undefined, {
  webSocketClass: WebSocket,
});

ws.addEventListener("open", () => {
  const request: Nano.WebSocket.PingRequest = {
    action: "ping",
    ack: true,
    id: "example-ping",
  };

  const onPong = (response: Nano.WebSocket.PongAckResponse) => {
    // Response payloads stay fully typed from the schema; no manual casting required.
    console.log("Pong ack:", response.ack, "id:", response.id); // prints "Pong ack: pong id: example-ping"
    ws.removeAckListener("pong", onPong);
    ws.close();
  };

  // Request payloads are fully typed even when using a custom WebSocket
  ws.addAckListener("pong", onPong);
  ws.send(JSON.stringify(request));
});

ws.addEventListener("error", (event) => {
  console.error("WebSocket error:", event.message);
});
