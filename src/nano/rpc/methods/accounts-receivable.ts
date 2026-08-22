import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { NonThrowingRequestConfig, RequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { AccountsReceivableRequest } from "../requests/accounts-receivable";
import { AccountsReceivableResponse } from "../responses/accounts-receivable";
import { BoolFlag } from "./conditional-types/bool-flag";
import { ThresholdFlag } from "./conditional-types/threshold-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends AccountsReceivableRequest> = AccountsReceivableResponse<{
  SORTING: BoolFlag<WithDefault<T, "sorting", false>["sorting"]>;
  SOURCE: BoolFlag<WithDefault<T, "source", false>["source"]>;
  THRESHOLD: ThresholdFlag<WithDefault<T, "threshold", undefined>["threshold"]>;
}>;

export function accounts_receivable<const T extends AccountsReceivableRequest>(
  url: string,
  request: T,
  config?: NonThrowingRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function accounts_receivable<const T extends AccountsReceivableRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function accounts_receivable<const T extends AccountsReceivableRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function accounts_receivable(url: string, request: AccountsReceivableRequest, config?: RequestConfig) {
  if (config?.throwOnError === false) {
    return post(
      url,
      request,
      AccountsReceivableRequest(),
      AccountsReceivableResponse({
        sorting: request.sorting === true,
        source: request.source === true,
        threshold: request.threshold !== undefined && request.threshold !== "" && request.threshold !== "0",
      }),
      config as NonThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      AccountsReceivableRequest(),
      AccountsReceivableResponse({
        sorting: request.sorting === true,
        source: request.source === true,
        threshold: request.threshold !== undefined && request.threshold !== "" && request.threshold !== "0",
      }),
      config as ThrowingRequestConfig
    );
  }
}
