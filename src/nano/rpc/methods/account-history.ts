import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { RequestConfig, SafeRequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { AccountHistoryRequest } from "../requests/account-history";
import { AccountHistoryResponse } from "../responses/account-history";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends AccountHistoryRequest> = AccountHistoryResponse<{
  INCLUDE_LINKED_ACCOUNT: BoolFlag<WithDefault<T, "include_linked_account", false>["include_linked_account"]>;
  RAW: BoolFlag<WithDefault<T, "raw", false>["raw"]>;
  REVERSE: BoolFlag<WithDefault<T, "reverse", false>["reverse"]>;
}>;

export function account_history<const T extends AccountHistoryRequest>(
  url: string,
  request: T,
  config?: SafeRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function account_history<const T extends AccountHistoryRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function account_history<const T extends AccountHistoryRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function account_history(url: string, request: AccountHistoryRequest, config?: RequestConfig) {
  if (config?.throwOnError === true) {
    return post(
      url,
      request,
      AccountHistoryRequest(),
      AccountHistoryResponse({
        include_linked_account: request.include_linked_account === true,
        raw: request.raw === true,
        reverse: request.reverse === true,
      }),
      config as ThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      AccountHistoryRequest(),
      AccountHistoryResponse({
        include_linked_account: request.include_linked_account === true,
        raw: request.raw === true,
        reverse: request.reverse === true,
      }),
      config as SafeRequestConfig
    );
  }
}
