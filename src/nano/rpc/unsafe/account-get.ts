import { AccountGetRequest } from "../requests/account-get";
import { AccountGetResponse } from "../responses/account-get";
import { postFunction } from "./post";

export const account_get = postFunction(AccountGetRequest(), AccountGetResponse());
