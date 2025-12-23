/* eslint-disable @typescript-eslint/no-explicit-any */

import z from "zod";

import {
  AckResponse,
  ConfirmationResponse,
  StartedElectionResponse,
  StoppedElectionResponse,
  TopicResponse,
  VoteResponse,
  WorkResponse,
} from "../responses";
import { PongAckResponse } from "../responses/pong-ack-response";
import { SubscribeAckResponse } from "../responses/subscribe-ack-response";
import { UnsubscribeAckResponse } from "../responses/unsibscribe-ack-response";
import { UpdateAckResponse } from "../responses/update-ack-response";
import { Topic } from "../types";
import { Ack } from "../types/ack";

/**
 * Based on the MIT-licensed "reconnecting-websocket" implementation
 * by Pedro Ladaria (https://github.com/pladaria/reconnecting-websocket).
 *
 * Modified and adapted for the nano-sdk project.
 */

export const ReadyStates = {
  Connecting: 0,
  Open: 1,
  Closing: 2,
  Closed: 3,
};

export interface WebSocketLikeEvents {
  open: Event;
  message: MessageEvent;
  error: ErrorEvent;
  close: CloseEvent;
}

export interface WebSocketLike {
  binaryType: string;

  readonly bufferedAmount: number;
  readonly extensions: string;

  readonly protocol: string;
  readonly readyState: number;
  readonly url: string;

  addEventListener<K extends keyof WebSocketLikeEvents>(
    type: K,
    listener: WebSocketEventListener<WebSocketLikeEvents[K]>
  ): void;

  removeEventListener<K extends keyof WebSocketLikeEvents>(
    type: K,
    listener: WebSocketEventListener<WebSocketLikeEvents[K]>
  ): void;

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
  close(code?: number, reason?: string): void;
}
export type WebSocketConstructor = {
  new (url: string, protocols?: string | string[]): WebSocketLike;
};

const getDefaultWebSocketClass = (): WebSocketConstructor | undefined => {
  if (typeof WebSocket !== "undefined") {
    return WebSocket;
  }
  return undefined;
};
const isWebSocketClass = (w: any) => typeof w !== "undefined" && !!w && w.CLOSING === 2;

export interface Event {
  target: any;
  type: string;
}

export interface MessageEvent extends Event {
  data: unknown;
}

export interface ErrorEvent extends Event {
  message: string;
  error: Error;
}

export interface CloseEvent extends Event {
  code: number;
  reason: string;
  wasClean: boolean;
}

export type WebSocketClientOptions = {
  webSocketClass?: WebSocketConstructor;
  connectionTimeout?: number;
  minUptime?: number;
  maxEnqueuedMessages?: number;
  maxReconnectionAttempts?: number;
  maxReconnectionDelay?: number;
  minReconnectionDelay?: number;
  reconnectionDelayGrowFactor?: number;
  startClosed?: boolean;
};

const DefaultOptions = {
  connectionTimeout: 4000,
  minUptime: 5000,
  maxEnqueuedMessages: Infinity,
  maxReconnectionAttempts: Infinity,
  maxReconnectionDelay: 10000,
  minReconnectionDelay: 1000 + Math.random() * 4000,
  reconnectionDelayGrowFactor: 1.3,
  startClosed: false,
};

type UrlProvider = string | (() => string) | (() => Promise<string>);
type Message = string | ArrayBuffer | Blob | ArrayBufferView;

export interface WebSocketEvents extends WebSocketLikeEvents {}

export type WebSocketEventListener<E> = ((event: E) => void) | { handleEvent(event: E): void };

type WebSocketEventListenerMap = {
  [K in keyof WebSocketEvents]: WebSocketEventListener<WebSocketEvents[K]>;
};
type WebSocketEventListenersMap = {
  [K in keyof WebSocketEventListenerMap]: Array<WebSocketEventListenerMap[K]>;
};

const AckResponseSchema = AckResponse();
const AckResponseSchemaMap = {
  pong: PongAckResponse(),
  subscribe: SubscribeAckResponse(),
  unsubscribe: UnsubscribeAckResponse(),
  update: UpdateAckResponse(),
};

