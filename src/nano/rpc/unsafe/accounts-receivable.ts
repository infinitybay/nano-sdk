import { AccountsReceivableRequest } from "../requests/accounts-receivable";
import { AccountsReceivableResponse } from "../responses/accounts-receivable";
import { accounts_receivable as safeAccountsReceivable } from "../safe/accounts-receivable";
import { BoolFlag, RequestConfig, ThresholdFlag, WithDefault } from "../safe/post";
import { unwrapRpcResult } from "./utils";

export function accounts_receivable<const T extends AccountsReceivableRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  AccountsReceivableResponse<{
    SOURCE: BoolFlag<WithDefault<T, "source", false>["source"]>;
    THRESHOLD: ThresholdFlag<WithDefault<T, "threshold", undefined>["threshold"]>;
  }>
>;
export function accounts_receivable(url: string, request: AccountsReceivableRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeAccountsReceivable(url, request, config));
}
