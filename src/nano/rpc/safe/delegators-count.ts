import { DelegatorsCountRequest } from "../requests/delegators-count";
import { DelegatorsCountResponse } from "../responses/delegators-count";
import { safePostFunction } from "./post";

export const delegators_count = safePostFunction(DelegatorsCountRequest(), DelegatorsCountResponse());
