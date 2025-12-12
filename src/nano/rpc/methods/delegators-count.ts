import { postFunction } from "../http/post";
import { DelegatorsCountRequest } from "../requests/delegators-count";
import { DelegatorsCountResponse } from "../responses/delegators-count";

export const delegators_count = postFunction(DelegatorsCountRequest(), DelegatorsCountResponse());
