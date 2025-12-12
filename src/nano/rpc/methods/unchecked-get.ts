import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { RequestConfig, SafeRequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { UncheckedGetRequest } from "../requests/unchecked-get";
import { UncheckedGetResponse } from "../responses/unchecked-get";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends UncheckedGetRequest> = UncheckedGetResponse<{
  JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
}>;

export function unchecked_get<const T extends UncheckedGetRequest>(
  url: string,
  request: T,
  config?: SafeRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function unchecked_get<const T extends UncheckedGetRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function unchecked_get<const T extends UncheckedGetRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function unchecked_get(url: string, request: UncheckedGetRequest, config?: RequestConfig) {
  if (config?.throwOnError === true) {
    return post(
      url,
      request,
      UncheckedGetRequest(),
      UncheckedGetResponse({
        json_block: request.json_block === true,
      }),
      config as ThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      UncheckedGetRequest(),
      UncheckedGetResponse({
        json_block: request.json_block === true,
      }),
      config as SafeRequestConfig
    );
  }
}
