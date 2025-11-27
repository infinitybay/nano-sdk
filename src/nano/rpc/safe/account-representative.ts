import { AccountRepresentativeRequest } from "../requests/account-representative";
import { AccountRepresentativeResponse } from "../responses/account-representative";
import { safePostFunction } from "./post";

export const account_representative = safePostFunction(AccountRepresentativeRequest(), AccountRepresentativeResponse());
