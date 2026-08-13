import { PostErrorCode } from "./post-error-code";
import { RequestConfig } from "./request-config";

export interface HttpResponseSuccess {
  success: true;
  data?: unknown;
  status?: number;
  statusText?: string;
}

export interface HttpResponseError {
  success: false;
  error: {
    code?: PostErrorCode.HttpError | PostErrorCode.TransportError;
    message: string;
  };
  status?: number;
  statusText?: string;
}

export type HttpResponse = HttpResponseSuccess | HttpResponseError;

export interface HttpClient {
  post(url: string, body: unknown, config?: RequestConfig): Promise<HttpResponse>;
}

// Credits: https://github.com/rashidshamloo/multi-signal
const multiSignal: {
  /**
   * Merges multiple AbortSignals into a single signal. returned signal will be aborted if any of the input signals are aborted.
   *
   * MultiSignal ( signal1, signal2, ... ) : AbortSignal
   */
  (...signals: AbortSignal[]): AbortSignal;
  /**
   * Merges multiple AbortSignals into a single signal. returned signal will be aborted if any of the input signals are aborted.
   *
   * MultiSignal ( [ signal1, signal2, ... ] ) : AbortSignal
   */
  (...signals: [AbortSignal[]]): AbortSignal;
} = (...inputSignals: AbortSignal[] | [AbortSignal[]]) => {
  const signals = Array.isArray(inputSignals[0]) ? inputSignals[0] : (inputSignals as AbortSignal[]);
  // if only one signal is provided, return it
  const len = signals.length;
  if (len === 1) return signals[0];
  // new signal setup
  const controller = new AbortController();
  const signal = controller.signal;
  // add event listener
  for (let i = 0; i < len; i++) {
    // if signal is already aborted, abort new signal
    if (signals[i].aborted) {
      controller.abort(signals[i].reason);
      break;
    }
    // else add on signal abort: abort new signal
    signals[i].addEventListener(
      "abort",
      () => {
        controller.abort(signals[i].reason);
      },
      { signal }
    );
  }
  return signal;
};

export const defaultHttpClient: HttpClient = {
  async post(url, body, config) {
    const timeoutAbortSignal = config?.timeoutInMs ? AbortSignal.timeout(config.timeoutInMs) : undefined;
    const signal =
      config?.abortSignal && timeoutAbortSignal
        ? multiSignal(config.abortSignal, timeoutAbortSignal)
        : config?.abortSignal
          ? config.abortSignal
          : timeoutAbortSignal;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        signal: signal,
        headers: {
          "Content-Type": "application/json",
          ...config?.headers,
        },
      });

      let parsed: unknown = null;
      try {
        parsed = await response.json();
      } catch {
        parsed = null;
      }

      if (response.ok) {
        return {
          success: true,
          data: parsed,
          status: response.status,
          statusText: response.statusText,
        };
      }

      return {
        success: false,
        error: {
          code: PostErrorCode.HttpError,
          message: response.statusText,
        },
        status: response.status,
        statusText: response.statusText,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: PostErrorCode.TransportError,
          message: err instanceof Error ? err.message : "Unknown fetch error",
        },
      };
    }
  },
};