export type AckResponseTypeMap = {
  pong: PongAckResponse;
  subscribe: SubscribeAckResponse;
  unsubscribe: UnsubscribeAckResponse;
  update: UpdateAckResponse;
};

export type AckListener<A extends Ack> =
  | ((message: AckResponseTypeMap[A]) => void)
  | { handleAck(message: AckResponseTypeMap[A]): void };

type AckListenersMap = {
  [A in Ack]: Array<AckListener<A>>;
};

const TopicResponseSchema = TopicResponse();
const TopicResponseSchemaMap = {
  bootstrap: z.unknown(),
  confirmation: ConfirmationResponse(),
  new_unconfirmed_block: z.unknown(),
  started_election: StartedElectionResponse(),
  stopped_election: StoppedElectionResponse(),
  telemetry: z.unknown(),
  vote: VoteResponse(),
  work: WorkResponse(),
};

export type TopicResponseTypeMap = {
  bootstrap: unknown;
  confirmation: ConfirmationResponse;
  new_unconfirmed_block: unknown;
  started_election: StartedElectionResponse;
  stopped_election: StoppedElectionResponse;
  telemetry: unknown;
  vote: VoteResponse;
  work: WorkResponse;
};

export type TopicListener<T extends Topic> =
  | ((message: TopicResponseTypeMap[T]) => void)
  | { handleTopic(message: TopicResponseTypeMap[T]): void };

type TopicListenersMap = {
  [T in Topic]: Array<TopicListener<T>>;
};

export class WebSocketClient {
  private readonly _url: UrlProvider;
  private readonly _protocols?: string | string[];
  private readonly _options: WebSocketClientOptions;
  private _socket?: WebSocketLike;
  private _binaryType: string = "blob";
  private _reconnectEnabled = true;
  private _reconnectionAttempts = -1;
  private _messageQueue: Message[] = [];
  private _connectLock = false;
  private _closeCalled = false;
  private _connectTimeout?: any;
  private _uptimeTimeout?: any;
  private _listeners: WebSocketEventListenersMap = {
    open: [],
    message: [],
    error: [],
    close: [],
  };
  private _ackListeners: AckListenersMap = {
    pong: [],
    subscribe: [],
    unsubscribe: [],
    update: [],
  };
  private _topicListeners: TopicListenersMap = {
    active_difficulty: [],
    bootstrap: [],
    confirmation: [],
    new_unconfirmed_block: [],
    started_election: [],
    stopped_election: [],
    telemetry: [],
    vote: [],
    work: [],
  };

  /**
   * The resolved WebSocket URL as provided by the underlying socket instance.
   * Returns an empty string if no socket has been created yet.
   */
  get url(): string {
    return this._socket ? this._socket.url : "";
  }

  /**
   * The name of the sub-protocol selected by the server.
   * This will be one of the values specified in the `protocols` parameter
   * when the WebSocket connection was created, or an empty string if no
   * sub-protocol was negotiated or the socket is not yet available.
   */
  get protocol(): string {
    return this._socket ? this._socket.protocol : "";
  }

  /**
   * The current state of the connection.
   * This value corresponds to one of the ReadyState constants.
   *
   * If no underlying socket exists yet, the state is derived from the
   * `startClosed` option:
   * - `Closed` if `startClosed` is true
   * - `Connecting` otherwise
   */
  get readyState(): number {
    if (this._socket) {
      return this._socket.readyState;
    }
    return this._options.startClosed ? ReadyStates.Closed : ReadyStates.Connecting;
  }

  /**
   * The type of binary data being transmitted by the connection.
   *
   * If no socket is currently active, this returns the internally stored
   * binaryType that will be applied once the socket is created.
   */
  get binaryType() {
    return this._socket ? this._socket.binaryType : this._binaryType;
  }

  /**
   * Sets the type of binary data being transmitted by the connection.
   *
   * The value is stored internally and immediately applied to the underlying
   * socket if it already exists.
   */
  set binaryType(value: string) {
    this._binaryType = value;
    if (this._socket) {
      this._socket.binaryType = value;
    }
  }

