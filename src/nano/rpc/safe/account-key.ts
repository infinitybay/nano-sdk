import { AccountKeyRequest } from "../requests/account-key";
import { AccountKeyResponse } from "../responses/account-key";
import { safePostFunction } from "./post";

export const account_key = safePostFunction(AccountKeyRequest(), AccountKeyResponse());
