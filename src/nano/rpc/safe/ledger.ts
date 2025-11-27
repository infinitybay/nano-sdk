import { LedgerRequest } from "../requests/ledger";
import { LedgerResponse } from "../responses/ledger";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function ledger<T extends LedgerRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    LedgerResponse<{
      RECEIVABLE: BoolFlag<WithDefault<T, "receivable", false>["receivable"]>;
      REPRESENTATIVE: BoolFlag<WithDefault<T, "representative", false>["representative"]>;
      WEIGHT: BoolFlag<WithDefault<T, "weight", false>["weight"]>;
    }>
  >
>;
export function ledger(url: string, request: LedgerRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    LedgerRequest(),
    LedgerResponse({
      receivable: request.receivable === true,
      representative: request.representative === true,
      weight: request.weight === true,
    }),
    config
  );
}
