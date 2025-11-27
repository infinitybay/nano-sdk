import { AccountsFrontiersRequest } from "../requests/accounts-frontiers";
import { AccountsFrontiersResponse } from "../responses/accounts-frontiers";
import { safePostFunction } from "./post";

export const accounts_frontiers = safePostFunction(AccountsFrontiersRequest(), AccountsFrontiersResponse());
