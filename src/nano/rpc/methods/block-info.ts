import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { RequestConfig, SafeRequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { BlockInfoRequest } from "../requests/block-info";
import { BlockInfoResponse } from "../responses/block-info";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends BlockInfoRequest> = BlockInfoResponse<{
  INCLUDE_LINKED_ACCOUNT: BoolFlag<WithDefault<T, "include_linked_account", false>["include_linked_account"]>;
  JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
}>;

export function block_info<const T extends BlockInfoRequest>(
  url: string,
  request: T,
  config?: SafeRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function block_info<const T extends BlockInfoRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function block_info<const T extends BlockInfoRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function block_info(url: string, request: BlockInfoRequest, config?: RequestConfig) {
  if (config?.throwOnError === true) {
    return post(
      url,
      request,
      BlockInfoRequest(),
      BlockInfoResponse({
        include_linked_account: request.include_linked_account === true,
        json_block: request.json_block === true,
      }),
      config as ThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      BlockInfoRequest(),
      BlockInfoResponse({
        include_linked_account: request.include_linked_account === true,
        json_block: request.json_block === true,
      }),
      config as SafeRequestConfig
    );
  }
}
