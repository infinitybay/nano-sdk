import { postFunction } from "../http/post";
import { BlockAccountRequest } from "../requests/block-account";
import { BlockAccountResponse } from "../responses/block-account";

export const block_account = postFunction(BlockAccountRequest(), BlockAccountResponse());
