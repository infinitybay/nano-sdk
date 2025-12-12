import { postFunction } from "../http/post";
import { BlockConfirmRequest } from "../requests/block-confirm";
import { BlockConfirmResponse } from "../responses/block-confirm";

export const block_confirm = postFunction(BlockConfirmRequest(), BlockConfirmResponse());
