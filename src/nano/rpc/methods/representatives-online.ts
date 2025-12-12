import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { RequestConfig, SafeRequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { RepresentativesOnlineRequest } from "../requests/representatives-online";
import { RepresentativesOnlineResponse } from "../responses/representatives-online";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends RepresentativesOnlineRequest> = RepresentativesOnlineResponse<{
  WEIGHT: BoolFlag<WithDefault<T, "weight", false>["weight"]>;
}>;

export function representatives_online<const T extends RepresentativesOnlineRequest>(
  url: string,
  request: T,
  config?: SafeRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function representatives_online<const T extends RepresentativesOnlineRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function representatives_online<const T extends RepresentativesOnlineRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function representatives_online(url: string, request: RepresentativesOnlineRequest, config?: RequestConfig) {
  if (config?.throwOnError === true) {
    return post(
      url,
      request,
      RepresentativesOnlineRequest(),
      RepresentativesOnlineResponse({
        weight: request.weight === true,
      }),
      config as ThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      RepresentativesOnlineRequest(),
      RepresentativesOnlineResponse({
        weight: request.weight === true,
      }),
      config as SafeRequestConfig
    );
  }
}
