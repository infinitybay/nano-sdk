import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { NonThrowingRequestConfig, RequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { BlocksRequest } from "../requests/blocks";
import { BlocksResponse } from "../responses/blocks";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends BlocksRequest> = BlocksResponse<{
  JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
}>;

export function blocks<const T extends BlocksRequest>(
  url: string,
  request: T,
  config?: NonThrowingRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function blocks<const T extends BlocksRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function blocks<const T extends BlocksRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function blocks(url: string, request: BlocksRequest, config?: RequestConfig) {
  if (config?.throwOnError === false) {
    return post(
      url,
      request,
      BlocksRequest(),
      BlocksResponse({
        json_block: request.json_block === true,
      }),
      config as NonThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      BlocksRequest(),
      BlocksResponse({
        json_block: request.json_block === true,
      }),
      config as ThrowingRequestConfig
    );
  }
}
