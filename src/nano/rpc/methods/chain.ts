import { postFunction } from "../http/post";
import { ChainRequest } from "../requests/chain";
import { ChainResponse } from "../responses/chain";

export const chain = postFunction(ChainRequest(), ChainResponse());
