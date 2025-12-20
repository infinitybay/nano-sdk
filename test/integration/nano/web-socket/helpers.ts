import { webSocketMessageTimeout, webSocketOpenTimeout } from "../../config";

export async function onWebSocketOpen(ws: WebSocket) {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("WebSocket open timeout")), webSocketOpenTimeout);
    ws.onopen = () => {
      clearTimeout(timeout);
      resolve();
    };
  });
}

export async function onWebSocketMessage(ws: WebSocket) {
  return new Promise<MessageEvent>((resolve, reject) => {
    let finished = false;

    const finish = (result: MessageEvent | Error) => {
      if (finished) return;
      finished = true;

      ws.onmessage = () => {};
      ws.onerror = () => {};
      ws.onclose = () => {};

      if (result instanceof Error) {
        reject(result);
      } else {
        resolve(result);
      }
    };

    const timeout = setTimeout(() => finish(new Error("WebSocket message timeout")), webSocketMessageTimeout);

    ws.onmessage = (event: MessageEvent) => {
      clearTimeout(timeout);

      finish(event);
    };

    ws.onerror = () => {
      clearTimeout(timeout);

      finish(new Error("WebSocket error"));
    };

    ws.onclose = () => {
      clearTimeout(timeout);

      finish(new Error("WebSocket closed before receiving the expected message"));
    };
  });
}
