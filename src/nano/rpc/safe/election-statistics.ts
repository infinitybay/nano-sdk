import { ElectionStatisticsRequest } from "../requests/election-statistics";
import { ElectionStatisticsResponse } from "../responses/election-statistics";
import { safePostFunction } from "./post";

export const election_statistics = safePostFunction(ElectionStatisticsRequest(), ElectionStatisticsResponse());
