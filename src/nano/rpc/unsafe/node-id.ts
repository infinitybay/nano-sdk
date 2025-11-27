import { NodeIdRequest } from "../requests/node-id";
import { NodeIdResponse } from "../responses/node-id";
import { postFunction } from "./post";

export const node_id = postFunction(NodeIdRequest(), NodeIdResponse());
