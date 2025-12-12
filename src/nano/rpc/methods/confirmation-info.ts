import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { RequestConfig, SafeRequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { ConfirmationInfoRequest } from "../requests/confirmation-info";
import { ConfirmationInfoResponse } from "../responses/confirmation-info";
import { BoolFlag } from "./conditional-types/bool-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends ConfirmationInfoRequest> = ConfirmationInfoResponse<{
  CONTENTS: BoolFlag<WithDefault<T, "contents", true>["contents"]>;
  JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
  REPRESENTATIVES: BoolFlag<WithDefault<T, "representatives", false>["representatives"]>;
}>;

export function confirmation_info<const T extends ConfirmationInfoRequest>(
  url: string,
  request: T,
  config?: SafeRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function confirmation_info<const T extends ConfirmationInfoRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function confirmation_info<const T extends ConfirmationInfoRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function confirmation_info(url: string, request: ConfirmationInfoRequest, config?: RequestConfig) {
  if (config?.throwOnError === true) {
    return post(
      url,
      request,
      ConfirmationInfoRequest(),
      ConfirmationInfoResponse({
        contents: request.contents !== false,
        json_block: request.json_block === true,
        representatives: request.representatives === true,
      }),
      config as ThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      ConfirmationInfoRequest(),
      ConfirmationInfoResponse({
        contents: request.contents !== false,
        json_block: request.json_block === true,
        representatives: request.representatives === true,
      }),
      config as SafeRequestConfig
    );
  }
}
