import { AccountBalanceRequest } from "../requests/account-balance";
import { AccountBalanceResponse } from "../responses/account-balance";
import { safePostFunction } from "./post";

export const account_balance = safePostFunction(AccountBalanceRequest(), AccountBalanceResponse());
