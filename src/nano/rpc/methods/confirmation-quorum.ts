import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { RequestConfig, SafeRequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { ConfirmationQuorumRequest } from "../requests/confirmation-quorum";
import { ConfirmationQuorumResponse } from "../responses/confirmation-quorum";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends ConfirmationQuorumRequest> = ConfirmationQuorumResponse<{
  PEER_DETAILS: BoolFlag<WithDefault<T, "peer_details", false>["peer_details"]>;
}>;

export function confirmation_quorum<const T extends ConfirmationQuorumRequest>(
  url: string,
  request: T,
  config?: SafeRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function confirmation_quorum<const T extends ConfirmationQuorumRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function confirmation_quorum<const T extends ConfirmationQuorumRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function confirmation_quorum(url: string, request: ConfirmationQuorumRequest, config?: RequestConfig) {
  if (config?.throwOnError === true) {
    return post(
      url,
      request,
      ConfirmationQuorumRequest(),
      ConfirmationQuorumResponse({
        peer_details: request.peer_details === true,
      }),
      config as ThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      ConfirmationQuorumRequest(),
      ConfirmationQuorumResponse({
        peer_details: request.peer_details === true,
      }),
      config as SafeRequestConfig
    );
  }
}
