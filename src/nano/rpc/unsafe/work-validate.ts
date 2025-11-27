import { WorkValidateRequest } from "../requests/work-validate";
import { WorkValidateResponse } from "../responses/work-validate";
import { postFunction } from "./post";

export const work_validate = postFunction(WorkValidateRequest(), WorkValidateResponse());
