import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { NonThrowingRequestConfig, RequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { UncheckedKeysRequest } from "../requests/unchecked-keys";
import { UncheckedKeysResponse } from "../responses/unchecked-keys";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends UncheckedKeysRequest> = UncheckedKeysResponse<{
  JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
}>;

export function unchecked_keys<const T extends UncheckedKeysRequest>(
  url: string,
  request: T,
  config?: NonThrowingRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function unchecked_keys<const T extends UncheckedKeysRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function unchecked_keys<const T extends UncheckedKeysRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function unchecked_keys(url: string, request: UncheckedKeysRequest, config?: RequestConfig) {
  if (config?.throwOnError === false) {
    return post(
      url,
      request,
      UncheckedKeysRequest(),
      UncheckedKeysResponse({
        json_block: request.json_block === true,
      }),
      config as NonThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      UncheckedKeysRequest(),
      UncheckedKeysResponse({
        json_block: request.json_block === true,
      }),
      config as ThrowingRequestConfig
    );
  }
}
