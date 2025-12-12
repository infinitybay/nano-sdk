import { postFunction } from "../http/post";
import { StopRequest } from "../requests/stop";
import { StopResponse } from "../responses/stop";

export const stop = postFunction(StopRequest(), StopResponse());