  /**
   * The number of bytes of data that have been queued via `send()` but not yet
   * transmitted to the network.
   *
   * This includes:
   * - Data queued internally before a socket is available
   * - Data buffered by the underlying WebSocket implementation
   *
   * Note:
   * - String sizes are based on character length, not UTF-8 byte length
   * - The value does not reset to zero when the connection is closed
   *
   * Read-only.
   */
  get bufferedAmount(): number {
    const bytes = this._messageQueue.reduce((acc, message) => {
      if (typeof message === "string") {
        acc += message.length; // not byte size
      } else if (message instanceof Blob) {
        acc += message.size;
      } else {
        acc += message.byteLength;
      }
      return acc;
    }, 0);
    return bytes + (this._socket ? this._socket.bufferedAmount : 0);
  }

  /**
   * The extensions selected by the server, if any.
   *
   * This is either an empty string or a space-separated list of extensions
   * negotiated during the WebSocket handshake. Returns an empty string if
   * no socket is currently available.
   */
  get extensions(): string {
    return this._socket ? this._socket.extensions : "";
  }

  /**
   * The number of reconnection attempts that have been performed so far.
   *
   * This value is always non-negative.
   */
  get reconnectionAttempts(): number {
    return Math.max(this._reconnectionAttempts, 0);
  }

  /**
   * Creates a new WebSocketClient instance.
   *
   * @param url - A URL or URL provider used to resolve the WebSocket endpoint
   * @param protocols - An optional sub-protocol or list of sub-protocols
   * @param options - Optional client configuration options
   *
   * Note:
   * - The connection attempt is initiated immediately by calling `connect()`
   * - If `startClosed` is enabled, automatic connection is disabled initially
   */
  constructor(url: UrlProvider, protocols?: string | string[], options: WebSocketClientOptions = {}) {
    this._url = url;
    this._protocols = protocols;
    this._options = options;
    if (this._options.startClosed) {
      this._reconnectEnabled = false;
    }
    this.connect();
  }

  /**
   * Event handler invoked when the WebSocket connection transitions to the OPEN state.
   *
   * At this point, the connection is established and ready to send and receive data.
   */
  public onopen: ((event: Event) => void) | null = null;

  /**
   * Event handler invoked when a message is received from the server.
   */
  public onmessage: ((event: MessageEvent) => void) | null = null;

  /**
   * Event handler invoked when an error occurs on the WebSocket connection.
   */
  public onerror: ((event: ErrorEvent) => void) | null = null;

  /**
   * Event handler invoked when the WebSocket connection transitions to the CLOSED state.
   */
  public onclose: ((event: CloseEvent) => void) | null = null;

  /**
   * Registers an event listener for the specified WebSocket event type.
   */
  public addEventListener<T extends keyof WebSocketEventListenerMap>(
    type: T,
    listener: WebSocketEventListenerMap[T]
  ): void {
    if (this._listeners[type] && !this._listeners[type].includes(listener)) {
      this._listeners[type].push(listener);
    }
  }

  /**
   * Dispatches an event to all registered listeners of the corresponding event type.
   *
   * Returns `true` to match the EventTarget `dispatchEvent` contract.
   */
  public dispatchEvent(event: Event) {
    const listeners = this._listeners[event.type as keyof WebSocketEventListenerMap];
    if (listeners) {
      for (const listener of listeners) {
        this.callEventListener(event, listener);
      }
    }
    return true;
  }

  /**
   * Invokes an event listener, supporting both function listeners and
   * EventListener objects with a `handleEvent` method.
   */
  private callEventListener<T extends keyof WebSocketEventListenerMap>(
    event: WebSocketEvents[T],
    listener: WebSocketEventListenerMap[T]
  ) {
    if ("handleEvent" in listener) {
      listener.handleEvent(event);
    } else {
      listener(event);
    }
  }

  /**
   * Removes a previously registered event listener for the specified event type.
   *
   * If the listener is not registered, this method has no effect.
   */
  public removeEventListener<T extends keyof WebSocketEventListenerMap>(
    type: T,
    listener: WebSocketEventListenerMap[T]
  ): void {
    if (this._listeners[type]) {
      const index = this._listeners[type].indexOf(listener);
      if (index !== -1) {
        this._listeners[type].splice(index, 1);
      }
    }
  }

  /**
   * Registers an acknowledgment listener for the specified ack type.
   */
  public addAckListener<A extends Ack>(ack: A, listener: AckListener<A>): void {
    if (this._ackListeners[ack] && !this._ackListeners[ack].includes(listener)) {
      this._ackListeners[ack].push(listener);
    }
  }

