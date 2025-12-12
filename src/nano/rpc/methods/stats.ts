import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { RequestConfig, SafeRequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { StatsRequest } from "../requests/stats";
import { StatsResponse } from "../responses/stats";

type ResponseType<T extends StatsRequest> = StatsResponse<{
  TYPE: T["type"];
}>;

export function stats<const T extends StatsRequest>(
  url: string,
  request: T,
  config?: SafeRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function stats<const T extends StatsRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function stats<const T extends StatsRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function stats(url: string, request: StatsRequest, config?: RequestConfig) {
  if (config?.throwOnError === true) {
    return post(
      url,
      request,
      StatsRequest(),
      StatsResponse({
        type: request.type,
      }),
      config as ThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      StatsRequest(),
      StatsResponse({
        type: request.type,
      }),
      config as SafeRequestConfig
    );
  }
}
