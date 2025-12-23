import { Nano } from "../../../../src";
import {
  AckResponseTypeMap,
  TopicResponseTypeMap,
  WebSocketClient,
} from "../../../../src/nano/web-socket/client/web-socket-client";
import { Ack } from "../../../../src/nano/web-socket/types/ack";
import { Topic } from "../../../../src/nano/web-socket/types/topic";
import { webSocketMessageTimeout, webSocketOpenTimeout } from "../../config";

export async function onWebSocketOpen(ws: WebSocket | WebSocketClient) {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("WebSocket open timeout")), webSocketOpenTimeout);
    ws.onopen = () => {
      clearTimeout(timeout);
      resolve();
    };
  });
}

export async function onWebSocketMessage(ws: WebSocket | WebSocketClient) {
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

    ws.onerror = (event: Nano.WebSocket.ErrorEvent) => {
      clearTimeout(timeout);

      finish(new Error(event.message));
    };

    ws.onclose = () => {
      clearTimeout(timeout);

      finish(new Error("WebSocket closed before receiving the expected message"));
    };
  });
}

export async function onWebSocketClientAck<A extends Ack>(ack: A, ws: WebSocketClient) {
  return new Promise<AckResponseTypeMap[A]>((resolve, reject) => {
    let finished = false;

    const timeout = setTimeout(() => finish(new Error("WebSocket message timeout")), webSocketMessageTimeout);

    const onAck = (response: AckResponseTypeMap[A]) => {
      clearTimeout(timeout);

      finish(response);
    };

    const finish = (result: AckResponseTypeMap[A] | Error) => {
      if (finished) return;
      finished = true;

      ws.removeAckListener(ack, onAck);
      ws.onmessage = () => {};
      ws.onerror = () => {};
      ws.onclose = () => {};

      if (result instanceof Error) {
        reject(result);
      } else {
        resolve(result);
      }
    };

    ws.addAckListener(ack, onAck);
    ws.onmessage = (_event) => {};

    ws.onerror = (event) => {
      clearTimeout(timeout);

      finish(new Error(event.message));
    };

    ws.onclose = () => {
      clearTimeout(timeout);

      finish(new Error("WebSocket closed before receiving the expected message"));
    };
  });
}

export async function onWebSocketClientTopic<T extends Topic>(topic: T, ws: WebSocketClient) {
  return new Promise<TopicResponseTypeMap[T]>((resolve, reject) => {
    let finished = false;

    const timeout = setTimeout(() => finish(new Error("WebSocket message timeout")), webSocketMessageTimeout);

    const onTopic = (response: TopicResponseTypeMap[T]) => {
      clearTimeout(timeout);

      finish(response);
    };

    const finish = (result: TopicResponseTypeMap[T] | Error) => {
      if (finished) return;
      finished = true;

      ws.removeTopicListener(topic, onTopic);
      ws.onmessage = () => {};
      ws.onerror = () => {};
      ws.onclose = () => {};

      if (result instanceof Error) {
        reject(result);
      } else {
        resolve(result);
      }
    };

    ws.addTopicListener(topic, onTopic);
    ws.onmessage = (_event) => {};

    ws.onerror = (event) => {
      clearTimeout(timeout);

      finish(new Error(event.message));
    };

    ws.onclose = () => {
      clearTimeout(timeout);

      finish(new Error("WebSocket closed before receiving the expected message"));
    };
  });
}
