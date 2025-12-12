import { postFunction } from "../http/post";
import { AccountsFrontiersRequest } from "../requests/accounts-frontiers";
import { AccountsFrontiersResponse } from "../responses/accounts-frontiers";

export const accounts_frontiers = postFunction(AccountsFrontiersRequest(), AccountsFrontiersResponse());
