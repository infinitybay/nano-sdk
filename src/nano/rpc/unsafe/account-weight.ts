import { AccountWeightRequest } from "../requests/account-weight";
import { AccountWeightResponse } from "../responses/account-weight";
import { postFunction } from "./post";

export const account_weight = postFunction(AccountWeightRequest(), AccountWeightResponse());
