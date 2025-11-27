import { DelegatorsRequest } from "../requests/delegators";
import { DelegatorsResponse } from "../responses/delegators";
import { postFunction } from "./post";

export const delegators = postFunction(DelegatorsRequest(), DelegatorsResponse());
