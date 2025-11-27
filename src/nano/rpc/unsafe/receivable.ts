import { ReceivableRequest } from "../requests/receivable";
import { ReceivableResponse } from "../responses/receivable";
import { BoolFlag, RequestConfig, ThresholdFlag, WithDefault } from "../safe/post";
import { receivable as safeReceivable } from "../safe/receivable";
import { unwrapRpcResult } from "./utils";

export function receivable<const T extends ReceivableRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  ReceivableResponse<{
    MIN_VERSION: BoolFlag<WithDefault<T, "min_version", false>["min_version"]>;
    SOURCE: BoolFlag<WithDefault<T, "source", false>["source"]>;
    THRESHOLD: ThresholdFlag<WithDefault<T, "threshold", undefined>["threshold"]>;
  }>
>;
export function receivable(url: string, request: ReceivableRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeReceivable(url, request, config));
}
