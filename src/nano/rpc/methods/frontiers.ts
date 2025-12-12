import { postFunction } from "../http/post";
import { FrontiersRequest } from "../requests/frontiers";
import { FrontiersResponse } from "../responses/frontiers";

export const frontiers = postFunction(FrontiersRequest(), FrontiersResponse());
