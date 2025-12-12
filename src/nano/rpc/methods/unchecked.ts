import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { RequestConfig, SafeRequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { UncheckedRequest } from "../requests/unchecked";
import { UncheckedResponse } from "../responses/unchecked";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends UncheckedRequest> = UncheckedResponse<{
  JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
}>;

export function unchecked<const T extends UncheckedRequest>(
  url: string,
  request: T,
  config?: SafeRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function unchecked<const T extends UncheckedRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function unchecked<const T extends UncheckedRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function unchecked(url: string, request: UncheckedRequest, config?: RequestConfig) {
  if (config?.throwOnError === true) {
    return post(
      url,
      request,
      UncheckedRequest(),
      UncheckedResponse({
        json_block: request.json_block === true,
      }),
      config as ThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      UncheckedRequest(),
      UncheckedResponse({
        json_block: request.json_block === true,
      }),
      config as SafeRequestConfig
    );
  }
}
