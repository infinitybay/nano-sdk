import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { NonThrowingRequestConfig, RequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { PeersRequest } from "../requests/peers";
import { PeersResponse } from "../responses/peers";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends PeersRequest> = PeersResponse<{
  PEER_DETAILS: BoolFlag<WithDefault<T, "peer_details", false>["peer_details"]>;
}>;

export function peers<const T extends PeersRequest>(
  url: string,
  request: T,
  config?: NonThrowingRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function peers<const T extends PeersRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function peers<const T extends PeersRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function peers(url: string, request: PeersRequest, config?: RequestConfig) {
  if (config?.throwOnError === false) {
    return post(
      url,
      request,
      PeersRequest(),
      PeersResponse({
        peer_details: request.peer_details === true,
      }),
      config as NonThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      PeersRequest(),
      PeersResponse({
        peer_details: request.peer_details === true,
      }),
      config as ThrowingRequestConfig
    );
  }
}
