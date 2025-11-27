import { ProcessRequest } from "../requests/process";
import { ProcessResponse } from "../responses/process";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { process as safeProcess } from "../safe/process";
import { unwrapRpcResult } from "./utils";

export function process<const T extends ProcessRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  ProcessResponse<{
    ASYNC: BoolFlag<WithDefault<T, "async", false>["async"]>;
  }>
>;
export function process(url: string, request: ProcessRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeProcess(url, request, config));
}
