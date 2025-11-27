import { UncheckedRequest } from "../requests/unchecked";
import { UncheckedResponse } from "../responses/unchecked";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { unchecked as safeUnchecked } from "../safe/unchecked";
import { unwrapRpcResult } from "./utils";

export function unchecked<T extends UncheckedRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  UncheckedResponse<{
    JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
  }>
>;
export function unchecked(url: string, request: UncheckedRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeUnchecked(url, request, config));
}
