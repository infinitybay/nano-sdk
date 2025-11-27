import { WorkPeersClearRequest } from "../requests/work-peers-clear";
import { WorkPeersClearResponse } from "../responses/work-peers-clear";
import { safePostFunction } from "./post";

export const work_peers_clear = safePostFunction(WorkPeersClearRequest(), WorkPeersClearResponse());
