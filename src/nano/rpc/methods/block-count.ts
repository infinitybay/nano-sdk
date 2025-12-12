import { postFunction } from "../http/post";
import { BlockCountRequest } from "../requests/block-count";
import { BlockCountResponse } from "../responses/block-count";

export const block_count = postFunction(BlockCountRequest(), BlockCountResponse());
