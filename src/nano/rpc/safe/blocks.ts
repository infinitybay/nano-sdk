import { BlocksRequest } from "../requests/blocks";
import { BlocksResponse } from "../responses/blocks";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function blocks<T extends BlocksRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    BlocksResponse<{
      JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
    }>
  >
>;
export function blocks(url: string, request: BlocksRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    BlocksRequest(),
    BlocksResponse({
      json_block: request.json_block === true,
    }),
    config
  );
}
