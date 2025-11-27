import { AccountBlockCountRequest } from "../requests/account-block-count";
import { AccountBlockCountResponse } from "../responses/account-block-count";
import { safePostFunction } from "./post";

export const account_block_count = safePostFunction(AccountBlockCountRequest(), AccountBlockCountResponse());
