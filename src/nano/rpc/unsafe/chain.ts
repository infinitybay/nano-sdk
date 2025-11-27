import { ChainRequest } from "../requests/chain";
import { ChainResponse } from "../responses/chain";
import { postFunction } from "./post";

export const chain = postFunction(ChainRequest(), ChainResponse());
