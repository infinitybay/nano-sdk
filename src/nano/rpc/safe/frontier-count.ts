import { FrontierCountRequest } from "../requests/frontier-count";
import { FrontierCountResponse } from "../responses/frontier-count";
import { safePostFunction } from "./post";

export const frontier_count = safePostFunction(FrontierCountRequest(), FrontierCountResponse());
