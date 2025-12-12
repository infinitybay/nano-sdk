import { postFunction } from "../http/post";
import { RepresentativesRequest } from "../requests/representatives";
import { RepresentativesResponse } from "../responses/representatives";

export const representatives = postFunction(RepresentativesRequest(), RepresentativesResponse());
