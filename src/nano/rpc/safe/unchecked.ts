import { UncheckedRequest } from "../requests/unchecked";
import { UncheckedResponse } from "../responses/unchecked";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function unchecked<T extends UncheckedRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    UncheckedResponse<{
      JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
    }>
  >
>;
export function unchecked(url: string, request: UncheckedRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    UncheckedRequest(),
    UncheckedResponse({
      json_block: request.json_block === true,
    }),
    config
  );
}
