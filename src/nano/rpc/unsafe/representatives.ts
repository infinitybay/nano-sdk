import { RepresentativesRequest } from "../requests/representatives";
import { RepresentativesResponse } from "../responses/representatives";
import { postFunction } from "./post";

export const representatives = postFunction(RepresentativesRequest(), RepresentativesResponse());
