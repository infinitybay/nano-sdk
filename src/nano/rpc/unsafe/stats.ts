import { StatsRequest } from "../requests/stats";
import { StatsResponse } from "../responses/stats";
import { RequestConfig } from "../safe/post";
import { stats as safeStats } from "../safe/stats";
import { unwrapRpcResult } from "./utils";

export function stats<const T extends StatsRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  StatsResponse<{
    TYPE: T["type"];
  }>
>;
export function stats(url: string, request: StatsRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeStats(url, request, config));
}
