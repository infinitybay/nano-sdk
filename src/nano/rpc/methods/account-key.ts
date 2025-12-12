import { postFunction } from "../http/post";
import { AccountKeyRequest } from "../requests/account-key";
import { AccountKeyResponse } from "../responses/account-key";

export const account_key = postFunction(AccountKeyRequest(), AccountKeyResponse());
