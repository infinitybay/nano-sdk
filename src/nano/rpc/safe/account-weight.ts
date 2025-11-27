import { AccountWeightRequest } from "../requests/account-weight";
import { AccountWeightResponse } from "../responses/account-weight";
import { safePostFunction } from "./post";

export const account_weight = safePostFunction(AccountWeightRequest(), AccountWeightResponse());
