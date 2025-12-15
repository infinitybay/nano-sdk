import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { NonThrowingRequestConfig, RequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { ProcessRequest } from "../requests/process";
import { ProcessResponse } from "../responses/process";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends ProcessRequest> = ProcessResponse<{
  ASYNC: BoolFlag<WithDefault<T, "async", false>["async"]>;
}>;

export function process<const T extends ProcessRequest>(
  url: string,
  request: T,
  config?: NonThrowingRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function process<const T extends ProcessRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function process<const T extends ProcessRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function process(url: string, request: ProcessRequest, config?: RequestConfig) {
  if (config?.throwOnError === false) {
    return post(
      url,
      request,
      ProcessRequest(),
      ProcessResponse({
        async: request.async === true,
      }),
      config as NonThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      ProcessRequest(),
      ProcessResponse({
        async: request.async === true,
      }),
      config as ThrowingRequestConfig
    );
  }
}
