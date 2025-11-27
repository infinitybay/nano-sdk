import { SignRequest } from "../requests/sign";
import { SignResponse } from "../responses/sign";
import { NotUndefinedFlag, RequestConfig, WithDefault } from "../safe/post";
import { sign as safeSign } from "../safe/sign";
import { unwrapRpcResult } from "./utils";

export function sign<const T extends SignRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  SignResponse<{
    BLOCK: NotUndefinedFlag<WithDefault<T, "block", undefined>["block"]>;
  }>
>;
export function sign(url: string, request: SignRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeSign(url, request, config));
}
