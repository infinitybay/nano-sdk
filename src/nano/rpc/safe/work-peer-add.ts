import { WorkPeerAddRequest } from "../requests/work-peer-add";
import { WorkPeerAddResponse } from "../responses/work-peer-add";
import { safePostFunction } from "./post";

export const work_peer_add = safePostFunction(WorkPeerAddRequest(), WorkPeerAddResponse());
