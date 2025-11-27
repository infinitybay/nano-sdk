import { ChainRequest } from "../requests/chain";
import { ChainResponse } from "../responses/chain";
import { safePostFunction } from "./post";

export const chain = safePostFunction(ChainRequest(), ChainResponse());
