import { AccountRepresentativeRequest } from "../requests/account-representative";
import { AccountRepresentativeResponse } from "../responses/account-representative";
import { postFunction } from "./post";

export const account_representative = postFunction(AccountRepresentativeRequest(), AccountRepresentativeResponse());
