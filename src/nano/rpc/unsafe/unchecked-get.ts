import { UncheckedGetRequest } from "../requests/unchecked-get";
import { UncheckedGetResponse } from "../responses/unchecked-get";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { unchecked_get as safeUncheckedGet } from "../safe/unchecked-get";
import { unwrapRpcResult } from "./utils";

export function unchecked_get<T extends UncheckedGetRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  UncheckedGetResponse<{
    JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
  }>
>;
export function unchecked_get(url: string, request: UncheckedGetRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeUncheckedGet(url, request, config));
}
