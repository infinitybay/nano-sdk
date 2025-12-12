import { postFunction } from "../http/post";
import { WorkGenerateRequest } from "../requests/work-generate";
import { WorkGenerateResponse } from "../responses/work-generate";

export const work_generate = postFunction(WorkGenerateRequest(), WorkGenerateResponse());
