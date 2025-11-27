import { StopRequest } from "../requests/stop";
import { StopResponse } from "../responses/stop";
import { postFunction } from "./post";

export const stop = postFunction(StopRequest(), StopResponse());
