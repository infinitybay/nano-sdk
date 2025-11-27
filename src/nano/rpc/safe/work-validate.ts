import { WorkValidateRequest } from "../requests/work-validate";
import { WorkValidateResponse } from "../responses/work-validate";
import { safePostFunction } from "./post";

export const work_validate = safePostFunction(WorkValidateRequest(), WorkValidateResponse());
