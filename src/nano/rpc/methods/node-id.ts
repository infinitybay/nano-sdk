import { postFunction } from "../http/post";
import { NodeIdRequest } from "../requests/node-id";
import { NodeIdResponse } from "../responses/node-id";

export const node_id = postFunction(NodeIdRequest(), NodeIdResponse());
