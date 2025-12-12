import { postFunction } from "../http/post";
import { PopulateBacklogRequest } from "../requests/populate-backlog";
import { PopulateBacklogResponse } from "../responses/populate-backlog";

export const populate_backlog = postFunction(PopulateBacklogRequest(), PopulateBacklogResponse());
