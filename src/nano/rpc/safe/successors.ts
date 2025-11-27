import { SuccessorsRequest } from "../requests/successors";
import { SuccessorsResponse } from "../responses/successors";
import { safePostFunction } from "./post";

export const successors = safePostFunction(SuccessorsRequest(), SuccessorsResponse());
