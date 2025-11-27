import { KeepaliveRequest } from "../requests/keepalive";
import { KeepaliveResponse } from "../responses/keepalive";
import { safePostFunction } from "./post";

export const keepalive = safePostFunction(KeepaliveRequest(), KeepaliveResponse());
