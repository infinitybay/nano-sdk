import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { NonThrowingRequestConfig, RequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { BlockCreateRequest } from "../requests/block-create";
import { BlockCreateResponse } from "../responses/block-create";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends BlockCreateRequest> = BlockCreateResponse<{
  JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
}>;

export function block_create<const T extends BlockCreateRequest>(
  url: string,
  request: T,
  config?: NonThrowingRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function block_create<const T extends BlockCreateRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function block_create<const T extends BlockCreateRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function block_create(url: string, request: BlockCreateRequest, config?: RequestConfig) {
  if (config?.throwOnError === false) {
    return post(
      url,
      request,
      BlockCreateRequest(),
      BlockCreateResponse({
        json_block: request.json_block === true,
      }),
      config as NonThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      BlockCreateRequest(),
      BlockCreateResponse({
        json_block: request.json_block === true,
      }),
      config as ThrowingRequestConfig
    );
  }
}
