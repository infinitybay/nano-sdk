import { KeepaliveRequest } from "../requests/keepalive";
import { KeepaliveResponse } from "../responses/keepalive";
import { postFunction } from "./post";

export const keepalive = postFunction(KeepaliveRequest(), KeepaliveResponse());
