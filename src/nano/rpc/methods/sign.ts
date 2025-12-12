import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { RequestConfig, SafeRequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { SignRequest } from "../requests/sign";
import { SignResponse } from "../responses/sign";
import { NotUndefinedFlag } from "./conditional-types/not-undefined-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends SignRequest> = SignResponse<{
  BLOCK: NotUndefinedFlag<WithDefault<T, "block", undefined>["block"]>;
}>;

export function sign<const T extends SignRequest>(
  url: string,
  request: T,
  config?: SafeRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function sign<const T extends SignRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function sign<const T extends SignRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function sign(url: string, request: SignRequest, config?: RequestConfig) {
  if (config?.throwOnError === true) {
    return post(
      url,
      request,
      SignRequest(),
      SignResponse({
        block: request.block !== undefined,
      }),
      config as ThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      SignRequest(),
      SignResponse({
        block: request.block !== undefined,
      }),
      config as SafeRequestConfig
    );
  }
}
