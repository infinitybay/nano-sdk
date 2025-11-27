import { BlockCreateRequest } from "../requests/block-create";
import { BlockCreateResponse } from "../responses/block-create";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function block_create<const T extends BlockCreateRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    BlockCreateResponse<{
      JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
    }>
  >
>;
export function block_create(url: string, request: BlockCreateRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    BlockCreateRequest(),
    BlockCreateResponse({
      json_block: request.json_block === true,
    }),
    config
  );
}
