import { ConfirmationInfoRequest } from "../requests/confirmation-info";
import { ConfirmationInfoResponse } from "../responses/confirmation-info";
import { confirmation_info as safeConfirmationInfo } from "../safe/confirmation-info";
import { BoolFlag, RequestConfig, WithDefault } from "../safe/post";
import { unwrapRpcResult } from "./utils";

export function confirmation_info<T extends ConfirmationInfoRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  ConfirmationInfoResponse<{
    CONTENTS: BoolFlag<WithDefault<T, "contents", true>["contents"]>;
    JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
    REPRESENTATIVES: BoolFlag<WithDefault<T, "representatives", false>["representatives"]>;
  }>
>;
export function confirmation_info(url: string, request: ConfirmationInfoRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeConfirmationInfo(url, request, config));
}
