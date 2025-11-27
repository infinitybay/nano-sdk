import { WorkPeersClearRequest } from "../requests/work-peers-clear";
import { WorkPeersClearResponse } from "../responses/work-peers-clear";
import { postFunction } from "./post";

export const work_peers_clear = postFunction(WorkPeersClearRequest(), WorkPeersClearResponse());
