import { ConfirmationQuorumRequest } from "../requests/confirmation-quorum";
import { ConfirmationQuorumResponse } from "../responses/confirmation-quorum";
import { confirmation_quorum as safeConfirmationQuorum } from "../safe/confirmation-quorum";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { unwrapRpcResult } from "./utils";

export function confirmation_quorum<T extends ConfirmationQuorumRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  ConfirmationQuorumResponse<{
    PEER_DETAILS: BoolFlag<WithDefault<T, "peer_details", false>["peer_details"]>;
  }>
>;
export function confirmation_quorum(url: string, request: ConfirmationQuorumRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeConfirmationQuorum(url, request, config));
}
