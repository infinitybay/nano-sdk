import { BlockCountRequest } from "../requests/block-count";
import { BlockCountResponse } from "../responses/block-count";
import { safePostFunction } from "./post";

export const block_count = safePostFunction(BlockCountRequest(), BlockCountResponse());
