import { BlockAccountRequest } from "../requests/block-account";
import { BlockAccountResponse } from "../responses/block-account";
import { postFunction } from "./post";

export const block_account = postFunction(BlockAccountRequest(), BlockAccountResponse());
