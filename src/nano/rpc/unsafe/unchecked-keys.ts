import { UncheckedKeysRequest } from "../requests/unchecked-keys";
import { UncheckedKeysResponse } from "../responses/unchecked-keys";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { unchecked_keys as safeUncheckedKeys } from "../safe/unchecked-keys";
import { unwrapRpcResult } from "./utils";

export function unchecked_keys<T extends UncheckedKeysRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  UncheckedKeysResponse<{
    JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
  }>
>;
export function unchecked_keys(url: string, request: UncheckedKeysRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeUncheckedKeys(url, request, config));
}
