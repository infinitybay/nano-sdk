import { ElectionStatisticsRequest } from "../requests/election-statistics";
import { ElectionStatisticsResponse } from "../responses/election-statistics";
import { postFunction } from "./post";

export const election_statistics = postFunction(ElectionStatisticsRequest(), ElectionStatisticsResponse());
