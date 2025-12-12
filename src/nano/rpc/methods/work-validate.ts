import { postFunction } from "../http/post";
import { WorkValidateRequest } from "../requests/work-validate";
import { WorkValidateResponse } from "../responses/work-validate";

export const work_validate = postFunction(WorkValidateRequest(), WorkValidateResponse());
