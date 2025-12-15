import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { NonThrowingRequestConfig, RequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { AccountInfoRequest } from "../requests/account-info";
import { AccountInfoResponse } from "../responses/account-info";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends AccountInfoRequest> = AccountInfoResponse<{
  REPRESENTATIVE: BoolFlag<WithDefault<T, "representative", false>["representative"]>;
  WEIGHT: BoolFlag<WithDefault<T, "weight", false>["weight"]>;
  RECEIVABLE: BoolFlag<WithDefault<T, "receivable", false>["receivable"]>;
  INCLUDE_CONFIRMED: BoolFlag<WithDefault<T, "include_confirmed", false>["include_confirmed"]>;
}>;

export function account_info<const T extends AccountInfoRequest>(
  url: string,
  request: T,
  config?: NonThrowingRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function account_info<const T extends AccountInfoRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function account_info<const T extends AccountInfoRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function account_info(url: string, request: AccountInfoRequest, config?: RequestConfig) {
  if (config?.throwOnError === false) {
    return post(
      url,
      request,
      AccountInfoRequest(),
      AccountInfoResponse({
        representative: request.representative === true,
        weight: request.weight === true,
        receivable: request.receivable === true,
        include_confirmed: request.include_confirmed === true,
      }),
      config as NonThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      AccountInfoRequest(),
      AccountInfoResponse({
        representative: request.representative === true,
        weight: request.weight === true,
        receivable: request.receivable === true,
        include_confirmed: request.include_confirmed === true,
      }),
      config as ThrowingRequestConfig
    );
  }
}
