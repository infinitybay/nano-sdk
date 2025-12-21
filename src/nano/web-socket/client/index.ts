/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Based on the MIT-licensed "reconnecting-websocket" implementation
 * by Pedro Ladaria (https://github.com/pladaria/reconnecting-websocket).
 *
 * Modified and adapted for the nano-sdk project.
 */

export type BinaryType = "blob" | "arraybuffer";

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
  binaryType: BinaryType;

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
export type WebSocketConstructor = new (url: string, protocols?: string | string[]) => WebSocketLike;

const getDefaultWebSocketClass = (): WebSocketConstructor | undefined => {
  if (typeof WebSocket !== "undefined") {
    return WebSocket;
  }
  return undefined;
};
const isWebSocketClass = (w: any) => typeof w !== "undefined" && !!w && w.CLOSING === 2;

export class Event {
  public target: any;
  public type: string;
  constructor(type: string, target: any) {
    this.target = target;
    this.type = type;
  }
}

export class ErrorEvent extends Event {
  public message: string;
  public error: Error;
  constructor(error: Error, target: any) {
    super("error", target);
    this.message = error.message;
    this.error = error;
  }
}

export class CloseEvent extends Event {
  public code: number;
  public reason: string;
  public wasClean = true;
  constructor(code = 1000, reason = "", target: any) {
    super("close", target);
    this.code = code;
    this.reason = reason;
  }
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

export class WebSocketClient {
  private readonly _url: UrlProvider;
  private readonly _protocols?: string | string[];
  private readonly _options: WebSocketClientOptions;
  private _socket?: WebSocketLike;
  private _binaryType: BinaryType = "blob";
  private _reconnectEnabled = true;
  private _reconnectionAttempts = 0;
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
  set binaryType(value: BinaryType) {
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

      this.handleClose(new CloseEvent(code, reason, this));
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
    this.handleError(new ErrorEvent(Error("TIMEOUT"), this));
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
  };

  private handleError = (event: ErrorEvent) => {
    this.disconnect(undefined, event.message === "TIMEOUT" ? "timeout" : undefined);

    if (this.onerror) {
      this.onerror(event);
    }

    this._listeners.error.forEach((listener) => this.callEventListener(event, listener));

    this.connect();
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
    }
  }

  private addListeners() {
    if (this._socket) {
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
    }

    throw Error("Invalid URL");
  }

  private clearTimeouts() {
    clearTimeout(this._connectTimeout);
    clearTimeout(this._uptimeTimeout);
  }
}
