import { AccountHistoryRequest } from "../requests/account-history";
import { AccountHistoryResponse } from "../responses/account-history";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function account_history<T extends AccountHistoryRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    AccountHistoryResponse<{
      INCLUDE_LINKED_ACCOUNT: BoolFlag<WithDefault<T, "include_linked_account", false>["include_linked_account"]>;
      RAW: BoolFlag<WithDefault<T, "raw", false>["raw"]>;
      REVERSE: BoolFlag<WithDefault<T, "reverse", false>["reverse"]>;
    }>
  >
>;
export function account_history(url: string, request: AccountHistoryRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    AccountHistoryRequest(),
    AccountHistoryResponse({
      include_linked_account: request.include_linked_account === true,
      raw: request.raw === true,
      reverse: request.reverse === true,
    }),
    config
  );
}
