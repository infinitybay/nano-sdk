import { StopRequest } from "../requests/stop";
import { StopResponse } from "../responses/stop";
import { safePostFunction } from "./post";

export const stop = safePostFunction(StopRequest(), StopResponse());