  /**
   * Dispatches an acknowledgment message to all registered listeners
   * of the corresponding ack type.
   *
   * Returns `true` to match the EventTarget `dispatchEvent` contract.
   */
  public dispatchAck<A extends Ack>(ack: A, message: AckResponseTypeMap[A]) {
    const listeners = this._ackListeners[ack];
    if (listeners) {
      for (const listener of listeners) {
        this.callAckListener(message, listener);
      }
    }
    return true;
  }

  /**
   * Invokes an acknowledgment listener, supporting both function listeners
   * and listener objects with a `handleAck` method.
   */
  private callAckListener<A extends Ack>(message: AckResponseTypeMap[A], listener: AckListener<A>) {
    if ("handleAck" in listener) {
      listener.handleAck(message);
    } else {
      listener(message);
    }
  }

  /**
   * Removes a previously registered acknowledgment listener
   * for the specified ack type.
   *
   * If the listener is not registered, this method has no effect.
   */
  public removeAckListener<A extends Ack>(ack: A, listener: AckListener<A>): void {
    if (this._ackListeners[ack]) {
      const index = this._ackListeners[ack].indexOf(listener);
      if (index !== -1) {
        this._ackListeners[ack].splice(index, 1);
      }
    }
  }

  /**
   * Registers a listener for the specified topic.
   */
  public addTopicListener<T extends Topic>(topic: T, listener: TopicListener<T>): void {
    if (this._topicListeners[topic] && !this._topicListeners[topic].includes(listener)) {
      this._topicListeners[topic].push(listener);
    }
  }

  /**
   * Dispatches a message to all registered listeners of the given topic.
   *
   * Returns `true` to match the EventTarget `dispatchEvent` contract.
   */
  public dispatchTopic<T extends Topic>(topic: T, message: TopicResponseTypeMap[T]) {
    const listeners = this._topicListeners[topic];
    if (listeners) {
      for (const listener of listeners) {
        this.callTopicListener(message, listener);
      }
    }
    return true;
  }

  /**
   * Invokes a topic listener, supporting both function listeners and
   * listener objects with a `handleTopic` method.
   */
  private callTopicListener<T extends Topic>(message: TopicResponseTypeMap[T], listener: TopicListener<T>) {
    if ("handleTopic" in listener) {
      listener.handleTopic(message);
    } else {
      listener(message);
    }
  }

  /**
   * Removes a previously registered listener for the specified topic.
   *
   * If the listener is not registered, this method has no effect.
   */
  public removeTopicListener<T extends Topic>(topic: T, listener: TopicListener<T>): void {
    if (this._topicListeners[topic]) {
      const index = this._topicListeners[topic].indexOf(listener);
      if (index !== -1) {
        this._topicListeners[topic].splice(index, 1);
      }
    }
  }

  /**
   * Initiates a WebSocket connection attempt.
   *
   * This method respects internal connection locks, reconnection settings,
   * maximum reconnection attempts, and optional reconnection delays.
   *
   * @returns `true` if a connection attempt was started, `false` otherwise
   */
  connect(): boolean {
    if (this._connectLock || !this._reconnectEnabled) {
      return false;
    }
    this._connectLock = true;

    const {
      webSocketClass,
      connectionTimeout = DefaultOptions.connectionTimeout,
      maxReconnectionAttempts = DefaultOptions.maxReconnectionAttempts,
    } = this._options;

    if (this._reconnectionAttempts >= maxReconnectionAttempts) {
      return false;
    }
    this._reconnectionAttempts++;

    this.removeListeners();

    const WebSocketClass: WebSocketConstructor | undefined = webSocketClass ?? getDefaultWebSocketClass();
    if (WebSocketClass === undefined || !isWebSocketClass(WebSocketClass)) {
      throw Error("No valid WebSocket class provided");
    }

    this.waitNextReconnectionDelay()
      .then(() => this.getNextUrl(this._url))
      .then((url) => {
        if (this._closeCalled) {
          return;
        }

        this._socket = this._protocols ? new WebSocketClass(url, this._protocols) : new WebSocketClass(url);
        this._socket!.binaryType = this._binaryType;

        this._connectLock = false;
        this.addListeners();

        this._connectTimeout = setTimeout(() => this.handleTimeout(), connectionTimeout);
      });

    return true;
  }

