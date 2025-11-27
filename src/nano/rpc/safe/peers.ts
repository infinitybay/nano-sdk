import { PeersRequest } from "../requests/peers";
import { PeersResponse } from "../responses/peers";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function peers<T extends PeersRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    PeersResponse<{
      PEER_DETAILS: BoolFlag<WithDefault<T, "peer_details", false>["peer_details"]>;
    }>
  >
>;
export function peers(url: string, request: PeersRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    PeersRequest(),
    PeersResponse({
      peer_details: request.peer_details === true,
    }),
    config
  );
}
