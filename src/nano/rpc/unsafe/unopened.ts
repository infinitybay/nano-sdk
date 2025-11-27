import { UnopenedRequest } from "../requests/unopened";
import { UnopenedResponse } from "../responses/unopened";
import { postFunction } from "./post";

export const unopened = postFunction(UnopenedRequest(), UnopenedResponse());
