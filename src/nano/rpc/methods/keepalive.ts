import { postFunction } from "../http/post";
import { KeepaliveRequest } from "../requests/keepalive";
import { KeepaliveResponse } from "../responses/keepalive";

export const keepalive = postFunction(KeepaliveRequest(), KeepaliveResponse());
