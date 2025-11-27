import { AccountsReceivableRequest } from "../requests/accounts-receivable";
import { AccountsReceivableResponse } from "../responses/accounts-receivable";
import { BoolFlag, post, RequestConfig, Response, ThresholdFlag, WithDefault } from "./post";

export function accounts_receivable<const T extends AccountsReceivableRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    AccountsReceivableResponse<{
      SOURCE: BoolFlag<WithDefault<T, "source", false>["source"]>;
      THRESHOLD: ThresholdFlag<WithDefault<T, "threshold", undefined>["threshold"]>;
    }>
  >
>;
export function accounts_receivable(url: string, request: AccountsReceivableRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    AccountsReceivableRequest(),
    AccountsReceivableResponse({
      source: request.source === true,
      threshold: request.threshold !== undefined && request.threshold !== "" && request.threshold !== "0",
    }),
    config
  );
}