  /**
   * Closes the current WebSocket connection or connection attempt
   * and immediately starts a new one.
   *
   * This method:
   * - Re-enables automatic reconnection
   * - Resets the reconnection attempts counter
   * - Clears the internal "close called" flag
   */
  public reconnect(code?: number, reason?: string) {
    this._reconnectEnabled = true;
    this._reconnectionAttempts = -1;
    this._closeCalled = false;

    if (!this._socket || this._socket.readyState === ReadyStates.Closed) {
      this.connect();
    } else {
      this.disconnect(code, reason);
      this.connect();
    }
  }

  /**
   * Enqueues data to be transmitted to the server over the WebSocket connection.
   *
   * If the connection is currently OPEN, the data is sent immediately.
   * Otherwise, the data is queued and sent once the connection is established,
   * subject to the `maxEnqueuedMessages` limit.
   */
  public send(data: Message) {
    if (this._socket && this._socket.readyState === ReadyStates.Open) {
      this._socket.send(data);
    } else {
      const { maxEnqueuedMessages = DefaultOptions.maxEnqueuedMessages } = this._options;
      if (this._messageQueue.length < maxEnqueuedMessages) {
        this._messageQueue.push(data);
      }
    }
  }

  /**
   * Internally closes the WebSocket connection and cleans up listeners and timers.
   *
   * This method is used during reconnection and does not permanently disable
   * future connection attempts.
   */
  private disconnect(code = 1000, reason?: string) {
    this.clearTimeouts();

    if (!this._socket) {
      return;
    }

    this.removeListeners();

    try {
      this._socket.close(code, reason);

      this.handleClose({ type: "close", code: code, reason: reason ?? "", wasClean: true, target: this });
    } catch (_error) {
      // ignore
    }
  }

  /**
   * Closes the WebSocket connection or connection attempt, if any.
   *
   * This permanently disables automatic reconnection until `reconnect()` or
   * `connect()` is called again.
   *
   * If the connection is already closed, this method has no effect.
   */
  public close(code = 1000, reason?: string) {
    this._closeCalled = true;
    this._reconnectEnabled = false;
    this.clearTimeouts();

    if (!this._socket) {
      return;
    }

    if (this._socket.readyState === ReadyStates.Closed) {
      return;
    }

    this._socket.close(code, reason);
  }

  private acceptOpen() {
    this._reconnectionAttempts = 0;
  }

  private handleTimeout() {
    this.handleError({ type: "error", message: "TIMEOUT", error: Error("TIMEOUT"), target: this });
  }

  private handleOpen = (event: Event) => {
    const { minUptime = DefaultOptions.minUptime } = this._options;

    clearTimeout(this._connectTimeout);
    this._uptimeTimeout = setTimeout(() => this.acceptOpen(), minUptime);

    this._socket!.binaryType = this._binaryType;

    // Send enqueued messages (messages sent before websocket open event)
    this._messageQueue.forEach((message) => this._socket?.send(message));
    this._messageQueue = [];

    if (this.onopen) {
      this.onopen(event);
    }

    this._listeners.open.forEach((listener) => this.callEventListener(event, listener));
  };

