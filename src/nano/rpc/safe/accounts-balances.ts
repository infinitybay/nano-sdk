import { AccountsBalancesRequest } from "../requests/accounts-balances";
import { AccountsBalancesResponse } from "../responses/accounts-balances";
import { safePostFunction } from "./post";

export const accounts_balances = safePostFunction(AccountsBalancesRequest(), AccountsBalancesResponse());
