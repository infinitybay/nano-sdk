import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { NonThrowingRequestConfig, RequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { ReceivableRequest } from "../requests/receivable";
import { ReceivableResponse } from "../responses/receivable";
import { BoolFlag } from "./conditional-types/bool-flag";
import { ThresholdFlag } from "./conditional-types/threshold-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends ReceivableRequest> = ReceivableResponse<{
  MIN_VERSION: BoolFlag<WithDefault<T, "min_version", false>["min_version"]>;
  SORTING: BoolFlag<WithDefault<T, "sorting", false>["sorting"]>;
  SOURCE: BoolFlag<WithDefault<T, "source", false>["source"]>;
  THRESHOLD: ThresholdFlag<WithDefault<T, "threshold", undefined>["threshold"]>;
}>;

export function receivable<const T extends ReceivableRequest>(
  url: string,
  request: T,
  config?: NonThrowingRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function receivable<const T extends ReceivableRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function receivable<const T extends ReceivableRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function receivable(url: string, request: ReceivableRequest, config?: RequestConfig) {
  if (config?.throwOnError === false) {
    return post(
      url,
      request,
      ReceivableRequest(),
      ReceivableResponse({
        min_version: request.min_version === true,
        sorting: request.sorting === true,
        source: request.source === true,
        threshold: request.threshold !== undefined && request.threshold !== "0",
      }),
      config as NonThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      ReceivableRequest(),
      ReceivableResponse({
        min_version: request.min_version === true,
        sorting: request.sorting === true,
        source: request.source === true,
        threshold: request.threshold !== undefined && request.threshold !== "0",
      }),
      config as ThrowingRequestConfig
    );
  }
}
