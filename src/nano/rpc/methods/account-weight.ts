import { postFunction } from "../http/post";
import { AccountWeightRequest } from "../requests/account-weight";
import { AccountWeightResponse } from "../responses/account-weight";

export const account_weight = postFunction(AccountWeightRequest(), AccountWeightResponse());
