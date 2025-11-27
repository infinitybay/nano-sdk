import { RepresentativesOnlineRequest } from "../requests/representatives-online";
import { RepresentativesOnlineResponse } from "../responses/representatives-online";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function representatives_online<const T extends RepresentativesOnlineRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    RepresentativesOnlineResponse<{
      WEIGHT: BoolFlag<WithDefault<T, "weight", false>["weight"]>;
    }>
  >
>;
export function representatives_online(url: string, request: RepresentativesOnlineRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    RepresentativesOnlineRequest(),
    RepresentativesOnlineResponse({
      weight: request.weight === true,
    }),
    config
  );
}
