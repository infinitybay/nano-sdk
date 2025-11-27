import { UncheckedKeysRequest } from "../requests/unchecked-keys";
import { UncheckedKeysResponse } from "../responses/unchecked-keys";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function unchecked_keys<T extends UncheckedKeysRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    UncheckedKeysResponse<{
      JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
    }>
  >
>;
export function unchecked_keys(url: string, request: UncheckedKeysRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    UncheckedKeysRequest(),
    UncheckedKeysResponse({
      json_block: request.json_block === true,
    }),
    config
  );
}
