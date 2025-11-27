import { UnopenedRequest } from "../requests/unopened";
import { UnopenedResponse } from "../responses/unopened";
import { safePostFunction } from "./post";

export const unopened = safePostFunction(UnopenedRequest(), UnopenedResponse());
