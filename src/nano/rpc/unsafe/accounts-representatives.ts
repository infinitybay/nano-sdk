import { AccountsRepresentativesRequest } from "../requests/accounts-representatives";
import { AccountsRepresentativesResponse } from "../responses/accounts-representatives";
import { postFunction } from "./post";

export const accounts_representatives = postFunction(
  AccountsRepresentativesRequest(),
  AccountsRepresentativesResponse()
);
