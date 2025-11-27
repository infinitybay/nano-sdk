import { NodeIdRequest } from "../requests/node-id";
import { NodeIdResponse } from "../responses/node-id";
import { safePostFunction } from "./post";

export const node_id = safePostFunction(NodeIdRequest(), NodeIdResponse());
