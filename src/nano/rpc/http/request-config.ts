import { HttpClient } from "./http-client";

export interface RequestConfig {
  abortSignal?: AbortSignal;
  httpClient?: HttpClient;
  timeoutInMs?: number;
  throwOnError?: boolean;
}

export type NonThrowingRequestConfig = RequestConfig & { throwOnError: false };
export type ThrowingRequestConfig = RequestConfig & { throwOnError?: true | undefined };
