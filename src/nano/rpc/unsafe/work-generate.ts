import { WorkGenerateRequest } from "../requests/work-generate";
import { WorkGenerateResponse } from "../responses/work-generate";
import { postFunction } from "./post";

export const work_generate = postFunction(WorkGenerateRequest(), WorkGenerateResponse());
