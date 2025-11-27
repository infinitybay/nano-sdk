import { AccountGetRequest } from "../requests/account-get";
import { AccountGetResponse } from "../responses/account-get";
import { safePostFunction } from "./post";

export const account_get = safePostFunction(AccountGetRequest(), AccountGetResponse());
