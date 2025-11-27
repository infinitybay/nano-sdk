import { FrontiersRequest } from "../requests/frontiers";
import { FrontiersResponse } from "../responses/frontiers";
import { safePostFunction } from "./post";

export const frontiers = safePostFunction(FrontiersRequest(), FrontiersResponse());
