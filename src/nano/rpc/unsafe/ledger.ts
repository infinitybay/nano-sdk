import { LedgerRequest } from "../requests/ledger";
import { LedgerResponse } from "../responses/ledger";
import { ledger as safeLedger } from "../safe/ledger";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { unwrapRpcResult } from "./utils";

export function ledger<T extends LedgerRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  LedgerResponse<{
    RECEIVABLE: BoolFlag<WithDefault<T, "receivable", false>["receivable"]>;
    REPRESENTATIVE: BoolFlag<WithDefault<T, "representative", false>["representative"]>;
    WEIGHT: BoolFlag<WithDefault<T, "weight", false>["weight"]>;
  }>
>;
export function ledger(url: string, request: LedgerRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeLedger(url, request, config));
}
