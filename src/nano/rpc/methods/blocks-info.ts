import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { RequestConfig, SafeRequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { BlocksInfoRequest } from "../requests/blocks-info";
import { BlocksInfoResponse } from "../responses/blocks-info";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends BlocksInfoRequest> = BlocksInfoResponse<{
  INCLUDE_LINKED_ACCOUNT: BoolFlag<WithDefault<T, "include_linked_account", false>["include_linked_account"]>;
  INCLUDE_NOT_FOUND: BoolFlag<WithDefault<T, "include_not_found", false>["include_not_found"]>;
  JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
  RECEIVABLE: BoolFlag<WithDefault<T, "receivable", false>["receivable"]>;
  RECEIVE_HASH: BoolFlag<WithDefault<T, "receive_hash", false>["receive_hash"]>;
  SOURCE: BoolFlag<WithDefault<T, "source", false>["source"]>;
}>;

export function blocks_info<const T extends BlocksInfoRequest>(
  url: string,
  request: T,
  config?: SafeRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function blocks_info<const T extends BlocksInfoRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function blocks_info<const T extends BlocksInfoRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function blocks_info(url: string, request: BlocksInfoRequest, config?: RequestConfig) {
  if (config?.throwOnError === true) {
    return post(
      url,
      request,
      BlocksInfoRequest(),
      BlocksInfoResponse({
        include_linked_account: request.include_linked_account === true,
        include_not_found: request.include_not_found === true,
        json_block: request.json_block === true,
        receivable: request.receivable === true,
        receive_hash: request.receive_hash === true,
        source: request.source === true,
      }),
      config as ThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      BlocksInfoRequest(),
      BlocksInfoResponse({
        include_linked_account: request.include_linked_account === true,
        include_not_found: request.include_not_found === true,
        json_block: request.json_block === true,
        receivable: request.receivable === true,
        receive_hash: request.receive_hash === true,
        source: request.source === true,
      }),
      config as SafeRequestConfig
    );
  }
}
