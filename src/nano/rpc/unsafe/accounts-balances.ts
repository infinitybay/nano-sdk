import { AccountsBalancesRequest } from "../requests/accounts-balances";
import { AccountsBalancesResponse } from "../responses/accounts-balances";
import { postFunction } from "./post";

export const accounts_balances = postFunction(AccountsBalancesRequest(), AccountsBalancesResponse());
