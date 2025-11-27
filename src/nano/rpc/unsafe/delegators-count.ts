import { DelegatorsCountRequest } from "../requests/delegators-count";
import { DelegatorsCountResponse } from "../responses/delegators-count";
import { postFunction } from "./post";

export const delegators_count = postFunction(DelegatorsCountRequest(), DelegatorsCountResponse());
