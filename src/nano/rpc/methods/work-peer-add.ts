import { postFunction } from "../http/post";
import { WorkPeerAddRequest } from "../requests/work-peer-add";
import { WorkPeerAddResponse } from "../responses/work-peer-add";

export const work_peer_add = postFunction(WorkPeerAddRequest(), WorkPeerAddResponse());