  private handleMessage = (event: MessageEvent) => {
    if (this.onmessage) {
      this.onmessage(event);
    }

    this._listeners.message.forEach((listener) => this.callEventListener(event, listener));

    if (typeof event.data === "string") {
      let data = undefined;
      try {
        data = JSON.parse(event.data);
      } catch (_err) {
        // Do nothing
      }
      if (data) {
        const parsedTopicResponse = TopicResponseSchema.safeParse(data);
        if (parsedTopicResponse.success) {
          const parsedMessage = TopicResponseSchemaMap[parsedTopicResponse.data.topic].safeParse(data);
          if (parsedMessage.success) {
            this.dispatchTopic(parsedTopicResponse.data.topic, parsedMessage.data);
          } else {
            this.dispatchError({
              type: "error",
              message: `Failed to parse topic response '${parsedTopicResponse.data.topic}'. Please contact the library developer with details about your usage and environment.`,
              error: Error(
                `Failed to parse topic response '${parsedTopicResponse.data.topic}'. Please contact the library developer with details about your usage and environment.`
              ),
              target: this,
            });
          }
        } else {
          const parsedAckResponse = AckResponseSchema.safeParse(data);
          if (parsedAckResponse.success) {
            console.log("CALL dispatchAck1111");
            const parsedMessage = AckResponseSchemaMap[parsedAckResponse.data.ack].safeParse(data);
            console.log("CALL BBBBB");
            if (parsedMessage.success) {
              console.log("CALL dispatchAck", parsedMessage.error);
              this.dispatchAck(parsedAckResponse.data.ack, parsedMessage.data);
            } else {
              console.log("CALL dispatchAck", parsedMessage.error);
              this.dispatchError({
                type: "error",
                message: `Failed to parse acknowledgment response '${parsedAckResponse.data.ack}'. Please contact the library developer with details about your usage and environment.`,
                error: Error(
                  `Failed to parse acknowledgment response '${parsedAckResponse.data.ack}'. Please contact the library developer with details about your usage and environment.`
                ),
                target: this,
              });
            }
          }
        }
      }
    }
  };

  private dispatchError(event: ErrorEvent) {
    if (this.onerror) {
      this.onerror(event);
    }

    this._listeners.error.forEach((listener) => this.callEventListener(event, listener));
  }

  private handleError = (event: ErrorEvent) => {
    this.disconnect(undefined, event.message === "TIMEOUT" ? "timeout" : undefined);

    this.dispatchError(event);

    this.connect();
  };

  private handleErrorDuringTransition = (_event: ErrorEvent) => {
    // Do nothing
  };

  private handleClose = (event: CloseEvent) => {
    this.clearTimeouts();

    if (this._reconnectEnabled) {
      this.connect();
    }

    if (this.onclose) {
      this.onclose(event);
    }

    this._listeners.close.forEach((listener) => this.callEventListener(event, listener));
  };

  private removeListeners() {
    if (this._socket) {
      this._socket.removeEventListener("open", this.handleOpen);
      this._socket.removeEventListener("close", this.handleClose);
      this._socket.removeEventListener("message", this.handleMessage);
      this._socket.removeEventListener("error", this.handleError);
      // Ignore 'WebSocket was closed before the connection was established'
      // when close() is called during readyState === ReadyStates.Connecting
      this._socket.addEventListener("error", this.handleErrorDuringTransition);
    }
  }

  private addListeners() {
    if (this._socket) {
      this._socket.removeEventListener("error", this.handleErrorDuringTransition);
      this._socket.addEventListener("open", this.handleOpen);
      this._socket.addEventListener("close", this.handleClose);
      this._socket.addEventListener("message", this.handleMessage);
      this._socket.addEventListener("error", this.handleError);
    }
  }

  private waitNextReconnectionDelay(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, this.getNextReconnectionDelay());
    });
  }

  private getNextReconnectionDelay() {
    const {
      minReconnectionDelay = DefaultOptions.minReconnectionDelay,
      maxReconnectionDelay = DefaultOptions.maxReconnectionDelay,
      reconnectionDelayGrowFactor = DefaultOptions.reconnectionDelayGrowFactor,
    } = this._options;

    let delay = 0;
    if (this._reconnectionAttempts > 0) {
      delay = minReconnectionDelay * Math.pow(reconnectionDelayGrowFactor, this._reconnectionAttempts - 1);
      if (delay > maxReconnectionDelay) {
        delay = maxReconnectionDelay;
      }
    }
    return delay;
  }

  private getNextUrl(urlProvider: UrlProvider): Promise<string> {
    if (typeof urlProvider === "string") {
      return Promise.resolve(urlProvider);
    }

    if (typeof urlProvider === "function") {
      const url = urlProvider();
      if (typeof url === "string") {
        return Promise.resolve(url);
      }
      if (url && typeof (url as any).then === "function") {
        return url as Promise<string>;
      }
    }

    throw Error("Invalid URL");
  }

  private clearTimeouts() {
    clearTimeout(this._connectTimeout);
    clearTimeout(this._uptimeTimeout);
  }
}
