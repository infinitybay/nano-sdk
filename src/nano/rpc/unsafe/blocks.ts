import { BlocksRequest } from "../requests/blocks";
import { BlocksResponse } from "../responses/blocks";
import { blocks as safeBlocks } from "../safe/blocks";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { unwrapRpcResult } from "./utils";

export function blocks<T extends BlocksRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  BlocksResponse<{
    JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
  }>
>;
export function blocks(url: string, request: BlocksRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeBlocks(url, request, config));
}
