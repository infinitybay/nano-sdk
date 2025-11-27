import { ConfirmationQuorumRequest } from "../requests/confirmation-quorum";
import { ConfirmationQuorumResponse } from "../responses/confirmation-quorum";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function confirmation_quorum<T extends ConfirmationQuorumRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    ConfirmationQuorumResponse<{
      PEER_DETAILS: BoolFlag<WithDefault<T, "peer_details", false>["peer_details"]>;
    }>
  >
>;
export function confirmation_quorum(url: string, request: ConfirmationQuorumRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    ConfirmationQuorumRequest(),
    ConfirmationQuorumResponse({
      peer_details: request.peer_details === true,
    }),
    config
  );
}
