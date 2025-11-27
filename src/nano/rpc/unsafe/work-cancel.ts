import { WorkCancelRequest } from "../requests/work-cancel";
import { WorkCancelResponse } from "../responses/work-cancel";
import { postFunction } from "./post";

export const work_cancel = postFunction(WorkCancelRequest(), WorkCancelResponse());
