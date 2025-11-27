import { WorkCancelRequest } from "../requests/work-cancel";
import { WorkCancelResponse } from "../responses/work-cancel";
import { safePostFunction } from "./post";

export const work_cancel = safePostFunction(WorkCancelRequest(), WorkCancelResponse());
