import { BlockCountRequest } from "../requests/block-count";
import { BlockCountResponse } from "../responses/block-count";
import { postFunction } from "./post";

export const block_count = postFunction(BlockCountRequest(), BlockCountResponse());
