import { WorkPeersRequest } from "../requests/work-peers";
import { WorkPeersResponse } from "../responses/work-peers";
import { safePostFunction } from "./post";

export const work_peers = safePostFunction(WorkPeersRequest(), WorkPeersResponse());
