import { SuccessorsRequest } from "../requests/successors";
import { SuccessorsResponse } from "../responses/successors";
import { postFunction } from "./post";

export const successors = postFunction(SuccessorsRequest(), SuccessorsResponse());
