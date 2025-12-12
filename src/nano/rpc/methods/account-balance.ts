import { postFunction } from "../http/post";
import { AccountBalanceRequest } from "../requests/account-balance";
import { AccountBalanceResponse } from "../responses/account-balance";

export const account_balance = postFunction(AccountBalanceRequest(), AccountBalanceResponse());
