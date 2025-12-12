import { HttpClient } from "./http-client";

export interface RequestConfig {
  abortSignal?: AbortSignal;
  httpClient?: HttpClient;
  timeoutInMs?: number;
  throwOnError?: boolean;
}

export type SafeRequestConfig = RequestConfig & { throwOnError?: false | undefined };
export type ThrowingRequestConfig = RequestConfig & { throwOnError: true };
