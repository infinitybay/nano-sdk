import { WorkGenerateRequest } from "../requests/work-generate";
import { WorkGenerateResponse } from "../responses/work-generate";
import { safePostFunction } from "./post";

export const work_generate = safePostFunction(WorkGenerateRequest(), WorkGenerateResponse());
