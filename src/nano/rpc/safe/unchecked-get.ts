import { UncheckedGetRequest } from "../requests/unchecked-get";
import { UncheckedGetResponse } from "../responses/unchecked-get";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function unchecked_get<T extends UncheckedGetRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    UncheckedGetResponse<{
      JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
    }>
  >
>;
export function unchecked_get(url: string, request: UncheckedGetRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    UncheckedGetRequest(),
    UncheckedGetResponse({
      json_block: request.json_block === true,
    }),
    config
  );
}
