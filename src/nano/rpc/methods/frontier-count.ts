import { postFunction } from "../http/post";
import { FrontierCountRequest } from "../requests/frontier-count";
import { FrontierCountResponse } from "../responses/frontier-count";

export const frontier_count = postFunction(FrontierCountRequest(), FrontierCountResponse());
