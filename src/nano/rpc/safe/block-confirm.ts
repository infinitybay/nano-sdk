import { BlockConfirmRequest } from "../requests/block-confirm";
import { BlockConfirmResponse } from "../responses/block-confirm";
import { safePostFunction } from "./post";

export const block_confirm = safePostFunction(BlockConfirmRequest(), BlockConfirmResponse());
