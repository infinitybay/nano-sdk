import { FrontiersRequest } from "../requests/frontiers";
import { FrontiersResponse } from "../responses/frontiers";
import { postFunction } from "./post";

export const frontiers = postFunction(FrontiersRequest(), FrontiersResponse());
