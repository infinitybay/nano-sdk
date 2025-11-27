import { FrontierCountRequest } from "../requests/frontier-count";
import { FrontierCountResponse } from "../responses/frontier-count";
import { postFunction } from "./post";

export const frontier_count = postFunction(FrontierCountRequest(), FrontierCountResponse());
