import { postFunction } from "../http/post";
import { DelegatorsRequest } from "../requests/delegators";
import { DelegatorsResponse } from "../responses/delegators";

export const delegators = postFunction(DelegatorsRequest(), DelegatorsResponse());
