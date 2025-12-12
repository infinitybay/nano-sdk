import { postFunction } from "../http/post";
import { AccountGetRequest } from "../requests/account-get";
import { AccountGetResponse } from "../responses/account-get";

export const account_get = postFunction(AccountGetRequest(), AccountGetResponse());
