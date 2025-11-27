import { DelegatorsRequest } from "../requests/delegators";
import { DelegatorsResponse } from "../responses/delegators";
import { safePostFunction } from "./post";

export const delegators = safePostFunction(DelegatorsRequest(), DelegatorsResponse());
