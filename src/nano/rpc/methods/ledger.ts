import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { RequestConfig, SafeRequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { LedgerRequest } from "../requests/ledger";
import { LedgerResponse } from "../responses/ledger";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends LedgerRequest> = LedgerResponse<{
  RECEIVABLE: BoolFlag<WithDefault<T, "receivable", false>["receivable"]>;
  REPRESENTATIVE: BoolFlag<WithDefault<T, "representative", false>["representative"]>;
  WEIGHT: BoolFlag<WithDefault<T, "weight", false>["weight"]>;
}>;

export function ledger<const T extends LedgerRequest>(
  url: string,
  request: T,
  config?: SafeRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function ledger<const T extends LedgerRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function ledger<const T extends LedgerRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function ledger(url: string, request: LedgerRequest, config?: RequestConfig) {
  if (config?.throwOnError === true) {
    return post(
      url,
      request,
      LedgerRequest(),
      LedgerResponse({
        receivable: request.receivable === true,
        representative: request.representative === true,
        weight: request.weight === true,
      }),
      config as ThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      LedgerRequest(),
      LedgerResponse({
        receivable: request.receivable === true,
        representative: request.representative === true,
        weight: request.weight === true,
      }),
      config as SafeRequestConfig
    );
  }
}
