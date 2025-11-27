import { ConfirmationInfoRequest } from "../requests/confirmation-info";
import { ConfirmationInfoResponse } from "../responses/confirmation-info";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function confirmation_info<T extends ConfirmationInfoRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    ConfirmationInfoResponse<{
      CONTENTS: BoolFlag<WithDefault<T, "contents", true>["contents"]>;
      JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
      REPRESENTATIVES: BoolFlag<WithDefault<T, "representatives", false>["representatives"]>;
    }>
  >
>;
export function confirmation_info(url: string, request: ConfirmationInfoRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    ConfirmationInfoRequest(),
    ConfirmationInfoResponse({
      contents: request.contents !== false,
      json_block: request.json_block === true,
      representatives: request.representatives === true,
    }),
    config
  );
}
