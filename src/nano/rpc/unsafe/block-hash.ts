import { BlockHashRequest } from "../requests/block-hash";
import { BlockHashResponse } from "../responses/block-hash";
import { postFunction } from "./post";

export const block_hash = postFunction(BlockHashRequest(), BlockHashResponse());
