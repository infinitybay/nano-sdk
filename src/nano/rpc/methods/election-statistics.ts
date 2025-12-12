import { postFunction } from "../http/post";
import { ElectionStatisticsRequest } from "../requests/election-statistics";
import { ElectionStatisticsResponse } from "../responses/election-statistics";

export const election_statistics = postFunction(ElectionStatisticsRequest(), ElectionStatisticsResponse());
