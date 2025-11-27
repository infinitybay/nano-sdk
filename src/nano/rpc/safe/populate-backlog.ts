import { PopulateBacklogRequest } from "../requests/populate-backlog";
import { PopulateBacklogResponse } from "../responses/populate-backlog";
import { safePostFunction } from "./post";

export const populate_backlog = safePostFunction(PopulateBacklogRequest(), PopulateBacklogResponse());
