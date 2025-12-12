import { postFunction } from "../http/post";
import { WorkPeersRequest } from "../requests/work-peers";
import { WorkPeersResponse } from "../responses/work-peers";

export const work_peers = postFunction(WorkPeersRequest(), WorkPeersResponse());
