import { AccountBlockCountRequest } from "../requests/account-block-count";
import { AccountBlockCountResponse } from "../responses/account-block-count";
import { postFunction } from "./post";

export const account_block_count = postFunction(AccountBlockCountRequest(), AccountBlockCountResponse());
