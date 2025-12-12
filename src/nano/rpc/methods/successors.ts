import { postFunction } from "../http/post";
import { SuccessorsRequest } from "../requests/successors";
import { SuccessorsResponse } from "../responses/successors";

export const successors = postFunction(SuccessorsRequest(), SuccessorsResponse());
