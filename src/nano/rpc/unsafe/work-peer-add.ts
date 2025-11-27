import { WorkPeerAddRequest } from "../requests/work-peer-add";
import { WorkPeerAddResponse } from "../responses/work-peer-add";
import { postFunction } from "./post";

export const work_peer_add = postFunction(WorkPeerAddRequest(), WorkPeerAddResponse());
