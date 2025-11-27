import { PeersRequest } from "../requests/peers";
import { PeersResponse } from "../responses/peers";
import { peers as safePeers } from "../safe/peers";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { unwrapRpcResult } from "./utils";

export function peers<T extends PeersRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  PeersResponse<{
    PEER_DETAILS: BoolFlag<WithDefault<T, "peer_details", false>["peer_details"]>;
  }>
>;
export function peers(url: string, request: PeersRequest, config?: RequestConfig) {
  return unwrapRpcResult(safePeers(url, request, config));
}
