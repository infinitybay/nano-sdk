import { AccountInfoRequest } from "../requests/account-info";
import { AccountInfoResponse } from "../responses/account-info";
import { account_info as safeAccountInfo } from "../safe/account-info";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { unwrapRpcResult } from "./utils";

export function account_info<T extends AccountInfoRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  AccountInfoResponse<{
    REPRESENTATIVE: BoolFlag<WithDefault<T, "representative", false>["representative"]>;
    WEIGHT: BoolFlag<WithDefault<T, "weight", false>["weight"]>;
    RECEIVABLE: BoolFlag<WithDefault<T, "receivable", false>["receivable"]>;
    INCLUDE_CONFIRMED: BoolFlag<WithDefault<T, "include_confirmed", false>["include_confirmed"]>;
  }>
>;
export function account_info(url: string, request: AccountInfoRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeAccountInfo(url, request, config));
}
