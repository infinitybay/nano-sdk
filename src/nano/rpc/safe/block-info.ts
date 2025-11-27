import { BlockInfoRequest } from "../requests/block-info";
import { BlockInfoResponse } from "../responses/block-info";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function block_info<T extends BlockInfoRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    BlockInfoResponse<{
      INCLUDE_LINKED_ACCOUNT: BoolFlag<WithDefault<T, "include_linked_account", false>["include_linked_account"]>;
      JSON_BLOCK: BoolFlag<WithDefault<T, "json_block", false>["json_block"]>;
    }>
  >
>;
export function block_info(url: string, request: BlockInfoRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    BlockInfoRequest(),
    BlockInfoResponse({
      include_linked_account: request.include_linked_account === true,
      json_block: request.json_block === true,
    }),
    config
  );
}
