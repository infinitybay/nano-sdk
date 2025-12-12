import { postFunction } from "../http/post";
import { BlockHashRequest } from "../requests/block-hash";
import { BlockHashResponse } from "../responses/block-hash";

export const block_hash = postFunction(BlockHashRequest(), BlockHashResponse());
