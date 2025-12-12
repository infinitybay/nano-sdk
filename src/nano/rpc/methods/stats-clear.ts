import { postFunction } from "../http/post";
import { StatsClearRequest } from "../requests/stats-clear";
import { StatsClearResponse } from "../responses/stats-clear";

export const stats_clear = postFunction(StatsClearRequest(), StatsClearResponse());
