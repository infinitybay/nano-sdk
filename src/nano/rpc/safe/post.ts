import z from "zod";

export type ErrorResponse = z.infer<ReturnType<typeof ErrorResponse>>;
export const ErrorResponse = () =>
  z.object({
    error: z.string(),
  });

export type SuccessfulResponse<TDataType> = {
  success: true;
  data: TDataType;
  status?: number;
  statusText?: string;
};

export type UnsuccessfulResponse = {
  success: false;
  error: {
    message: string;
  };
  status?: number;
  statusText?: string;
};

export type Response<TDataType> = SuccessfulResponse<TDataType> | UnsuccessfulResponse;

export interface RequestConfig {
  abortSignal?: AbortSignal;
  timeoutInMs?: number;
  httpClient?: HttpClient;
}

export interface SuccessfulHttpResponse {
  success: true;
  data?: unknown;
  status?: number;
  statusText?: string;
}

export interface UnsuccessfulHttpResponse {
  success: false;
  error: {
    message: string;
  };
  status?: number;
  statusText?: string;
}

export interface HttpClient {
  post(url: string, body: unknown, config?: RequestConfig): Promise<SuccessfulHttpResponse | UnsuccessfulHttpResponse>;
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

const defaultHttpClient: HttpClient = {
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
        headers: { "Content-Type": "application/json" },
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
          message: response.statusText,
        },
        status: response.status,
        statusText: response.statusText,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          message: err instanceof Error ? err.message : "Unknown fetch error",
          stack: err instanceof Error ? err.stack : undefined,
        },
      };
    }
  },
};

export async function post<T extends z.ZodType, U extends z.ZodType>(
  url: string,
  requestBody: z.infer<T>,
  requestSchema: T,
  responseSchema: U,
  config?: RequestConfig
): Promise<Response<z.infer<U>>> {
  if (!requestSchema.safeParse(requestBody).success) {
    return { success: false, error: { message: "Request parsing failed." } };
  }

  try {
    const httpClient = config?.httpClient ?? defaultHttpClient;
    const httpResponse = await httpClient.post(url, requestBody, config);
    if (!httpResponse.success) {
      return {
        success: false,
        error: httpResponse.error,
        status: httpResponse.status,
        statusText: httpResponse.statusText,
      };
    }
    const errorResponse = ErrorResponse().safeParse(httpResponse.data);
    if (errorResponse.success) {
      return {
        success: false,
        error: { message: errorResponse.data.error },
        status: httpResponse.status,
        statusText: httpResponse.statusText,
      };
    }
    const response = responseSchema.safeParse(httpResponse.data);
    if (!response.success) {
      return {
        success: false,
        error: {
          message:
            "Response parsing failed. Please contact the library developer with details about your usage and environment.",
        },
        status: httpResponse.status,
        statusText: httpResponse.statusText,
      };
    }
    return {
      success: true,
      data: response.data,
      status: httpResponse.status,
      statusText: httpResponse.statusText,
    };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: { message: e.message } };
    }
    return {
      success: false,
      error: {
        message:
          "An unknown error occurred. Please contact the library developer with details about your usage and environment.",
      },
    };
  }
}

export function safePostFunction<T extends z.ZodType, U extends z.ZodType>(requestSchema: T, responseSchema: U) {
  return async (url: string, request: z.infer<T>, config?: RequestConfig): Promise<Response<z.infer<U>>> => {
    return post(url, request, requestSchema, responseSchema, config);
  };
}

export type BoolFlag<T> = T extends true ? true : T extends false ? false : true | false;

export type NotUndefinedFlag<T> = [T] extends undefined ? false : true;

export type ThresholdFlag<T> = [T] extends ["" | "0" | undefined]
  ? false
  : T extends string
    ? [string] extends [T]
      ? boolean
      : true
    : false;

export type StringFlag<T> = [T] extends undefined ? false : T extends string ? true : false;

export type StringOrNumberFlag<T> = [T] extends undefined
  ? false
  : T extends number
    ? true
    : T extends string
      ? true
      : false;

export type WithDefault<T extends object, Key extends PropertyKey, Default> = Key extends keyof T
  ? undefined extends T[Key]
    ? Omit<T, Key> & { [K in Key]: Default }
    : T
  : T & { [K in Key]: Default };
