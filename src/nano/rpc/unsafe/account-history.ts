import { AccountHistoryRequest } from "../requests/account-history";
import { AccountHistoryResponse } from "../responses/account-history";
import { account_history as safeAccountHistory } from "../safe/account-history";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { unwrapRpcResult } from "./utils";

export function account_history<T extends AccountHistoryRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  AccountHistoryResponse<{
    INCLUDE_LINKED_ACCOUNT: BoolFlag<WithDefault<T, "include_linked_account", false>["include_linked_account"]>;
    RAW: BoolFlag<WithDefault<T, "raw", false>["raw"]>;
    REVERSE: BoolFlag<WithDefault<T, "reverse", false>["reverse"]>;
  }>
>;
export function account_history(url: string, request: AccountHistoryRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeAccountHistory(url, request, config));
}
