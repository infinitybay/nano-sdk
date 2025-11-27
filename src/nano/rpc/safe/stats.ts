import { StatsRequest } from "../requests/stats";
import { StatsResponse } from "../responses/stats";
import { post, RequestConfig, Response } from "./post";

export function stats<const T extends StatsRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    StatsResponse<{
      TYPE: T["type"];
    }>
  >
>;
export function stats(url: string, request: StatsRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    StatsRequest(),
    StatsResponse({
      type: request.type,
    }),
    config
  );
}
