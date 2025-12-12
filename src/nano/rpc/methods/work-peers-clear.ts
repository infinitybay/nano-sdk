import { postFunction } from "../http/post";
import { WorkPeersClearRequest } from "../requests/work-peers-clear";
import { WorkPeersClearResponse } from "../responses/work-peers-clear";

export const work_peers_clear = postFunction(WorkPeersClearRequest(), WorkPeersClearResponse());
