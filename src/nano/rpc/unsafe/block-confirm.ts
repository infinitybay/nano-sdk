import { BlockConfirmRequest } from "../requests/block-confirm";
import { BlockConfirmResponse } from "../responses/block-confirm";
import { postFunction } from "./post";

export const block_confirm = postFunction(BlockConfirmRequest(), BlockConfirmResponse());
