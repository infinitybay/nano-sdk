import { BlocksInfoRequest } from "../requests/blocks-info";
import { BlocksInfoResponse } from "../responses/blocks-info";
import { blocks_info as safeBlocksInfo } from "../safe/blocks-info";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { unwrapRpcResult } from "./utils";

export function blocks_info<T extends BlocksInfoRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  BlocksInfoResponse<{
    INCLUDE_LINKED_ACCOUNT: BoolFlag<WithDefault<T, "include_linked_account", false>["include_linked_account"]>;
    INCLUDE_NOT_FOUND: BoolFlag<WithDefault<T, "include_not_found", false>["include_not_found"]>;
    JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
    RECEIVABLE: BoolFlag<WithDefault<T, "receivable", false>["receivable"]>;
    RECEIVE_HASH: BoolFlag<WithDefault<T, "receive_hash", false>["receive_hash"]>;
    SOURCE: BoolFlag<WithDefault<T, "source", false>["source"]>;
  }>
>;
export function blocks_info(url: string, request: BlocksInfoRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeBlocksInfo(url, request, config));
}
