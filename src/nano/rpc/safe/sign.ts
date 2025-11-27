import { SignRequest } from "../requests/sign";
import { SignResponse } from "../responses/sign";
import { NotUndefinedFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function sign<const T extends SignRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    SignResponse<{
      BLOCK: NotUndefinedFlag<WithDefault<T, "block", undefined>["block"]>;
    }>
  >
>;
export function sign(url: string, request: SignRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    SignRequest(),
    SignResponse({
      block: request.block !== undefined,
    }),
    config
  );
}
