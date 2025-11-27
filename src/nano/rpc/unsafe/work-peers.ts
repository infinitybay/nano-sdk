import { WorkPeersRequest } from "../requests/work-peers";
import { WorkPeersResponse } from "../responses/work-peers";
import { postFunction } from "./post";

export const work_peers = postFunction(WorkPeersRequest(), WorkPeersResponse());
