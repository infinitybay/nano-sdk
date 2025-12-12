import { postFunction } from "../http/post";
import { AccountsBalancesRequest } from "../requests/accounts-balances";
import { AccountsBalancesResponse } from "../responses/accounts-balances";

export const accounts_balances = postFunction(AccountsBalancesRequest(), AccountsBalancesResponse());
