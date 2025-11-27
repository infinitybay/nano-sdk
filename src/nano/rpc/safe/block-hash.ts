import { BlockHashRequest } from "../requests/block-hash";
import { BlockHashResponse } from "../responses/block-hash";
import { safePostFunction } from "./post";

export const block_hash = safePostFunction(BlockHashRequest(), BlockHashResponse());
