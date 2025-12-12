import { postFunction } from "../http/post";
import { WorkCancelRequest } from "../requests/work-cancel";
import { WorkCancelResponse } from "../responses/work-cancel";

export const work_cancel = postFunction(WorkCancelRequest(), WorkCancelResponse());
