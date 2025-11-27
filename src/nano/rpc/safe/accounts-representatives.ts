import { AccountsRepresentativesRequest } from "../requests/accounts-representatives";
import { AccountsRepresentativesResponse } from "../responses/accounts-representatives";
import { safePostFunction } from "./post";

export const accounts_representatives = safePostFunction(
  AccountsRepresentativesRequest(),
  AccountsRepresentativesResponse()
);
