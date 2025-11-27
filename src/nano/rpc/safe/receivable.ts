import { ReceivableRequest } from "../requests/receivable";
import { ReceivableResponse } from "../responses/receivable";
import { BoolFlag, post, RequestConfig, Response, ThresholdFlag, WithDefault } from "./post";

export function receivable<const T extends ReceivableRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    ReceivableResponse<{
      MIN_VERSION: BoolFlag<WithDefault<T, "min_version", false>["min_version"]>;
      SOURCE: BoolFlag<WithDefault<T, "source", false>["source"]>;
      THRESHOLD: ThresholdFlag<WithDefault<T, "threshold", undefined>["threshold"]>;
    }>
  >
>;
export function receivable(url: string, request: ReceivableRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    ReceivableRequest(),
    ReceivableResponse({
      min_version: request.min_version === true,
      source: request.source === true,
      threshold: request.threshold !== undefined && request.threshold !== "" && request.threshold !== "0",
    }),
    config
  );
}
