import { AccountKeyRequest } from "../requests/account-key";
import { AccountKeyResponse } from "../responses/account-key";
import { postFunction } from "./post";

export const account_key = postFunction(AccountKeyRequest(), AccountKeyResponse());
