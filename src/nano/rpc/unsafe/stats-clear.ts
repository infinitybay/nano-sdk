import { StatsClearRequest } from "../requests/stats-clear";
import { StatsClearResponse } from "../responses/stats-clear";
import { postFunction } from "./post";

export const stats_clear = postFunction(StatsClearRequest(), StatsClearResponse());
