import { postFunction } from "../http/post";
import { AccountsRepresentativesRequest } from "../requests/accounts-representatives";
import { AccountsRepresentativesResponse } from "../responses/accounts-representatives";

export const accounts_representatives = postFunction(
  AccountsRepresentativesRequest(),
  AccountsRepresentativesResponse()
);
