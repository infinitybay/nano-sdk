import { RepresentativesRequest } from "../requests/representatives";
import { RepresentativesResponse } from "../responses/representatives";
import { safePostFunction } from "./post";

export const representatives = safePostFunction(RepresentativesRequest(), RepresentativesResponse());
