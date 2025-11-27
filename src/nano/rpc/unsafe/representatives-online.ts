import { RepresentativesOnlineRequest } from "../requests/representatives-online";
import { RepresentativesOnlineResponse } from "../responses/representatives-online";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { representatives_online as safeRepresentativesOnline } from "../safe/representatives-online";
import { unwrapRpcResult } from "./utils";

export function representatives_online<const T extends RepresentativesOnlineRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  RepresentativesOnlineResponse<{
    WEIGHT: BoolFlag<WithDefault<T, "weight", false>["weight"]>;
  }>
>;
export function representatives_online(url: string, request: RepresentativesOnlineRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeRepresentativesOnline(url, request, config));
}
