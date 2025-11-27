import { BlockCreateRequest } from "../requests/block-create";
import { BlockCreateResponse } from "../responses/block-create";
import { block_create as safeBlockCreate } from "../safe/block-create";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { unwrapRpcResult } from "./utils";

export function block_create<const T extends BlockCreateRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  BlockCreateResponse<{
    JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
  }>
>;
export function block_create(url: string, request: BlockCreateRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeBlockCreate(url, request, config));
}
