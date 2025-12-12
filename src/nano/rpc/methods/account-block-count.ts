import { postFunction } from "../http/post";
import { AccountBlockCountRequest } from "../requests/account-block-count";
import { AccountBlockCountResponse } from "../responses/account-block-count";

export const account_block_count = postFunction(AccountBlockCountRequest(), AccountBlockCountResponse());
