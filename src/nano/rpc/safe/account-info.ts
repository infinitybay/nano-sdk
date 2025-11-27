import { AccountInfoRequest } from "../requests/account-info";
import { AccountInfoResponse } from "../responses/account-info";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function account_info<T extends AccountInfoRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    AccountInfoResponse<{
      REPRESENTATIVE: BoolFlag<WithDefault<T, "representative", false>["representative"]>;
      WEIGHT: BoolFlag<WithDefault<T, "weight", false>["weight"]>;
      RECEIVABLE: BoolFlag<WithDefault<T, "receivable", false>["receivable"]>;
      INCLUDE_CONFIRMED: BoolFlag<WithDefault<T, "include_confirmed", false>["include_confirmed"]>;
    }>
  >
>;
export function account_info(url: string, request: AccountInfoRequest, config?: RequestConfig) {
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
    config
  );
}
