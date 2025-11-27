import { BlockAccountRequest } from "../requests/block-account";
import { BlockAccountResponse } from "../responses/block-account";
import { safePostFunction } from "./post";

export const block_account = safePostFunction(BlockAccountRequest(), BlockAccountResponse());
