import { PopulateBacklogRequest } from "../requests/populate-backlog";
import { PopulateBacklogResponse } from "../responses/populate-backlog";
import { postFunction } from "./post";

export const populate_backlog = postFunction(PopulateBacklogRequest(), PopulateBacklogResponse());
