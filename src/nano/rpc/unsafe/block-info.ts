import { BlockInfoRequest } from "../requests/block-info";
import { BlockInfoResponse } from "../responses/block-info";
import { block_info as safeBlockInfo } from "../safe/block-info";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { unwrapRpcResult } from "./utils";

export function block_info<T extends BlockInfoRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  BlockInfoResponse<{
    INCLUDE_LINKED_ACCOUNT: BoolFlag<WithDefault<T, "include_linked_account", false>["include_linked_account"]>;
    JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
  }>
>;
export function block_info(url: string, request: BlockInfoRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeBlockInfo(url, request, config));
}
