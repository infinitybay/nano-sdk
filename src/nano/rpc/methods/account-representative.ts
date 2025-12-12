import { postFunction } from "../http/post";
import { AccountRepresentativeRequest } from "../requests/account-representative";
import { AccountRepresentativeResponse } from "../responses/account-representative";

export const account_representative = postFunction(AccountRepresentativeRequest(), AccountRepresentativeResponse());
